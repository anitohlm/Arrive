// ═══ MEMORIES — heatmap + memory-agent recall ═══════════════════
// The screen is deliberately sparse. Two sections:
//   1. Heatmap constellation — one dot per day since gc_start_date,
//      colored by that day's emotion (pulled from KNOT_PARAMS).
//   2. Memory agent card     — one surfaced entry from the past,
//      chosen by matching today's emotion (exact → family → recent).
// Day-1 users (zero entries) see only a quiet empty state.

// ── Emotion family groups — used to broaden "similar emotion" matches ──
var MEM_EMO_FAMILIES = {
  light:  ['grateful','alive','tender','calm','hopeful','light','passionate','content','relaxed','focused','inspired','certain'],
  between:['numb','quiet','foggy','restless','searching','nervous','lost','yearning','bored'],
  weight: ['hard','heavy','overwhelmed','sad','frustrated','anxious','livid','lonely','upset','insecure'],
  hard:   ['heartbroken','disappointed','exhausted','moved','ashamed','vulnerable','betrayed']
};
function _memFamilyOf(emo){
  for(var k in MEM_EMO_FAMILIES){
    if(MEM_EMO_FAMILIES[k].indexOf(emo) >= 0) return k;
  }
  return null;
}

// ── Helpers ──────────────────────────────────────────────
function _memPad(n){ return String(n).padStart(2,'0'); }
function _memISO(d){ return d.getFullYear()+'-'+_memPad(d.getMonth()+1)+'-'+_memPad(d.getDate()); }
function _memMonthLabel(d){
  var mons = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  return mons[d.getMonth()] + ' ' + d.getFullYear();
}
function _memColorFor(emo){
  try{
    if(typeof KNOT_PARAMS !== 'undefined' && KNOT_PARAMS[emo] && KNOT_PARAMS[emo].color){
      return KNOT_PARAMS[emo].color;
    }
    if(typeof EMO !== 'undefined' && EMO[emo] && EMO[emo].color){
      return EMO[emo].color;
    }
  }catch(e){}
  return '#c9943a';
}

