// ═══ ENTRY HISTORY ══════════════════════════════════
// ═══ MEMORIES — search, filter, on-this-day ═════════════════════
var memState = { query: '', filter: null }; // filter: {type, value, label} | null
var _memWiredUp = false;

function _extractPeople(entries){
  // Heuristic person tags: capitalized words (length ≥3) appearing in entry text.
  // Skips common English words to reduce noise.
  var stop = new Set(['The','And','But','Not','For','With','Was','Were','Has','Have','Had','This','That','These','Those','When','Where','What','Why','How','Who','Our','His','Her','Him','She','They','Them','Their','Its','Our','One','Two','Some','Any','All','Did','Does','Doing','Just','Only','Also','Even','Than','Then','Still','From','Into','Over','Under','Back','Like','Made','Make','Said','Say','Told','New','Old','Good','Bad','More','Less','Very','Much','Most','Here','There','Today','Tomorrow','Yesterday','Morning','Night','Day','April','May','June','July','August','September','October','November','December','January','February','March','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','It','Is','As','In','On','Of','Or','If','Be','By','We','Am','Do']);
  var counts = {};
  entries.forEach(function(e){
    if(!e.text) return;
    var m = e.text.match(/\b[A-Z][a-z]{2,}\b/g) || [];
    m.forEach(function(w){
      if(stop.has(w)) return;
      counts[w] = (counts[w]||0) + 1;
    });
  });
  // return array of {name, count} sorted by count desc
  return Object.keys(counts).map(function(n){ return {name:n, count:counts[n]}; })
    .sort(function(a,b){ return b.count - a.count; });
}

function _extractMoods(entries){
  var counts = {};
  entries.forEach(function(e){ if(e.emo) counts[e.emo] = (counts[e.emo]||0)+1; });
  return Object.keys(counts).sort(function(a,b){ return counts[b]-counts[a]; })
    .map(function(m){ return {name:m, count:counts[m]}; });
}

function _extractMonths(entries){
  var counts = {};
  entries.forEach(function(e){
    var iso = e.dateISO || '';
    var ym = iso.slice(0,7);
    if(ym) counts[ym] = (counts[ym]||0)+1;
  });
  return Object.keys(counts).sort().reverse()
    .map(function(ym){
      var parts = ym.split('-');
      var months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
      var label = months[parseInt(parts[1],10)-1] + ' ' + parts[0];
      return {value:ym, label:label, count:counts[ym]};
    });
}

function _matchesQuery(e, q){
  if(!q) return true;
  q = q.toLowerCase();
  var hay = [(e.text||''), (e.emo||''), (e.date||''), (e.intent||''), (e.ai||'')].join(' ').toLowerCase();
  return hay.indexOf(q) >= 0;
}
function _matchesFilter(e, f){
  if(!f) return true;
  if(f.type==='mood')  return (e.emo||'').toLowerCase() === f.value.toLowerCase();
  if(f.type==='person')return (e.text||'').indexOf(f.value) >= 0;
  if(f.type==='month') return (e.dateISO||'').slice(0,7) === f.value;
  if(f.type==='photos')return !!e.hasPhotos;
  return true;
}

