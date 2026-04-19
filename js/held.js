// ═══ STREAK + HELD + PORTRAIT ═══════════════════════

// current consecutive streak — counts back from today through logged days
// monthly one-word summary by top emotion
var PORTRAIT_WORDS = {
  calm:'stillness', tender:'softness', grateful:'fullness',
  hard:'weight', heavy:'carrying', overwhelmed:'floods',
  alive:'fire', numb:'quiet', hopeful:'becoming',
  light:'brightness', quiet:'hush', foggy:'unclear',
  restless:'searching', searching:'seeking', sad:'grief',
  frustrated:'friction', anxious:'watchful', heartbroken:'breaking',
  disappointed:'longing', exhausted:'rest', moved:'opening',
  passionate:'flame', nervous:'tremor', livid:'burning',
  lonely:'solitude', ashamed:'hiding',
  certain:'clarity', content:'enough', focused:'aim',
  inspired:'spark', lost:'drift', relaxed:'ease',
  vulnerable:'unguarded', yearning:'reaching', betrayed:'breach',
  bored:'flatness', insecure:'wobble', upset:'unsettled'
};
var PORTRAIT_MESSAGES = {
  calm:'you found stillness when the world asked for more.',
  tender:'you let yourself be soft. that is not weakness.',
  grateful:'you noticed beauty in the everyday — that is everything.',
  hard:'you showed up on days that asked too much. that is courage.',
  heavy:'you carried what you could and still wrote it down.',
  overwhelmed:'one small word at a time, you kept going.',
  alive:'you burned bright this month, and the chain remembers.',
  numb:'even numbness deserves its witness. you gave it one.',
  hopeful:'you kept leaning toward something. it\u2019s leaning back.',
  light:'you noticed the lightness. that\u2019s the whole practice.',
  quiet:'a month of hush. you honored it fully.',
  foggy:'you found something in the fog. that\u2019s no small thing.',
  restless:'you gave your restlessness a direction. it worked.',
  searching:'you searched. the chain was the lamp.',
  sad:'sad months count too. yours was held.',
  frustrated:'you cared enough to be frustrated. that\u2019s love.',
  anxious:'one small safe thing at a time. you made it through.',
  heartbroken:'the chain held what you couldn\u2019t carry alone.',
  disappointed:'not the month you hoped for. still the month you made.',
  exhausted:'you showed up tired. that\u2019s the bravest kind of showing up.',
  moved:'something moved you this month. the chain felt it too.',
  passionate:'you burned for something this month. that is its own kind of love.',
  nervous:'you stayed close to the edge and still arrived. that is bravery.',
  livid:'you were angry. it was real. the chain held that too.',
  lonely:'loneliness is honest about what it wants. the chain kept you company.',
  ashamed:'you kept showing up when you wanted to disappear. that counts.',
  certain:'you knew what you knew. that kind of steadiness is rare.',
  content:'enough arrived, more than once. you noticed. that is the whole practice.',
  focused:'you kept your attention where it mattered. the chain felt it.',
  inspired:'something sparked in you. you didn\u2019t let it pass unnoticed.',
  lost:'you didn\u2019t know the way and walked anyway. that is faith.',
  relaxed:'ease visited. you let it stay. nothing had to be earned.',
  vulnerable:'you let yourself be soft in a hard world. that took nerve.',
  yearning:'you wanted something. you didn\u2019t pretend otherwise. that is honest.',
  betrayed:'something broke that shouldn\u2019t have. you told the truth about it.',
  bored:'the flat days counted too. you were still here.',
  insecure:'you showed up when you doubted yourself. you came anyway.',
  upset:'upset is real information. the chain received it all.'
};
var YEAR_CLOSING_LINES = {
  calm:        'a whole year of quiet. you honored it.',
  tender:      'soft, and still here. a whole year of that.',
  grateful:    'a year of noticing. the chain remembers it all.',
  hard:        'a hard year held. that is its own kind of strength.',
  heavy:       'you carried what you could. a whole year of it.',
  overwhelmed: 'through the flood, 365 times. you kept arriving.',
  alive:       'you burned bright. the chain burned with you.',
  numb:        'even the still years are held. this one was.',
  hopeful:     'you kept leaning toward something. it is leaning back.',
  light:       'a year of catching the brightness. it stays.',
  quiet:       'a year of hush. you honored every whisper of it.',
  foggy:       'a whole year walked through. that is how it clears.',
  restless:    'restlessness pointed you somewhere. you followed, all year.',
  searching:   'a year of looking. the chain was your lamp.',
  sad:         'sad years count too. yours was held, fully.',
  frustrated:  'you cared enough to be frustrated. that was love.',
  anxious:     'small safe things, 365 times. you did them.',
  heartbroken: 'the chain held what you could not carry alone.',
  disappointed:'what disappointed you mattered. that means something, still.',
  exhausted:   'rest is part of the practice. you earned a whole year of it.',
  moved:       'a year let you be moved. that is a kind of courage.',
  passionate:  'a whole year of wanting. that is being alive, out loud.',
  nervous:     'you stayed by the edge all year. that takes its own courage.',
  livid:       'a year that asked anger of you. you told it the truth.',
  lonely:      'a year of wanting company. the chain was here, all of it.',
  ashamed:     'you showed up when you most wanted to hide. a whole year of that.',
  certain:     'a year you knew what you knew. that kind of steadiness is rare.',
  content:     'a whole year of enough. you let it be. that is the harder thing.',
  focused:     'you kept the thread of your attention for 365 days. that matters.',
  inspired:    'a year of sparks. you tended them. most people let theirs go out.',
  lost:        'you walked without knowing, a whole year. arriving still counts.',
  relaxed:     'a year of ease arriving. you didn\u2019t make it prove itself.',
  vulnerable:  'a year of being soft. that is not weakness \u2014 that is presence.',
  yearning:    'a year of reaching. the chain is the evidence you kept wanting.',
  betrayed:    'a year the ground moved. you still wrote. that is not nothing.',
  bored:       'even the flat year is held. you kept showing up for it.',
  insecure:    'you doubted yourself and arrived anyway. 365 times over.',
  upset:       'a year of weather. the chain rode it with you.'
};

function _buildYearCeremonyData(){
  var entries = [];
  try { entries = JSON.parse(localStorage.getItem('gc_entries') || '[]'); } catch(e) {}
  var startDateStr = localStorage.getItem('gc_start_date') || '';
  var startDate = startDateStr ? new Date(startDateStr) : new Date();
  var endDate = new Date();

  // emotion counts across all entries
  var emoCounts = {};
  var longestEntry = null;
  var longestLen = -1;
  entries.forEach(function(e){
    if (e.emo) emoCounts[e.emo] = (emoCounts[e.emo] || 0) + 1;
    var textLen = (e.text || '').length;
    if (textLen > longestLen) { longestLen = textLen; longestEntry = e; }
  });

  var sortedEmos = Object.keys(emoCounts).sort(function(a,b){ return emoCounts[b]-emoCounts[a]; });
  var dominant = sortedEmos[0] || 'calm';

  // fullest month (by entry count)
  var monthCounts = {};
  var monthBuckets = {};
  entries.forEach(function(e){
    var ym = (e.date || '').slice(0,7);
    if (!ym) return;
    monthCounts[ym] = (monthCounts[ym] || 0) + 1;
    (monthBuckets[ym] = monthBuckets[ym] || []).push(e);
  });
  var fullestYm = Object.keys(monthCounts).sort(function(a,b){ return monthCounts[b]-monthCounts[a]; })[0] || '';
  var fullestMonthName = '';
  if (fullestYm) {
    var MON = ['january','february','march','april','may','june','july','august','september','october','november','december'];
    fullestMonthName = MON[parseInt(fullestYm.slice(5,7),10) - 1] || '';
  }

  return {
    entries: entries,
    total: entries.length,
    startDate: startDate,
    endDate: endDate,
    startMonthName: startDate.toLocaleDateString('en-US',{month:'long'}).toLowerCase(),
    endMonthName: endDate.toLocaleDateString('en-US',{month:'long'}).toLowerCase(),
    year: startDate.getFullYear(),
    emoCounts: emoCounts,
    sortedEmos: sortedEmos,
    dominant: dominant,
    word: (PORTRAIT_WORDS[dominant] || dominant),
    fullestYm: fullestYm,
    fullestMonthName: fullestMonthName,
    monthBuckets: monthBuckets,
    longestEntry: longestEntry,
  };
}