// ── Render the heatmap ───────────────────────────────────
function _renderMemHeatmap(entries){
  var host = document.getElementById('memHeatmap');
  if(!host) return;
  host.innerHTML = '';

  var startISO = localStorage.getItem('gc_start_date');
  if(!startISO) return;

  var start = new Date(startISO + 'T12:00:00');
  var today = new Date();
  today.setHours(12,0,0,0);
  if(isNaN(start.getTime())) return;

  // ISO → entry lookup
  var byISO = {};
  entries.forEach(function(e){
    var iso = e.dateISO || e.date;
    if(iso) byISO[iso] = e;
  });

  // Walk every day of the year-long chain — start → start + 364 days — so future
  // days render as "not yet" placeholders instead of disappearing. Groups by calendar month.
  var end = new Date(start);
  end.setDate(start.getDate() + 364);
  // leap-aware: if the span crosses a Feb 29, still just 365 days — that's fine,
  // the chain is defined as 365 mornings regardless of calendar leap logic.

  var groups = [];
  var currentGroup = null;
  var cursor = new Date(start);
  var safety = 0;
  while(cursor <= end && safety < 500){
    safety++;
    var monthKey = cursor.getFullYear()+'-'+_memPad(cursor.getMonth()+1);
    if(!currentGroup || currentGroup.monthKey !== monthKey){
      currentGroup = {
        monthKey: monthKey,
        monthLabel: _memMonthLabel(cursor),
        firstDayOfWeek: null,
        days: []
      };
      groups.push(currentGroup);
    }
    var iso = _memISO(cursor);
    var entry = byISO[iso] || null;
    var isFuture = cursor > today;
    var isToday  = cursor.getTime() === today.getTime();
    var day = {
      iso: iso,
      dow: cursor.getDay(),
      logged: !!entry,
      future: isFuture,
      today: isToday && !entry,
      emo: entry ? entry.emo : null,
      entry: entry
    };
    if(currentGroup.firstDayOfWeek === null) currentGroup.firstDayOfWeek = day.dow;
    currentGroup.days.push(day);
    cursor.setDate(cursor.getDate() + 1);
  }

  // dow: 0=Sun, 1=Mon…6=Sat. Grid is Mon→Sun → shift.
  function dowToIdx(dow){ return (dow + 6) % 7; }

  groups.forEach(function(g){
    var groupEl = document.createElement('div');
    groupEl.className = 'mem-month-group';

    var label = document.createElement('p');
    label.className = 'mem-month-label';
    label.textContent = g.monthLabel;
    groupEl.appendChild(label);

    var grid = document.createElement('div');
    grid.className = 'mem-dot-grid';

    // leading pads so first dot aligns with its weekday column
    var startOffset = dowToIdx(g.firstDayOfWeek);
    for(var i = 0; i < startOffset; i++){
      var pad = document.createElement('i');
      pad.className = 'mem-dot mem-dot--pad';
      grid.appendChild(pad);
    }

    g.days.forEach(function(d){
      var dot = document.createElement('button');
      dot.type = 'button';
      var cls = 'mem-dot ';
      if(d.logged) cls += 'mem-dot--filled';
      else if(d.today) cls += 'mem-dot--today';
      else if(d.future) cls += 'mem-dot--future';
      else cls += 'mem-dot--empty';
      dot.className = cls;
      if(d.logged){
        var c = _memColorFor(d.emo);
        dot.style.background = c;
        dot.style.boxShadow = '0 0 6px ' + c + '66';
        dot.setAttribute('aria-label', d.iso + ' · ' + (d.emo || 'logged'));
        dot.title = d.iso + ' · ' + (d.emo || '');
        (function(entry){
          dot.addEventListener('click', function(){
            if(typeof openEntryDetail === 'function' && entry) openEntryDetail(entry);
          });
        })(d.entry);
      } else if(d.today){
        dot.title = d.iso + ' · today, waiting';
        dot.disabled = true;
      } else if(d.future){
        dot.title = d.iso + ' · not yet';
        dot.disabled = true;
      } else {
        dot.title = d.iso + ' · not written';
        dot.disabled = true;
      }
      grid.appendChild(dot);
    });

    groupEl.appendChild(grid);
    host.appendChild(groupEl);
  });
}

// ── Pick a past entry to surface ─────────────────────────
// Returns null if there's nothing truly from the past to draw from.
// "the chain remembers" is only honest if there's a past to remember.
function _pickMemoryEntry(entries){
  if(!entries || entries.length < 2) return null; // need at least one PAST entry

  // today's emotion — prefer pending draft, else most-recent entry
  var todayEmo = null;
  try{ todayEmo = window._pendingEmo || null; }catch(e){}
  if(!todayEmo && entries.length > 0) todayEmo = entries[entries.length - 1].emo || null;

  // Candidate pool excludes the very latest entry so we never surface today's own writing.
  var pool = entries.slice(0, -1);

  function longestBy(filterFn){
    var hits = pool.filter(filterFn);
    if(hits.length === 0) return null;
    return hits.reduce(function(best, e){
      var len = (e.text || '').length;
      var bestLen = best ? (best.text || '').length : -1;
      return len > bestLen ? e : best;
    }, null);
  }

  // 1) exact emotion match, longest
  var match = todayEmo ? longestBy(function(e){ return e.emo === todayEmo; }) : null;

  // 2) same family, longest
  if(!match && todayEmo){
    var fam = _memFamilyOf(todayEmo);
    if(fam){
      var famSet = {};
      MEM_EMO_FAMILIES[fam].forEach(function(x){ famSet[x] = true; });
      match = longestBy(function(e){ return !!famSet[e.emo]; });
    }
  }

  // 3) fallback — most recent past entry
  if(!match) match = pool[pool.length - 1] || null;

  return match;
}