function _renderOnThisDay(entries){
  var host = $('memOnThisDay'); var row = $('memOtdRow');
  if(!host || !row) return;
  row.innerHTML = '';
  // Don't show OTD while user is searching/filtering — it'd compete for attention.
  if(memState.query || memState.filter){ host.hidden = true; return; }
  var today = new Date();
  var todayMD = String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');
  var matches = [];
  entries.forEach(function(e){
    var iso = e.dateISO || '';
    if(!iso) return;
    var md = iso.slice(5);
    if(md !== todayMD) return;
    var entryDate = new Date(iso+'T12:00:00');
    var diffDays = Math.round((today - entryDate)/86400000);
    if(diffDays < 25) return; // only past — not today itself
    var years = Math.floor(diffDays/365);
    var months = Math.floor(diffDays/30);
    var badge;
    if(years >= 1)       badge = years + (years===1?' year ago':' years ago');
    else if(months >=11) badge = '1 year ago';
    else if(months >= 6) badge = months + ' months ago';
    else if(months >= 1) badge = months + (months===1?' month ago':' months ago');
    else                 badge = diffDays + ' days ago';
    matches.push({entry:e, badge:badge, diffDays:diffDays});
  });
  if(matches.length === 0){ host.hidden = true; return; }
  // sort oldest-first (so "1 year ago" appears first, then "6 months ago")
  matches.sort(function(a,b){ return b.diffDays - a.diffDays; });
  matches.slice(0,3).forEach(function(m){
    var card = document.createElement('div');
    card.className = 'mem-otd-card';
    var preview = (m.entry.text||'').split(/\s+/).slice(0,18).join(' ');
    if((m.entry.text||'').split(/\s+/).length > 18) preview += '…';
    card.innerHTML = '<span class="mem-otd-badge">'+m.badge+'</span>'
      + '<span class="mem-otd-emo">'+(m.entry.emo||'')+'</span>'
      + '<p class="mem-otd-text">\u201C'+preview+'\u201D</p>';
    card.addEventListener('click', function(){ openEntryDetail(m.entry); });
    row.appendChild(card);
  });
  host.hidden = false;
}

function _renderActiveFilter(){
  var host = $('memActiveFilters');
  if(!host) return;
  host.innerHTML = '';
  if(!memState.filter){ host.hidden = true; return; }
  var pill = document.createElement('span');
  pill.className = 'mem-active-pill';
  pill.innerHTML = '<span>'+memState.filter.label+'</span>'
    + '<button aria-label="remove">\u2715</button>';
  pill.querySelector('button').addEventListener('click', function(){
    memState.filter = null;
    document.querySelectorAll('#memChips .mem-chip').forEach(function(c){
      c.classList.toggle('active', c.dataset.filter==='all');
    });
    populateMemories();
  });
  host.appendChild(pill);
  host.hidden = false;
}

function populateMemories(){
  var entries = JSON.parse(localStorage.getItem('gc_entries') || '[]');
  var container = $('memResults');
  var emptyEl   = $('memoriesEmpty');
  var label     = $('memResultsLabel');
  if(!container) return;

  _renderOnThisDay(entries);
  _renderActiveFilter();

  // apply query + filter
  var filtered = entries.filter(function(e){
    return _matchesQuery(e, memState.query) && _matchesFilter(e, memState.filter);
  });

  container.innerHTML = '';
  if(entries.length === 0){
    if(emptyEl) emptyEl.style.display='';
    if(label) label.hidden = true;
    return;
  }
  if(emptyEl) emptyEl.style.display='none';

  // label
  if(label){
    label.hidden = false;
    if(memState.query || memState.filter){
      label.textContent = filtered.length + ' ' + (filtered.length===1?'match':'matches');
    } else {
      label.textContent = 'your recent entries';
    }
  }

  if(filtered.length === 0){
    var none = document.createElement('p');
    none.style.cssText = 'font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:13px;color:rgba(245,237,224,0.45);text-align:center;padding:24px 10px;margin:0';
    none.textContent = 'nothing matches here yet.';
    container.appendChild(none);
    return;
  }

  // newest first, cap at 50 on unfiltered view to keep things quick
  var list = filtered.slice().reverse();
  if(!memState.query && !memState.filter) list = list.slice(0, 50);

  list.forEach(function(e){
    var card = document.createElement('div');
    card.className = 'ph-mem-card';
    card.style.cursor = 'pointer';
    card.innerHTML = '<p style="font-family:\'DM Mono\',monospace;font-size:9px;color:var(--muted);margin-bottom:8px">DAY '
      + String(e.day||'').padStart(3,'0') + ' \u00B7 '
      + (e.date||'').toUpperCase() + ' \u00B7 '
      + (e.emo||'').toUpperCase() + (e.hasPhotos ? ' \u00B7 \u25A1' : '') + '</p>'
      + '<p style="font-style:italic;font-weight:300;font-size:14px;color:var(--text);line-height:1.7">\u201C'
      + ((e.text||'').length>140 ? (e.text||'').slice(0,137)+'\u2026' : (e.text||''))
      + '\u201D</p>';
    card.addEventListener('click', function(){ openEntryDetail(e); });
    container.appendChild(card);
  });
}