function _numberToWords(n){
  if (n < 0 || !isFinite(n)) return String(n);
  var ones = ['','one','two','three','four','five','six','seven','eight','nine','ten',
    'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  var tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  function under100(x){
    if (x < 20) return ones[x];
    var t = Math.floor(x/10), o = x % 10;
    return o === 0 ? tens[t] : tens[t]+'-'+ones[o];
  }
  if (n === 0) return 'zero';
  if (n < 100) return under100(n);
  if (n < 1000) {
    var h = Math.floor(n/100), r = n % 100;
    return ones[h]+' hundred'+(r ? ' '+under100(r) : '');
  }
  // above 999: fallback to digits (we cap at 365 anyway)
  return String(n);
}

// Phase 1 of the annual ceremony — chronologically pulses each logged knot
// once around the ring, landing on today. Runs ~3.5s total.
// NOTE: This does NOT clear the splash canvas; it paints pulse glows on top
// of the already-rendered chain. The splash render loop keeps running.
function _weaveYearChain(onComplete){
  var logged = [];
  try { logged = JSON.parse(localStorage.getItem('gc_logged_dates') || '[]'); } catch(e) {}
  logged = logged.slice().sort(); // chronological

  if (logged.length === 0) { if (onComplete) onComplete(); return; }

  var canvas = document.getElementById('splashCanvas');
  if (!canvas) { if (onComplete) onComplete(); return; }
  var ctx = canvas.getContext('2d');

  var PER_KNOT_MS = Math.min(10, 3200 / logged.length);
  var PULSE_DURATION = 320; // each knot pulses for 320ms
  var startTs = performance.now();
  var totalDuration = logged.length * PER_KNOT_MS + PULSE_DURATION + 200;

  function frame(now){
    var elapsed = now - startTs;
    for (var i = 0; i < logged.length; i++) {
      var pulseStart = i * PER_KNOT_MS;
      var dt = elapsed - pulseStart;
      if (dt < 0 || dt > PULSE_DURATION) continue;
      var t = dt / PULSE_DURATION; // 0→1
      var alpha = Math.sin(t * Math.PI) * 0.9; // fade up then down
      // i is the chronological index into logged[]; day number = i + 1
      var pos = _getKnotPositionForDay(i + 1);
      if (!pos) continue;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      var R = 24;
      var grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, R);
      grd.addColorStop(0, 'rgba(255,240,180,'+alpha+')');
      grd.addColorStop(0.5, 'rgba(230,182,88,'+(alpha*0.5)+')');
      grd.addColorStop(1, 'rgba(201,148,58,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, R, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }

    if (elapsed < totalDuration) {
      requestAnimationFrame(frame);
    } else {
      if (onComplete) onComplete();
    }
  }
  requestAnimationFrame(frame);
}

// Helper: returns {x,y} screen position of the knot for a given day-number.
// The splash render already computes allKnotPositions — an array indexed
// by (dayNumber - 1). We reuse it directly.
function _getKnotPositionForDay(dayNumber){
  var arr = (typeof allKnotPositions !== 'undefined') ? allKnotPositions : (window._allKnotPositions || null);
  if (!arr) return null;
  if (dayNumber < 1) return null;
  return arr[dayNumber - 1] || null;
}

// Phase 2 — lift the splash chain upward and center it, scale slightly.
// Fades splash text + nav out. ~1.5s total.
function _floatChainUp(onComplete){
  var canvas = document.getElementById('splashCanvas');
  var splashStreak = document.getElementById('homeStreak');
  var loggedMsg = document.getElementById('loggedMsg');
  var bottomNav = document.getElementById('bottomNav');
  var settingsBtn = document.getElementById('settingsBtn');

  if (!canvas) { if (onComplete) onComplete(); return; }

  // Compute current rect → target rect (center of viewport)
  var rect = canvas.getBoundingClientRect();
  var vpCenterY = window.innerHeight / 2;
  var deltaY = vpCenterY - (rect.top + rect.height/2);

  canvas.style.transition = 'transform 1400ms cubic-bezier(0.25, 0.1, 0.25, 1)';
  canvas.style.transformOrigin = 'center center';
  requestAnimationFrame(function(){
    canvas.style.transform = 'translateY('+deltaY+'px) scale(1.12)';
  });

  [splashStreak, loggedMsg, bottomNav, settingsBtn].forEach(function(el){
    if (!el) return;
    el.style.transition = 'opacity 800ms ease';
    el.style.opacity = '0';
  });

  setTimeout(function(){ if (onComplete) onComplete(); }, 1500);
}

// Reverse — restore splash after ceremony dismissal.
function _floatChainDown(onComplete){
  var canvas = document.getElementById('splashCanvas');
  var splashStreak = document.getElementById('homeStreak');
  var loggedMsg = document.getElementById('loggedMsg');
  var bottomNav = document.getElementById('bottomNav');
  var settingsBtn = document.getElementById('settingsBtn');

  if (canvas) {
    canvas.style.transition = 'transform 900ms cubic-bezier(0.25, 0.1, 0.25, 1)';
    canvas.style.transform = '';
  }

  [splashStreak, loggedMsg, bottomNav, settingsBtn].forEach(function(el){
    if (!el) return;
    el.style.transition = 'opacity 600ms ease';
    el.style.opacity = '1';
  });

  setTimeout(function(){
    if (canvas) { canvas.style.transition = ''; canvas.style.transform = ''; }
    if (onComplete) onComplete();
  }, 1000);
}

// Shared wrapper for each page's outer div
function _yearPageWrap(inner, opts){
  opts = opts || {};
  return '<div style="padding:120px '+(opts.padX||'32px')+';display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;max-width:400px;margin:0 auto;gap:'+(opts.gap||'18px')+';box-sizing:border-box">'
    + inner + '</div>';
}

// Page 1 — One year announcement
function _renderYearPage1(pageEl, d){
  var inner = ''
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:22px;color:rgba(201,148,58,0.85);text-align:center;margin:0 0 4px">one year.</p>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:14px;color:rgba(230,182,88,0.55);text-align:center;margin:0 0 32px">'+d.startMonthName+' to '+d.endMonthName+'.</p>'
    + '<p style="font-family:DM Mono,monospace;font-size:9px;letter-spacing:0.18em;color:rgba(201,148,58,0.4);text-align:center;margin:0 0 4px;text-transform:uppercase">mornings</p>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:52px;color:rgba(201,148,58,0.9);text-align:center;margin:0 0 28px">'+d.total+'</p>'
    + '<p style="font-family:DM Mono,monospace;font-size:9px;letter-spacing:0.18em;color:rgba(201,148,58,0.4);text-align:center;margin:0 0 4px;text-transform:uppercase">your year, in one word</p>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:28px;color:rgba(245,237,224,0.85);text-align:center;margin:0 0 24px">'+d.word+'</p>'
    + '<p style="font-family:DM Mono,monospace;font-size:9px;letter-spacing:0.18em;color:rgba(201,148,58,0.4);text-align:center;margin:0 0 4px;text-transform:uppercase">fullest month</p>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:22px;color:rgba(245,237,224,0.75);text-align:center;margin:0">'+d.fullestMonthName+'</p>';
  pageEl.innerHTML = _yearPageWrap(inner, {gap:'4px'});
}

// Page 2 — What you carried
function _renderYearPage2(pageEl, d){
  var top5 = d.sortedEmos.slice(0,5);
  var rows = top5.map(function(emo){
    var count = d.emoCounts[emo];
    var pct = Math.round(count / d.total * 100);
    var color = (KNOT_PARAMS[emo] || KNOT_FALLBACK).color;
    return '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">'
      + '<span style="font-family:Fraunces,serif;font-style:italic;font-size:15px;color:rgba(245,237,224,0.85);flex:0 0 90px">'+emo+'</span>'
      + '<div style="flex:1;height:4px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden">'
      +   '<div style="width:'+pct+'%;height:100%;background:'+color+';opacity:0.8"></div>'
      + '</div>'
      + '<span style="font-family:DM Mono,monospace;font-size:10px;color:var(--gold);opacity:0.75">'+pct+'%</span>'
      + '</div>';
  }).join('');
  var inner = ''
    + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.4;text-transform:uppercase;letter-spacing:0.18em;margin:0 0 24px;text-align:center">what you carried</p>'
    + '<p style="font-family:Fraunces,serif;font-weight:300;font-size:28px;color:var(--text);text-align:center;margin:0 0 32px">'+d.total+' entries</p>'
    + rows;
  pageEl.innerHTML = _yearPageWrap(inner, {padX:'48px'});
}

// Page 3 — A moment that held
function _renderYearPage3(pageEl, d){
  var e = d.longestEntry;
  var text = e ? (e.text || '') : '';
  var dayLabel = e && typeof e.day === 'number' ? ('DAY '+String(e.day).padStart(3,'0')) : '';
  var emoLabel = e && e.emo ? e.emo : '';
  var inner = ''
    + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.4;text-transform:uppercase;letter-spacing:0.18em;margin:0">a moment that held</p>'
    + (dayLabel ? '<p style="font-family:DM Mono,monospace;font-size:9px;color:var(--gold);opacity:0.55;letter-spacing:0.12em;margin:0">'+dayLabel+(emoLabel?'  ·  '+emoLabel:'')+'</p>' : '')
    + '<div style="width:24px;height:1px;background:rgba(201,148,58,0.35);margin:4px 0"></div>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:17px;color:rgba(245,237,224,0.85);line-height:1.7;text-align:center;margin:0">'+ (text ? text : '—') +'</p>';
  pageEl.innerHTML = _yearPageWrap(inner);
}

// Page 4 — You arrived
function _renderYearPage4(pageEl, d){
  var word = _numberToWords(d.total);
  var inner = ''
    + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.4;text-transform:uppercase;letter-spacing:0.18em;margin:0">mornings</p>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:52px;color:var(--gold);letter-spacing:-0.02em;margin:12px 0;text-align:center;line-height:1.15">'+word+'</p>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:15px;color:rgba(245,237,224,0.5);text-align:center;margin:0">mornings you arrived</p>'
    + '<p style="font-family:DM Mono,monospace;font-size:9px;color:rgba(201,148,58,0.4);letter-spacing:0.08em;margin:28px 0 0">out of 365</p>';
  pageEl.innerHTML = _yearPageWrap(inner, {gap:'14px'});
}

// Page 5 — The year in twelve
function _renderYearPage5(pageEl, d){
  var MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var tilesHtml = '';
  for (var i = 0; i < 12; i++) {
    tilesHtml += '<div style="display:flex;flex-direction:column;align-items:center;gap:4px">'
      + '<canvas data-year-tile="'+i+'" width="72" height="72" style="width:72px;height:72px"></canvas>'
      + '<p style="font-family:DM Mono,monospace;font-size:9px;letter-spacing:0.12em;color:rgba(201,148,58,0.55);margin:0">'+MON[i]+'</p>'
      + '<p data-year-tile-word="'+i+'" style="font-family:Fraunces,serif;font-style:italic;font-size:11px;color:rgba(245,237,224,0.5);margin:0;min-height:14px"></p>'
      + '</div>';
  }
  var inner = ''
    + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.4;text-transform:uppercase;letter-spacing:0.18em;margin:0 0 16px">the year in twelve</p>'
    + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;width:100%">'+tilesHtml+'</div>';
  pageEl.innerHTML = _yearPageWrap(inner, {gap:'12px'});

  pageEl.querySelectorAll('canvas[data-year-tile]').forEach(function(c){
    var monthIdx = parseInt(c.getAttribute('data-year-tile'),10);
    var matchingYm = Object.keys(d.monthBuckets).find(function(ym){
      return parseInt(ym.slice(5,7),10) - 1 === monthIdx;
    });
    var wordEl = pageEl.querySelector('[data-year-tile-word="'+monthIdx+'"]');
    if (!matchingYm) {
      if (typeof drawGhostKnot === 'function') {
        var gctx = c.getContext('2d');
        drawGhostKnot(gctx, 36, 36, 60);
      }
      if (wordEl) wordEl.textContent = '';
      return;
    }
    var monthEntries = d.monthBuckets[matchingYm];
    if (typeof drawKnotOnCanvas === 'function') {
      drawKnotOnCanvas(c, monthEntries, monthIdx);
    }
    if (wordEl) {
      var mEmoCounts = {};
      monthEntries.forEach(function(e){ if (e.emo) mEmoCounts[e.emo] = (mEmoCounts[e.emo]||0)+1; });
      var mDom = Object.keys(mEmoCounts).sort(function(a,b){ return mEmoCounts[b]-mEmoCounts[a]; })[0];
      wordEl.textContent = (PORTRAIT_WORDS[mDom] || '');
    }
  });
}

// Page 6 — The thread held
function _renderYearPage6(pageEl, d){
  var closing = YEAR_CLOSING_LINES[d.dominant] || 'a whole year held. the chain remembers it all.';
  var inner = ''
    + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.4;text-transform:uppercase;letter-spacing:0.18em;margin:0">the thread held</p>'
    + '<div style="width:40px;height:1px;background:linear-gradient(90deg,transparent,#c9943a,transparent);opacity:0.6"></div>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:18px;color:var(--gold);line-height:1.7;text-align:center;margin:0">'+closing+'</p>';
  pageEl.innerHTML = _yearPageWrap(inner, {padX:'36px', gap:'20px'});
}

// Page 7 — Carry one forward (pendant chooser inlined)
function _renderYearPage7(pageEl, d){
  var header = ''
    + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.4;text-transform:uppercase;letter-spacing:0.18em;margin:0 0 16px;text-align:center">carry one forward</p>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:17px;color:rgba(245,237,224,0.75);text-align:center;margin:0 0 24px;line-height:1.6">one month becomes your pendant.<br>it hangs with you into year two.</p>';

  var cardsWrap = document.createElement('div');
  cardsWrap.style.cssText = 'width:100%;max-height:60vh;overflow-y:auto;-webkit-overflow-scrolling:touch';

  var ymKeys = Object.keys(d.monthBuckets).sort();
  ymKeys.forEach(function(ym){
    var monthEntries = d.monthBuckets[ym];
    if (monthEntries.length === 0) return;
    var monthIdx = parseInt(ym.slice(5,7),10) - 1;
    var MON = ['january','february','march','april','may','june','july','august','september','october','november','december'];
    var monthName = MON[monthIdx];

    var card = document.createElement('div');
    card.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:20px 16px;margin-bottom:12px;background:rgba(255,255,255,0.02);border:1px solid rgba(201,148,58,0.07);border-radius:16px;cursor:pointer;transition:all 200ms ease';

    var cv = document.createElement('canvas');
    cv.width = 100; cv.height = 100;
    cv.style.cssText = 'width:100px;height:100px;margin-bottom:12px';
    card.appendChild(cv);

    var nameEl = document.createElement('p');
    nameEl.textContent = monthName;
    nameEl.style.cssText = 'font-family:Fraunces,serif;font-style:italic;font-size:18px;color:rgba(245,237,224,0.8);margin:0';
    card.appendChild(nameEl);

    var mEmoCounts = {};
    monthEntries.forEach(function(e){ if (e.emo) mEmoCounts[e.emo] = (mEmoCounts[e.emo]||0)+1; });
    var mDom = Object.keys(mEmoCounts).sort(function(a,b){ return mEmoCounts[b]-mEmoCounts[a]; })[0];

    var wordEl = document.createElement('p');
    wordEl.textContent = (PORTRAIT_WORDS[mDom] || '');
    wordEl.style.cssText = 'font-family:Fraunces,serif;font-style:italic;font-size:12px;color:rgba(201,148,58,0.5);margin:4px 0 10px';
    card.appendChild(wordEl);

    var countEl = document.createElement('p');
    countEl.textContent = monthEntries.length + ' mornings';
    countEl.style.cssText = 'font-family:DM Mono,monospace;font-size:9px;color:rgba(201,148,58,0.4);letter-spacing:0.1em;margin:0';
    card.appendChild(countEl);

    cardsWrap.appendChild(card);

    requestAnimationFrame(function(){
      if (typeof drawKnotOnCanvas === 'function') drawKnotOnCanvas(cv, monthEntries, monthIdx);
    });

    card.addEventListener('click', function(){
      var year = d.startDate.getFullYear();
      localStorage.setItem('gc_pendant_year_'+year, JSON.stringify({
        ym: ym, monthName: monthName, dominant: mDom, count: monthEntries.length
      }));
      if (typeof window._invalidatePendantCache === 'function') window._invalidatePendantCache();
      if (typeof _dismissAnnualCeremony === 'function') _dismissAnnualCeremony();
    });
  });

  pageEl.innerHTML = '';
  var wrap = document.createElement('div');
  wrap.style.cssText = 'padding:80px 24px calc(80px + env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;height:100%;max-width:420px;margin:0 auto;box-sizing:border-box;overflow:hidden';
  wrap.innerHTML = header;
  wrap.appendChild(cardsWrap);
  pageEl.appendChild(wrap);
}

function _showAnnualCeremony(){
  if (document.getElementById('yearCeremonyOverlay')) return;
  var d = _buildYearCeremonyData();
  if (d.total === 0) return;

  var reduced = false;
  try { reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e) {}

  function phase3(){ _buildAnnualOverlay(d); }

  if (reduced) {
    // Skip weave; crossfade-only float
    var canvas = document.getElementById('splashCanvas');
    if (canvas) {
      canvas.style.transition = 'opacity 500ms ease';
      canvas.style.opacity = '0.4';
    }
    setTimeout(phase3, 500);
    return;
  }

  _weaveYearChain(function(){
    _floatChainUp(phase3);
  });
}

function _buildAnnualOverlay(d){
  var overlay = document.createElement('div');
  overlay.id = 'yearCeremonyOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:200;background:rgba(7,5,3,0.92);opacity:0;transition:opacity 600ms ease;overflow:hidden';

  // Paged container
  var pager = document.createElement('div');
  pager.style.cssText = 'width:100%;height:100%;display:flex;transition:transform 400ms cubic-bezier(0.25,0.1,0.25,1);touch-action:pan-y';
  var pages = [];
  for (var i = 0; i < 7; i++) {
    var page = document.createElement('div');
    page.style.cssText = 'flex:0 0 100vw;width:100vw;height:100%;position:relative';
    pager.appendChild(page);
    pages.push(page);
  }

  // Render pages
  _renderYearPage1(pages[0], d);
  _renderYearPage2(pages[1], d);
  _renderYearPage3(pages[2], d);
  _renderYearPage4(pages[3], d);
  _renderYearPage5(pages[4], d);
  _renderYearPage6(pages[5], d);
  _renderYearPage7(pages[6], d);

  overlay.appendChild(pager);

  // Pagination dots
  var dotsWrap = document.createElement('div');
  dotsWrap.style.cssText = 'position:absolute;bottom:calc(32px + env(safe-area-inset-bottom));left:0;right:0;display:flex;justify-content:center;gap:8px;pointer-events:none';
  var dots = [];
  for (var j = 0; j < 7; j++) {
    var dot = document.createElement('div');
    dot.style.cssText = 'width:6px;height:6px;border-radius:50%;background:rgba(201,148,58,'+(j===0?'0.8':'0.25')+');transition:background 300ms';
    dotsWrap.appendChild(dot);
    dots.push(dot);
  }
  overlay.appendChild(dotsWrap);

  document.body.appendChild(overlay);
  requestAnimationFrame(function(){ overlay.style.opacity = '1'; });

  // Swipe mechanics
  var currentPage = 0;
  var touchStartX = 0, touchActive = false;

  function setPage(idx){
    idx = Math.max(0, Math.min(6, idx));
    currentPage = idx;
    pager.style.transform = 'translateX(-'+(idx * 100)+'vw)';
    dots.forEach(function(dt, ix){
      dt.style.background = 'rgba(201,148,58,'+(ix===idx?'0.8':'0.25')+')';
    });
  }

  overlay.addEventListener('touchstart', function(e){
    touchStartX = e.touches[0].clientX;
    touchActive = true;
  }, {passive:true});

  overlay.addEventListener('touchend', function(e){
    if (!touchActive) return;
    var dx = (e.changedTouches[0].clientX - touchStartX);
    if (Math.abs(dx) > 40) {
      if (dx < 0) setPage(currentPage + 1);
      else setPage(currentPage - 1);
    }
    touchActive = false;
  }, {passive:true});

  // Keyboard nav (desktop / dev)
  overlay.tabIndex = 0;
  overlay.focus();
  overlay.addEventListener('keydown', function(e){
    if (e.key === 'ArrowRight') setPage(currentPage + 1);
    if (e.key === 'ArrowLeft') setPage(currentPage - 1);
  });

  // Expose for dev / for _dismissAnnualCeremony if Page 7 wants to close from any state
  overlay._setPage = setPage;
}

// Dismiss — called from page 7 after pendant saved
function _dismissAnnualCeremony(){
  var overlay = document.getElementById('yearCeremonyOverlay');
  if (!overlay) return;
  overlay.style.opacity = '0';
  setTimeout(function(){
    if (overlay.parentNode) overlay.remove();
    var canvas = document.getElementById('splashCanvas');
    if (canvas) {
      canvas.style.transition = 'opacity 500ms ease, transform 900ms cubic-bezier(0.25, 0.1, 0.25, 1)';
      canvas.style.opacity = '1';
    }
    _floatChainDown(function(){
      if (typeof populateSplashChain === 'function') populateSplashChain();
      else if (typeof window._splashShowChain === 'function') window._splashShowChain();
    });
  }, 600);
}

function populateHeld(){
  var entries=JSON.parse(localStorage.getItem('gc_entries')||'[]');
  var displayDay=Math.max(1, hasLogged?dayNum-1:dayNum);
  if(entries.length===0){
    // empty state — ensure muted styling is applied
    $('heldEntry').classList.add('empty');
    $('heldInsight').classList.add('empty');
    return;
  }
  var last=entries[entries.length-1];
  $('heldEntry').classList.remove('empty');
  $('heldInsight').classList.remove('empty');
  $('heldDay').textContent='morning '+(last.day||displayDay);
  $('heldEntry').textContent='\u201C'+(last.text.length>120?last.text.slice(0,117)+'\u2026':last.text)+'\u201D';
  $('heldEmo').textContent='\u2014 '+(last.emo||'');
  $('heldInsight').textContent=last.ai||'';
  var mornings = $('heldMornings'); if(mornings) mornings.textContent = entries.length;
  var mc = $('heldMonthContext');
  if(mc) mc.textContent = 'this ' + new Date().toLocaleDateString('en-US',{month:'long'}).toLowerCase();
}

// ═══ WALKING ALONGSIDE — presence only, no content ═══════════
// Mark expired pending invites (48h) on load — keep them so user can refresh the code
(function cleanExpiredLinks(){
  try{
    var links = JSON.parse(localStorage.getItem('gc_links')||'[]');
    var now = new Date();
    var changed = false;
    links = links.map(function(l){
      if(l.status !== 'pending') return l;
      var created = new Date(l.created_at);
      if(isNaN(created)) return l;
      if((now - created) / 3600000 >= 48){
        changed = true;
        return Object.assign({}, l, {status:'expired'});
      }
      return l;
    });
    if(changed) localStorage.setItem('gc_links', JSON.stringify(links));
  }catch(e){}
})();

function populateWalkingSection(){
  var links = JSON.parse(localStorage.getItem('gc_links')||'[]');
  var activeLinks  = links.filter(function(l){ return l.status === 'active'; });
  var pendingLinks = links.filter(function(l){ return l.status === 'pending'; });
  var expiredLinks = links.filter(function(l){ return l.status === 'expired'; });
  var totalLinks = links.length;

  var container = $('witnessCards');
  if(!container) return;
  container.innerHTML = '';

  activeLinks.forEach(function(link){
    container.appendChild(buildWitnessCard(link));
  });
  pendingLinks.forEach(function(link){
    container.appendChild(buildPendingCard(link));
  });
  expiredLinks.forEach(function(link){
    container.appendChild(buildExpiredCard(link));
  });

  var addBtn = $('linkAddBtn');
  if(addBtn){
    addBtn.style.display = totalLinks < 3 ? 'block' : 'none';
  }
}

// ── held tab switching: 'today' | 'alongside' ──
var currentHeldTab = 'today';
function setHeldTab(tab){
  currentHeldTab = tab;
  var todayTabBtn = document.getElementById('heldTabToday');
  var alongsideTabBtn = document.getElementById('heldTabAlongside');
  if(todayTabBtn) todayTabBtn.classList.toggle('active', tab === 'today');
  if(alongsideTabBtn) alongsideTabBtn.classList.toggle('active', tab === 'alongside');

  var todayEl = document.getElementById('heldToday');
  var alongsideEl = document.getElementById('heldAlongside');
  if(!todayEl || !alongsideEl) return;

  if(tab === 'today'){
    todayEl.style.display = 'flex';
    alongsideEl.style.display = 'none';
  } else {
    todayEl.style.display = 'none';
    alongsideEl.style.display = 'flex';
    populateAlongsideTab();
  }
}
// expose for inline onclick handlers
window.setHeldTab = setHeldTab;

function populateAlongsideTab(){
  var seen = localStorage.getItem('gc_link_philosophy_seen');
  var links = [];
  try{ links = JSON.parse(localStorage.getItem('gc_links')||'[]'); }catch(e){}
  var philosEl = document.getElementById('alongsidePhilosophy');
  var activeEl = document.getElementById('alongsideActive');
  if(!philosEl || !activeEl) return;

  if(!seen && links.length === 0){
    philosEl.style.display = 'block';
    activeEl.style.display = 'none';
  } else {
    philosEl.style.display = 'none';
    activeEl.style.display = 'block';
    populateWalkingSection();
  }
}

// inline philosophy buttons
(function(){
  var linkBtn = document.getElementById('philosLinkBtn');
  if(linkBtn){
    linkBtn.addEventListener('click', function(){
      localStorage.setItem('gc_link_philosophy_seen', '1');
      document.getElementById('alongsidePhilosophy').style.display = 'none';
      document.getElementById('alongsideActive').style.display = 'block';
      populateWalkingSection();
      setTimeout(function(){ showLinkInviteFlow(); }, 200);
    });
  }
  var laterBtn = document.getElementById('philosLaterBtn');
  if(laterBtn){
    laterBtn.addEventListener('click', function(){
      localStorage.setItem('gc_link_philosophy_seen', '1');
      document.getElementById('alongsidePhilosophy').style.display = 'none';
      document.getElementById('alongsideActive').style.display = 'block';
      populateWalkingSection();
    });
  }
})();

// inline accept-code input + button (alongside tab)
(function(){
  var input = document.getElementById('acceptCodeInput');
  var btn = document.getElementById('acceptCodeBtn');
  var msg = document.getElementById('acceptCodeMsg');
  if(!input || !btn || !msg) return;

  input.addEventListener('focus', function(){ input.style.borderColor = 'var(--gold)'; });
  input.addEventListener('blur',  function(){ input.style.borderColor = 'var(--glass-border)'; });

  btn.addEventListener('click', function(){
    var code = (input.value || '').trim();
    if(!code) return;
    var res = acceptLinkByCode(code);
    if(res.ok){
      input.value = '';
      msg.textContent = 'linked. you\u2019re walking alongside them.';
      msg.style.color = 'rgba(201,148,58,0.6)';
      setTimeout(function(){
        msg.textContent = '';
        populateWalkingSection();
      }, 2500);
    } else {
      msg.textContent = 'code not found \u2014 ask them to resend.';
      msg.style.color = 'rgba(180,80,60,0.6)';
      setTimeout(function(){ msg.textContent = ''; }, 3000);
    }
  });
})();

function buildWitnessCard(link){
  var card = document.createElement('div');
  card.className = 'witness-card';

  var arcCanvas = document.createElement('canvas');
  arcCanvas.className = 'witness-arc-canvas';

  var info = document.createElement('div');
  info.className = 'witness-info';

  var name = document.createElement('p');
  name.className = 'witness-name';
  name.textContent = link.nickname;
  name.style.margin = '0';

  var todayStr = todayISO();
  var loggedToday = !!(link.their_dates && link.their_dates.indexOf(todayStr) >= 0);

  var status = document.createElement('p');
  status.className = 'witness-status ' + (loggedToday ? 'present' : 'absent');
  status.textContent = loggedToday ? 'showed up today \u2726' : 'not yet today';
  status.style.margin = '0';

  info.appendChild(name);
  info.appendChild(status);
  card.appendChild(arcCanvas);
  card.appendChild(info);

  requestAnimationFrame(function(){
    drawMiniArc(arcCanvas, link.their_dates || []);
  });

  card.addEventListener('click', function(){
    openWitnessView(link);
  });

  return card;
}

function buildPendingCard(link){
  var card = document.createElement('div');
  card.style.cssText = [
    'padding:14px 16px',
    'background:var(--glass)',
    'border:1px dashed rgba(201,148,58,0.12)',
    'border-radius:14px',
    'margin-bottom:12px',
    'display:flex','align-items:center','justify-content:space-between','gap:10px'
  ].join(';');

  var left = document.createElement('div');
  left.style.cssText = 'flex:1;min-width:0';

  var name = document.createElement('p');
  name.style.cssText = [
    'font-family:"Fraunces",serif','font-style:italic',
    'font-size:15px','color:rgba(245,237,224,0.35)',
    'margin:0 0 3px','overflow:hidden','text-overflow:ellipsis','white-space:nowrap'
  ].join(';');
  name.textContent = link.nickname;

  var waiting = document.createElement('p');
  waiting.style.cssText = [
    'font-family:"DM Mono",monospace','font-size:9px',
    'letter-spacing:0.08em','color:rgba(201,148,58,0.25)','margin:0'
  ].join(';');
  waiting.textContent = 'waiting for them…';

  left.appendChild(name);
  left.appendChild(waiting);

  var resend = document.createElement('button');
  resend.textContent = 'copy code';
  resend.style.cssText = [
    'background:none','border:1px solid rgba(201,148,58,0.15)',
    'border-radius:10px','padding:5px 10px',
    'font-family:"DM Mono",monospace','font-size:8px','letter-spacing:0.06em',
    'color:rgba(201,148,58,0.35)','cursor:pointer','flex-shrink:0'
  ].join(';');
  resend.addEventListener('click', function(e){
    e.stopPropagation();
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(link.code).then(function(){
        resend.textContent = 'copied \u2713';
        setTimeout(function(){ resend.textContent = 'copy code'; }, 2000);
      }).catch(function(){});
    }
  });

  card.appendChild(left);
  card.appendChild(resend);
  return card;
}