// ── Render the memory agent card ─────────────────────────
function _renderMemAgentCard(entries){
  var card = document.getElementById('memAgentCard');
  if(!card) return;
  var picked = _pickMemoryEntry(entries);
  if(!picked || !picked.text){
    card.hidden = true;
    return;
  }
  var metaEl = document.getElementById('memAgentMeta');
  var textEl = document.getElementById('memAgentText');
  var dateEl = document.getElementById('memAgentDate');
  var photosEl = document.getElementById('memAgentPhotos');
  if(metaEl) metaEl.textContent = 'DAY ' + String(picked.day || '').padStart(3,'0') + ' — ' + (picked.emo || '');
  if(textEl) textEl.textContent = '\u201C' + picked.text + '\u201D';

  // ── Photos ──
  // If the recalled entry carried photos (user-attached base64 data URLs),
  // render them as a small gallery above the quote so the memory returns
  // with its visual context, not just text. Data URLs are validated to
  // prevent injection of arbitrary schemes.
  if(photosEl){
    photosEl.innerHTML = '';
    var photos = Array.isArray(picked.photos) ? picked.photos : [];
    var safe = photos.filter(function(p){
      return p && typeof p.dataUrl === 'string' &&
             /^data:image\/(jpeg|png|webp);base64,/i.test(p.dataUrl);
    }).slice(0, 3); // cap at 3 to match upload limit
    if(safe.length === 0){
      photosEl.hidden = true;
      photosEl.classList.remove('mem-agent-photos--1','mem-agent-photos--2','mem-agent-photos--3');
    } else {
      photosEl.hidden = false;
      photosEl.classList.remove('mem-agent-photos--1','mem-agent-photos--2','mem-agent-photos--3');
      photosEl.classList.add('mem-agent-photos--' + safe.length);
      safe.forEach(function(p, i){
        var img = document.createElement('img');
        img.className = 'mem-agent-photo';
        img.src = p.dataUrl;
        img.alt = 'memory from day ' + (picked.day || '');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.style.animationDelay = (120 + i * 120) + 'ms';
        photosEl.appendChild(img);
      });
    }
  }
  if(dateEl){
    var dateTxt = '';
    try{
      var iso = picked.dateISO || '';
      if(/^\d{4}-\d{2}-\d{2}/.test(iso)){
        var d = new Date(iso+'T12:00:00');
        var mons = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
        dateTxt = mons[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
      } else if(picked.date){
        dateTxt = String(picked.date).toLowerCase();
      }
    }catch(e){}
    dateEl.textContent = dateTxt;
  }
  card.hidden = false;
}

// ── Orchestrator ─────────────────────────────────────────
function populateMemories(){
  var entries = [];
  try{ entries = JSON.parse(localStorage.getItem('gc_entries') || '[]'); }catch(e){}

  var emptyEl   = document.getElementById('memEmpty');
  var heatmapEl = document.getElementById('memHeatmapSection');
  var hintEl    = document.getElementById('memFirstHint');
  var cardEl    = document.getElementById('memAgentCard');

  // Day 0 — no entries at all
  if(entries.length === 0){
    if(emptyEl)   emptyEl.hidden = false;
    if(heatmapEl) heatmapEl.hidden = true;
    if(hintEl)    hintEl.hidden = true;
    if(cardEl)    cardEl.hidden = true;
    return;
  }

  if(emptyEl)   emptyEl.hidden = true;
  if(heatmapEl) heatmapEl.hidden = false;
  _renderMemHeatmap(entries);

  // 1 entry → hint ("constellation will grow"), no memory card
  // 2+ entries → memory card, no hint
  if(entries.length < 2){
    if(hintEl) hintEl.hidden = false;
    if(cardEl) cardEl.hidden = true;
  } else {
    if(hintEl) hintEl.hidden = true;
    _renderMemAgentCard(entries); // sets cardEl hidden if pick returns null
  }
}

// populate on load
populateMemories();