function _openMemPicker(type){
  var sheet = $('memPickerSheet');
  var title = $('memPickerTitle');
  var sub   = $('memPickerSub');
  var list  = $('memPickerList');
  var entries = JSON.parse(localStorage.getItem('gc_entries') || '[]');
  list.innerHTML = '';
  var items = [];
  sub.textContent = 'filter';
  if(type==='mood'){
    title.textContent = 'by mood';
    items = _extractMoods(entries).map(function(m){ return {value:m.name, label:m.name, count:m.count}; });
  } else if(type==='person'){
    title.textContent = 'by person';
    items = _extractPeople(entries).map(function(p){ return {value:p.name, label:p.name, count:p.count}; });
  } else if(type==='month'){
    title.textContent = 'by month';
    items = _extractMonths(entries).map(function(m){ return {value:m.value, label:m.label, count:m.count}; });
  }
  if(items.length === 0){
    var none = document.createElement('p');
    none.style.cssText = 'text-align:center;font-family:Fraunces,serif;font-style:italic;font-size:13px;color:rgba(245,237,224,0.5);padding:16px 8px;margin:0';
    none.textContent = type==='person' ? 'no names picked up from your entries yet.' : 'nothing to filter by yet.';
    list.appendChild(none);
  } else {
    items.forEach(function(it){
      var btn = document.createElement('button');
      btn.className = 'mem-picker-item';
      btn.innerHTML = '<span>'+it.label+'</span><span class="mem-picker-item-count">'+it.count+'</span>';
      btn.addEventListener('click', function(){
        memState.filter = {type:type, value:it.value, label: (type==='month'?it.label : type+': '+it.label)};
        _closeMemPicker();
        // mark the matching chip active
        document.querySelectorAll('#memChips .mem-chip').forEach(function(c){
          c.classList.toggle('active', c.dataset.filter===type);
        });
        populateMemories();
      });
      list.appendChild(btn);
    });
  }
  sheet.hidden = false;
  requestAnimationFrame(function(){ sheet.classList.add('open'); });
}
function _closeMemPicker(){
  var sheet = $('memPickerSheet');
  sheet.classList.remove('open');
  setTimeout(function(){ sheet.hidden = true; }, 320);
}

function _wireMemories(){
  if(_memWiredUp) return;
  _memWiredUp = true;
  // search — always visible; clear button fades in when there's text
  var _searchDebounce;
  var _searchInput = $('memSearchInput');
  var _searchClear = $('memSearchClear');
  _searchInput.addEventListener('input', function(){
    var v = this.value;
    _searchClear.hidden = v.length === 0;
    clearTimeout(_searchDebounce);
    _searchDebounce = setTimeout(function(){
      memState.query = v.trim();
      populateMemories();
    }, 120);
  });
  _searchClear.addEventListener('click', function(){
    _searchInput.value = '';
    _searchClear.hidden = true;
    memState.query = '';
    populateMemories();
    _searchInput.focus();
  });

  // filter chips
  document.querySelectorAll('#memChips .mem-chip').forEach(function(chip){
    chip.addEventListener('click', function(){
      var t = this.dataset.filter;
      if(t === 'all'){
        memState.filter = null;
        document.querySelectorAll('#memChips .mem-chip').forEach(function(c){
          c.classList.toggle('active', c.dataset.filter==='all');
        });
        populateMemories();
      } else if(t === 'photos'){
        memState.filter = {type:'photos', value:true, label:'with photos'};
        document.querySelectorAll('#memChips .mem-chip').forEach(function(c){
          c.classList.toggle('active', c.dataset.filter==='photos');
        });
        populateMemories();
      } else {
        _openMemPicker(t);
      }
    });
  });
  $('memPickerClose').addEventListener('click', _closeMemPicker);
  $('memPickerSheet').addEventListener('click', function(e){
    if(e.target === this) _closeMemPicker();
  });
}
_wireMemories();
// populate on load if entries exist
populateMemories();

// Held + Portrait population deferred — see after hasLogged declaration