function buildExpiredCard(link){
  var card = document.createElement('div');
  card.style.cssText = [
    'padding:14px 16px',
    'background:var(--glass)',
    'border:1px dashed rgba(201,148,58,0.08)',
    'border-radius:14px',
    'margin-bottom:12px',
    'display:flex','align-items:center','justify-content:space-between','gap:10px'
  ].join(';');

  var left = document.createElement('div');
  left.style.cssText = 'flex:1;min-width:0';

  var name = document.createElement('p');
  name.style.cssText = [
    'font-family:"Fraunces",serif','font-style:italic',
    'font-size:15px','color:rgba(245,237,224,0.25)',
    'margin:0 0 3px','overflow:hidden','text-overflow:ellipsis','white-space:nowrap'
  ].join(';');
  name.textContent = link.nickname;

  var expiredLabel = document.createElement('p');
  expiredLabel.style.cssText = [
    'font-family:"DM Mono",monospace','font-size:9px',
    'letter-spacing:0.08em','color:rgba(201,148,58,0.2)','margin:0'
  ].join(';');
  expiredLabel.textContent = 'code expired';

  left.appendChild(name);
  left.appendChild(expiredLabel);

  var refreshBtn = document.createElement('button');
  refreshBtn.textContent = 'new code';
  refreshBtn.style.cssText = [
    'background:none','border:1px solid rgba(201,148,58,0.15)',
    'border-radius:10px','padding:5px 10px',
    'font-family:"DM Mono",monospace','font-size:8px','letter-spacing:0.06em',
    'color:rgba(201,148,58,0.35)','cursor:pointer','flex-shrink:0'
  ].join(';');
  refreshBtn.addEventListener('click', function(e){
    e.stopPropagation();
    var newCode = generateLinkCode();
    var links = JSON.parse(localStorage.getItem('gc_links')||'[]');
    links = links.map(function(l){
      if(l.id !== link.id) return l;
      return Object.assign({}, l, {code: newCode, status: 'pending', created_at: todayISO()});
    });
    localStorage.setItem('gc_links', JSON.stringify(links));
    populateWalkingSection();
  });

  card.appendChild(left);
  card.appendChild(refreshBtn);
  return card;
}

// Mini arc — shown in the witness card in the held screen
function drawMiniArc(canvas, loggedDates){
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio||1, 2);
  var W = canvas.offsetWidth || 48;
  var H = canvas.offsetHeight || 48;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,W,H);

  var cx = W/2, cy = H/2;
  var R = Math.min(W,H) * 0.38;

  // ghost full circle
  ctx.beginPath();
  ctx.arc(cx,cy,R,0,Math.PI*2);
  ctx.strokeStyle = 'rgba(201,148,58,0.08)';
  ctx.lineWidth = 1;
  ctx.setLineDash([2,3]);
  ctx.stroke();
  ctx.setLineDash([]);

  var daysLogged = (loggedDates||[]).length;
  if(daysLogged < 1) return;

  var startAngle = -Math.PI/2; // top of circle
  var fraction = Math.min(daysLogged/365, 1);
  var endAngle = startAngle + fraction*Math.PI*2;

  ctx.beginPath();
  ctx.arc(cx,cy,R,startAngle,endAngle);
  ctx.strokeStyle = 'rgba(245,237,224,0.3)';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  var todayStr = todayISO();
  var loggedToday = (loggedDates||[]).indexOf(todayStr) >= 0;
  if(loggedToday){
    var dotX = cx + R*Math.cos(endAngle);
    var dotY = cy + R*Math.sin(endAngle);
    var g = ctx.createRadialGradient(dotX,dotY,0,dotX,dotY,3);
    g.addColorStop(0,'rgba(230,182,88,0.9)');
    g.addColorStop(1,'rgba(201,148,58,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(dotX,dotY,3,0,Math.PI*2);
    ctx.fill();
  }
}

// Large arc — shown in the witness detail overlay
function drawLargeWitnessArc(canvas, link){
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio||1, 2);
  var W = canvas.offsetWidth || 260;
  var H = canvas.offsetHeight || 260;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,W,H);

  var cx = W/2, cy = H/2;
  var R = Math.min(W,H) * 0.38;
  var loggedDates = link.their_dates || [];
  var daysLogged = loggedDates.length;

  // ghost full ring
  ctx.beginPath();
  ctx.arc(cx,cy,R,0,Math.PI*2);
  ctx.strokeStyle = 'rgba(201,148,58,0.06)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3,6]);
  ctx.stroke();
  ctx.setLineDash([]);

  function _witnessYearLabel(){
    var firstISO = (loggedDates && loggedDates.length) ? loggedDates[0] : null;
    var _sd = firstISO ? new Date(firstISO) : new Date();
    var _sy = _sd.getFullYear();
    var _ed = new Date(_sd); _ed.setDate(_ed.getDate() + 364);
    var _ey = _ed.getFullYear();
    return (_sy === _ey) ? String(_sy) : (_sy + ' \u2014 ' + _ey);
  }

  if(daysLogged < 1){
    ctx.font = '400 10px "DM Mono", monospace';
    ctx.fillStyle = 'rgba(201,148,58,0.12)';
    ctx.textAlign = 'center';
    ctx.fillText(_witnessYearLabel(), cx, cy+4);
    return;
  }

  var startAngle = -Math.PI/2;
  var fraction = Math.min(daysLogged/365, 1);
  var endAngle = startAngle + fraction*Math.PI*2;

  // soft underglow
  ctx.beginPath();
  ctx.arc(cx,cy,R,startAngle,endAngle);
  ctx.strokeStyle = 'rgba(245,237,224,0.06)';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();

  // braided pair
  ctx.beginPath();
  ctx.arc(cx,cy,R-1,startAngle,endAngle);
  ctx.strokeStyle = 'rgba(245,237,224,0.15)';
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx,cy,R+1,startAngle,endAngle);
  ctx.strokeStyle = 'rgba(245,237,224,0.25)';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // clasp dot at top (where year begins)
  var claspX = cx + R*Math.cos(-Math.PI/2);
  var claspY = cy + R*Math.sin(-Math.PI/2);
  ctx.beginPath();
  ctx.arc(claspX,claspY,3,0,Math.PI*2);
  ctx.fillStyle = 'rgba(201,148,58,0.3)';
  ctx.fill();

  // today dot (pulsing)
  var todayStr = todayISO();
  var loggedToday = loggedDates.indexOf(todayStr) >= 0;
  if(loggedToday){
    var tipX = cx + R*Math.cos(endAngle);
    var tipY = cy + R*Math.sin(endAngle);
    var pulse = 1.0 + 0.15*Math.sin(Date.now()/800);
    var g = ctx.createRadialGradient(tipX,tipY,0,tipX,tipY,6*pulse);
    g.addColorStop(0, 'rgba(255,255,255,0.6)');
    g.addColorStop(0.4, 'rgba(230,182,88,0.3)');
    g.addColorStop(1, 'rgba(201,148,58,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(tipX,tipY,5*pulse,0,Math.PI*2);
    ctx.fill();
  }

  // year label at center
  ctx.font = '400 10px "DM Mono", monospace';
  ctx.fillStyle = 'rgba(201,148,58,0.12)';
  ctx.textAlign = 'center';
  ctx.fillText(_witnessYearLabel(), cx, cy+4);
}

function openWitnessView(link){
  var overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed','inset:0','z-index:160',
    'background:rgba(14,11,7,0.96)',
    'display:flex','flex-direction:column',
    'align-items:center','justify-content:center',
    'padding:40px 32px',
    'opacity:0','transition:opacity 400ms ease'
  ].join(';');

  var back = document.createElement('button');
  back.textContent = '\u2190 back';
  back.style.cssText = [
    'position:absolute','top:max(20px,env(safe-area-inset-top))','left:20px',
    'background:var(--glass)','border:1px solid var(--glass-border)','border-radius:20px',
    'padding:6px 14px','font-family:"DM Mono",monospace','font-size:10px',
    'letter-spacing:0.06em','color:var(--muted)','cursor:pointer'
  ].join(';');
  back.addEventListener('click', function(){
    overlay.style.opacity = '0';
    setTimeout(function(){ if(overlay.parentNode) overlay.remove(); }, 400);
  });

  var arcCanvas = document.createElement('canvas');
  arcCanvas.style.cssText = 'width:260px;height:260px;margin-bottom:36px';

  var nameEl = document.createElement('p');
  nameEl.textContent = link.nickname;
  nameEl.style.cssText = [
    'font-family:"Fraunces",serif','font-style:italic','font-weight:300',
    'font-size:26px','color:rgba(245,237,224,0.75)','margin:0 0 12px',
    'letter-spacing:-0.01em'
  ].join(';');

  var line = document.createElement('p');
  line.textContent = 'walking this year.';
  line.style.cssText = [
    'font-family:"Fraunces",serif','font-style:italic','font-weight:300',
    'font-size:13px','color:rgba(245,237,224,0.25)','margin:0 0 6px','text-align:center'
  ].join(';');

  var line2 = document.createElement('p');
  line2.textContent = 'the rest is theirs.';
  line2.style.cssText = line.style.cssText.replace('margin:0 0 6px','margin:0');

  overlay.appendChild(back);
  overlay.appendChild(arcCanvas);
  overlay.appendChild(nameEl);
  overlay.appendChild(line);
  overlay.appendChild(line2);
  document.body.appendChild(overlay);

  requestAnimationFrame(function(){ overlay.style.opacity = '1'; });
  requestAnimationFrame(function(){ drawLargeWitnessArc(arcCanvas, link); });
}

function showPhilosophyScreen(){
  if(document.getElementById('walkingPhilosophy')) return;
  var overlay = document.createElement('div');
  overlay.id = 'walkingPhilosophy';
  overlay.style.cssText = [
    'position:fixed','inset:0','z-index:160',
    'background:rgba(14,11,7,0.97)',
    'display:flex','flex-direction:column',
    'align-items:center','justify-content:center',
    'padding:48px 40px','text-align:center',
    'opacity:0','transition:opacity 600ms ease'
  ].join(';');

  overlay.innerHTML = [
    '<p style="font-family:\'DM Mono\',monospace;font-size:8px;letter-spacing:0.2em;',
      'color:rgba(201,148,58,0.35);text-transform:uppercase;margin:0 0 32px">walking alongside</p>',
    '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-weight:300;font-size:17px;',
      'color:rgba(245,237,224,0.75);line-height:1.85;margin:0 0 16px;max-width:280px">',
      'your practice is yours alone.<br>always.</p>',
    '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-weight:300;font-size:15px;',
      'color:rgba(245,237,224,0.45);line-height:1.85;margin:0 0 16px;max-width:280px">',
      'but some people choose to walk<br>with someone —<br>not sharing their words,<br>just their presence.</p>',
    '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-weight:300;font-size:15px;',
      'color:rgba(245,237,224,0.45);line-height:1.85;margin:0 0 48px;max-width:280px">',
      'they will see that you showed up.<br>nothing more.</p>',
    '<button id="philoLinkBtn" style="background:rgba(201,148,58,0.08);',
      'border:1px solid rgba(201,148,58,0.3);border-radius:20px;padding:14px 32px;',
      'font-family:\'Fraunces\',serif;font-style:italic;font-size:14px;',
      'color:var(--gold);cursor:pointer;margin-bottom:20px;transition:all 200ms ease">',
      'link someone \u2192</button>',
    '<button id="philoLaterBtn" style="background:none;border:none;',
      'font-family:\'Fraunces\',serif;font-style:italic;font-size:12px;',
      'color:rgba(245,237,224,0.2);cursor:pointer">maybe later</button>'
  ].join('');

  document.body.appendChild(overlay);
  requestAnimationFrame(function(){ overlay.style.opacity = '1'; });

  function dismiss(){
    localStorage.setItem('gc_link_philosophy_seen','1');
    overlay.style.opacity = '0';
    setTimeout(function(){ if(overlay.parentNode) overlay.remove(); }, 600);
  }

  document.getElementById('philoLinkBtn').addEventListener('click', function(){
    dismiss();
    setTimeout(function(){ showLinkInviteFlow(); }, 700);
  });
  document.getElementById('philoLaterBtn').addEventListener('click', dismiss);
}

function generateLinkCode(){
  var emoWords = ['tender','calm','alive','grateful','hopeful','light','quiet',
    'moved','searching','restless','heavy','soft','still','open','held'];
  var goldWords = ['gold','thread','morning','knot','chain','dawn','ember','gentle',
    'quiet','light','bloom','silk','hush'];
  var num = Math.floor(Math.random()*89) + 10;
  var w1 = emoWords[Math.floor(Math.random()*emoWords.length)];
  var w2 = goldWords[Math.floor(Math.random()*goldWords.length)];
  return w1 + ' \u00B7 ' + w2 + ' \u00B7 ' + num;
}

function showLinkInviteFlow(){
  var overlay = document.createElement('div');
  overlay.id = 'linkInviteFlow';
  overlay.style.cssText = [
    'position:fixed','inset:0','z-index:160',
    'background:rgba(14,11,7,0.97)',
    'display:flex','flex-direction:column',
    'align-items:center','justify-content:center',
    'padding:48px 40px','text-align:center',
    'opacity:0','transition:opacity 500ms ease'
  ].join(';');

  overlay.innerHTML = [
    '<button id="linkFlowBack" style="position:absolute;top:max(20px,env(safe-area-inset-top));',
      'left:20px;background:var(--glass);border:1px solid var(--glass-border);',
      'border-radius:20px;padding:6px 14px;font-family:\'DM Mono\',monospace;font-size:10px;',
      'letter-spacing:0.06em;color:var(--muted);cursor:pointer">\u2190 back</button>',
    '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-weight:300;font-size:18px;',
      'color:rgba(245,237,224,0.75);margin:0 0 8px">who are you inviting?</p>',
    '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-size:12px;',
      'color:rgba(245,237,224,0.25);margin:0 0 32px">only you will see this name.</p>',
    '<input id="linkNicknameInput" placeholder="a name for them" maxlength="40" style="',
      'width:100%;max-width:280px;padding:14px 18px;background:var(--glass);',
      'border:1px solid var(--glass-border);border-radius:14px;font-family:\'Fraunces\',serif;',
      'font-style:italic;font-size:15px;color:var(--text);outline:none;text-align:center;',
      'transition:border-color 200ms;margin-bottom:24px">',
    '<button id="linkGenerateBtn" style="background:rgba(201,148,58,0.06);',
      'border:1px solid rgba(201,148,58,0.2);border-radius:20px;padding:12px 28px;',
      'font-family:\'Fraunces\',serif;font-style:italic;font-size:13px;',
      'color:rgba(201,148,58,0.4);cursor:pointer;transition:all 200ms ease">',
      'generate their code</button>'
  ].join('');

  document.body.appendChild(overlay);
  requestAnimationFrame(function(){ overlay.style.opacity = '1'; });

  document.getElementById('linkFlowBack').addEventListener('click', function(){
    overlay.style.opacity = '0';
    setTimeout(function(){ if(overlay.parentNode) overlay.remove(); }, 500);
  });

  var input = document.getElementById('linkNicknameInput');
  var genBtn = document.getElementById('linkGenerateBtn');

  input.addEventListener('input', function(){
    var hasText = input.value.trim().length > 0;
    genBtn.style.color = hasText ? 'var(--gold)' : 'rgba(201,148,58,0.4)';
    genBtn.style.borderColor = hasText ? 'rgba(201,148,58,0.4)' : 'rgba(201,148,58,0.2)';
    genBtn.style.background = hasText ? 'rgba(201,148,58,0.1)' : 'rgba(201,148,58,0.06)';
  });
  input.addEventListener('focus', function(){ input.style.borderColor = 'var(--gold)'; });
  input.addEventListener('blur', function(){ input.style.borderColor = 'var(--glass-border)'; });

  setTimeout(function(){ try{ input.focus(); }catch(e){} }, 300);

  genBtn.addEventListener('click', function(){
    var nickname = input.value.trim();
    if(!nickname) return;
    // enforce max 3 links before saving
    var links = JSON.parse(localStorage.getItem('gc_links')||'[]');
    if(links.length >= 3) return;
    var code = generateLinkCode();
    showGeneratedCode(overlay, nickname, code);
  });
}

function showGeneratedCode(overlay, nickname, code){
  overlay.style.opacity = '0';
  setTimeout(function(){
    overlay.innerHTML = [
      '<button id="codeBack" style="position:absolute;top:max(20px,env(safe-area-inset-top));',
        'left:20px;background:var(--glass);border:1px solid var(--glass-border);',
        'border-radius:20px;padding:6px 14px;font-family:\'DM Mono\',monospace;font-size:10px;',
        'letter-spacing:0.06em;color:var(--muted);cursor:pointer">\u2190 back</button>',
      '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-weight:300;font-size:14px;',
        'color:rgba(245,237,224,0.4);margin:0 0 32px">share this with '+nickname+'</p>',
      '<div id="codeCard" style="background:rgba(201,148,58,0.04);',
        'border:1px solid rgba(201,148,58,0.15);border-radius:20px;',
        'padding:32px 40px;margin-bottom:24px;cursor:pointer;transition:all 200ms ease">',
        '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-weight:300;font-size:22px;',
          'color:var(--gold);letter-spacing:0.04em;line-height:1.6;text-align:center;margin:0">'+code+'</p>',
        '<p style="font-family:\'DM Mono\',monospace;font-size:8px;letter-spacing:0.1em;',
          'color:rgba(201,148,58,0.3);margin:14px 0 0;text-align:center">tap to copy</p>',
      '</div>',
      '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-size:12px;',
        'color:rgba(245,237,224,0.25);line-height:1.7;margin:0 0 28px;max-width:260px">',
        'when they enter this in their app,<br>you\u2019ll walk alongside each other.<br><br>expires in 48 hours.</p>',
      '<button id="shareCodeBtn" style="background:rgba(201,148,58,0.1);',
        'border:1px solid rgba(201,148,58,0.3);border-radius:20px;padding:12px 28px;',
        'font-family:\'Fraunces\',serif;font-style:italic;font-size:13px;',
        'color:var(--gold);cursor:pointer;margin-bottom:16px;transition:all 200ms ease">',
        'share via\u2026 \u2197</button>',
      '<button id="codeDoneBtn" style="background:none;border:none;',
        'font-family:\'Fraunces\',serif;font-style:italic;font-size:12px;',
        'color:rgba(245,237,224,0.2);cursor:pointer">done for now</button>'
    ].join('');

    overlay.style.opacity = '1';

    // save pending link
    var links = JSON.parse(localStorage.getItem('gc_links')||'[]');
    links.push({
      id: 'link_'+Date.now(),
      nickname: nickname,
      code: code,
      status: 'pending',
      their_dates: [],
      created_at: todayISO(),
      year: new Date().getFullYear()
    });
    localStorage.setItem('gc_links', JSON.stringify(links));
    populateWalkingSection();

    document.getElementById('codeCard').addEventListener('click', function(){
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(code).then(function(){
          var lbl = document.querySelector('#codeCard p:last-child');
          if(lbl){
            lbl.textContent = 'copied \u2713';
            setTimeout(function(){ lbl.textContent = 'tap to copy'; }, 2000);
          }
        }).catch(function(){});
      }
    });

    document.getElementById('shareCodeBtn').addEventListener('click', function(){
      var shareText = 'walk alongside me this year on GratitudeChain.\n\nyour code: '+code+'\n\nenter it in the Held tab.';
      if(navigator.share){
        navigator.share({ title:'walk alongside me', text: shareText }).catch(function(){});
      } else if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(shareText).catch(function(){});
      }
    });

    document.getElementById('codeDoneBtn').addEventListener('click', function(){
      overlay.style.opacity = '0';
      setTimeout(function(){ if(overlay.parentNode) overlay.remove(); }, 500);
    });

    document.getElementById('codeBack').addEventListener('click', function(){
      overlay.style.opacity = '0';
      setTimeout(function(){
        if(overlay.parentNode) overlay.remove();
        showLinkInviteFlow();
      }, 500);
    });
  }, 500);
}

// Accept a link by code (phase 1 — local-only lookup)
function acceptLinkByCode(code){
  var links = JSON.parse(localStorage.getItem('gc_links')||'[]');
  var found = null;
  for(var i = 0; i < links.length; i++){
    if(links[i].code === code && links[i].status === 'pending'){ found = links[i]; break; }
  }
  if(!found) return {ok:false, reason:'not-found'};
  found.status = 'active';
  localStorage.setItem('gc_links', JSON.stringify(links));
  populateWalkingSection();
  return {ok:true, link:found};
}

// Wire the "+ link someone" button once the DOM is ready
(function(){
  var btn = document.getElementById('linkAddBtn');
  if(btn){
    btn.addEventListener('click', function(){ showLinkInviteFlow(); });
  }
})();

