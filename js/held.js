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
  passionate:'you burned for something this month. burning like that is a form of love.',
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
// Present-tense variants for in-progress (still-forming) months. Finished
// months use PORTRAIT_MESSAGES above ("you burned... the chain remembered").
// A month that hasn't ended yet must speak in present tense — "you are burning"
// — because nothing is finished yet, so past tense lands wrong.
var PORTRAIT_MESSAGES_PRESENT = {
  calm:'you are finding stillness while the world asks for more.',
  tender:'you are letting yourself be soft. that is not weakness.',
  grateful:'you are noticing beauty in the everyday — that is everything.',
  hard:'you are showing up on days that ask too much. that is courage.',
  heavy:'you are carrying what you can and still writing it down.',
  overwhelmed:'one small word at a time, you are keeping going.',
  alive:'you are burning bright this month, and the chain is here for it.',
  numb:'even numbness deserves its witness. you are giving it one.',
  hopeful:'you are leaning toward something. it is leaning back.',
  light:'you are noticing the lightness. that is the whole practice.',
  quiet:'a month of hush. you are honoring it fully.',
  foggy:'you are finding something in the fog. that is no small thing.',
  restless:'you are giving your restlessness a direction. it is working.',
  searching:'you are searching. the chain is the lamp.',
  sad:'sad months count too. yours is being held.',
  frustrated:'you care enough to be frustrated. that is love.',
  anxious:'one small safe thing at a time. you are making it through.',
  heartbroken:'the chain is holding what you cannot carry alone.',
  disappointed:'not the month you hoped for. still the month you are making.',
  exhausted:'you are showing up tired. that is the bravest kind of showing up.',
  moved:'something is moving you this month. the chain feels it too.',
  passionate:'you are burning for something this month. burning like this is a form of love.',
  nervous:'you are staying close to the edge and still arriving. that is bravery.',
  livid:'you are angry. it is real. the chain is holding that too.',
  lonely:'loneliness is honest about what it wants. the chain is keeping you company.',
  ashamed:'you keep showing up when you want to disappear. that counts.',
  certain:'you know what you know. that kind of steadiness is rare.',
  content:'enough is arriving, more than once. you are noticing. that is the whole practice.',
  focused:'you are keeping your attention where it matters. the chain feels it.',
  inspired:'something is sparking in you. you are not letting it pass unnoticed.',
  lost:'you do not know the way and are walking anyway. that is faith.',
  relaxed:'ease is visiting. you are letting it stay. nothing has to be earned.',
  vulnerable:'you are letting yourself be soft in a hard world. that takes nerve.',
  yearning:'you want something. you are not pretending otherwise. that is honest.',
  betrayed:'something is broken that shouldn\u2019t have been. you are telling the truth about it.',
  bored:'the flat days count too. you are still here.',
  insecure:'you are showing up when you doubt yourself. you are coming anyway.',
  upset:'upset is real information. the chain is receiving all of it.'
};
var YEAR_CLOSING_LINES = {
  calm:        'a whole year of quiet. you honored it.',
  tender:      'soft, and still here. a whole year of that.',
  grateful:    'a year of noticing. the chain remembers it all.',
  hard:        'a hard year held. staying through that is a rare strength.',
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
// Now features a canvas donut chart showing the ACTUAL proportions of the
// year's emotions (not just a top-5 text list). Below the chart, a compact
// legend with colored dots keeps readability. The chart animates its arcs
// in sequence so it feels composed, not dropped.
function _renderYearPage2(pageEl, d){
  var top6 = d.sortedEmos.slice(0,6);
  if(top6.length === 0){
    pageEl.innerHTML = _yearPageWrap(
      '<p style="font-family:Fraunces,serif;font-style:italic;font-size:15px;color:rgba(245,237,224,0.5);text-align:center">the chain is quiet.</p>',
      {padX:'48px'}
    );
    return;
  }

  function _hexToRgb(hex){
    var h = (hex||'#c9943a').replace('#','');
    return {
      r: parseInt(h.slice(0,2),16),
      g: parseInt(h.slice(2,4),16),
      b: parseInt(h.slice(4,6),16)
    };
  }

  // Build the legend chips (small colored dot + emotion label + percentage).
  // Two columns of 3 so it fits compactly below the donut.
  var legendRows = top6.map(function(emo, i){
    var count = d.emoCounts[emo];
    var pct = Math.round(count / d.total * 100);
    var color = (KNOT_PARAMS[emo] || KNOT_FALLBACK).color;
    var rgb = _hexToRgb(color);
    var tint = 'rgba('+rgb.r+','+rgb.g+','+rgb.b;
    var delay = 900 + i * 80; // start after donut is drawn

    return ''
      + '<div class="_yearcarry-chip" style="'
      +   'display:flex;align-items:center;gap:10px;'
      +   'padding:8px 10px;border-radius:10px;'
      +   'background:linear-gradient(90deg,'+tint+',0.07) 0%,'+tint+',0) 80%);'
      +   'opacity:0;transform:translateY(4px);'
      +   'animation:_yrcarryIn 500ms '+delay+'ms cubic-bezier(.2,.7,.25,1) forwards;'
      + '">'
      +   '<span style="'
      +     'flex:0 0 8px;width:8px;height:8px;border-radius:50%;'
      +     'background:'+color+';'
      +     'box-shadow:0 0 10px '+tint+',0.55);'
      +   '"></span>'
      +   '<span style="'
      +     'flex:1;font-family:Fraunces,serif;font-style:italic;font-weight:300;'
      +     'font-size:13px;color:rgba(245,237,224,0.88);'
      +     'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'
      +   '">'+emo+'</span>'
      +   '<span style="'
      +     'font-family:DM Mono,monospace;font-size:10px;'
      +     'color:'+color+';opacity:0.85;'
      +   '">'+pct+'%</span>'
      + '</div>';
  }).join('');

  // inject keyframes once
  if(!document.getElementById('_yearcarryKeyframes')){
    var style = document.createElement('style');
    style.id = '_yearcarryKeyframes';
    style.textContent =
      '@keyframes _yrcarryIn { to { opacity: 1; transform: translateY(0); } }';
    document.head.appendChild(style);
  }

  var inner = ''
    + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.42;text-transform:uppercase;letter-spacing:0.22em;margin:0 0 10px;text-align:center">what you carried</p>'
    + '<div style="width:28px;height:1px;background:linear-gradient(90deg,transparent,rgba(201,148,58,0.5),transparent);margin:0 auto 16px"></div>'
    // chart canvas — the focal point
    + '<canvas id="_yearDonutChart" width="480" height="480" style="width:240px;height:240px;display:block;margin:0 auto 6px"></canvas>'
    + '<p style="font-family:DM Mono,monospace;font-size:9px;color:rgba(245,237,224,0.32);letter-spacing:0.18em;text-align:center;text-transform:uppercase;margin:0 0 20px">the shape of the year</p>'
    // legend grid
    + '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px 12px;width:100%;max-width:340px;margin:0 auto">' + legendRows + '</div>';

  pageEl.innerHTML = _yearPageWrap(inner, {padX:'28px'});

  // Kick off the donut draw on next frame so layout is done.
  requestAnimationFrame(function(){
    _drawYearDonut(top6, d);
  });
}

// Rose-bloom chart: each top emotion is a PETAL radiating from center.
// Petal length = frequency; petal color = emotion palette. Unique to this
// app — echoes the rose-curve pendant metaphor. Animates each petal in
// sequence from the center outward like a slow bloom.
function _drawYearDonut(topEmos, d){
  var canvas = document.getElementById('_yearDonutChart');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  var cx = W/2, cy = H/2;
  var maxR = Math.min(W,H) * 0.42;
  var minR = maxR * 0.22; // smallest petal floor so rare emotions still read

  var topTotal = topEmos.reduce(function(s,e){ return s + (d.emoCounts[e]||0); }, 0);
  var otherCount = Math.max(0, d.total - topTotal);
  var petals = topEmos.map(function(e){
    return { emo:e, count:d.emoCounts[e], color:(KNOT_PARAMS[e]||KNOT_FALLBACK).color };
  });
  if(otherCount > 0){
    petals.push({ emo:'other', count:otherCount, color:'#6d6a65' });
  }

  var topCount = petals[0] ? petals[0].count : 1;
  var N = petals.length;
  if(N === 0) return;

  // distribute petals around circle, largest at top, alternating sides for
  // visual balance on descending frequencies
  var order = petals.slice();
  var placed = new Array(N);
  var L = 0, R = N-1;
  order.forEach(function(p, i){
    if(i % 2 === 0) placed[L++] = p; else placed[R--] = p;
  });
  placed.forEach(function(p, i){
    p.angle = -Math.PI/2 + (i / N) * Math.PI * 2;
    // petal length proportional to its share of the top emotion (not total),
    // clamped to [minR, maxR] so rare emotions still read
    var ratio = Math.min(1, p.count / topCount);
    p.length = minR + (maxR - minR) * ratio;
    p.width  = 0.08 + (Math.PI*2 / N) * 0.34; // half-width in radians
  });

  var t0 = performance.now();
  var DURATION = 1400;
  var STAGGER = 140; // ms per petal
  function ease(t){ return 1 - Math.pow(1-t, 3); }

  // Bézier petal path: tip at (cx + cos*len, cy + sin*len),
  // control points at ±width perpendicular to the angle at ~60% length.
  function drawPetal(p, progress){
    if(progress <= 0) return;
    var tipX = cx + Math.cos(p.angle) * p.length * progress;
    var tipY = cy + Math.sin(p.angle) * p.length * progress;
    var baseR = minR * 0.5;
    var baseX = cx + Math.cos(p.angle) * baseR;
    var baseY = cy + Math.sin(p.angle) * baseR;

    // perpendicular vector
    var perpX = -Math.sin(p.angle), perpY = Math.cos(p.angle);
    var controlOffset = p.length * progress * 0.55;
    var widthPx = Math.sin(p.width) * p.length * progress * 0.85;

    var c1x = cx + Math.cos(p.angle) * controlOffset + perpX * widthPx;
    var c1y = cy + Math.sin(p.angle) * controlOffset + perpY * widthPx;
    var c2x = cx + Math.cos(p.angle) * controlOffset - perpX * widthPx;
    var c2y = cy + Math.sin(p.angle) * controlOffset - perpY * widthPx;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.quadraticCurveTo(c1x, c1y, tipX, tipY);
    ctx.quadraticCurveTo(c2x, c2y, baseX, baseY);
    ctx.closePath();

    // gradient fill from center-tint to bright tip
    var grad = ctx.createRadialGradient(baseX, baseY, 0, tipX, tipY, p.length*progress);
    grad.addColorStop(0, p.color + '33');
    grad.addColorStop(0.5, p.color + 'cc');
    grad.addColorStop(1, p.color);
    ctx.fillStyle = grad;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 18;
    ctx.fill();

    // thin outline in palette color for definition
    ctx.shadowBlur = 0;
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = p.color + '66';
    ctx.stroke();

    // small circle at tip (the "bloom dot")
    ctx.beginPath();
    ctx.arc(tipX, tipY, 3 + 2*progress, 0, Math.PI*2);
    var tipGrad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 6);
    tipGrad.addColorStop(0, '#fff8e0');
    tipGrad.addColorStop(0.5, p.color);
    tipGrad.addColorStop(1, p.color + '00');
    ctx.fillStyle = tipGrad;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;
    ctx.fill();

    ctx.restore();
  }

  function drawCenter(globalProgress){
    // soft golden aura
    var auraR = minR * 1.4;
    var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, auraR);
    grad.addColorStop(0, 'rgba(201,148,58,0.35)');
    grad.addColorStop(0.6, 'rgba(201,148,58,0.1)');
    grad.addColorStop(1, 'rgba(201,148,58,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, auraR, 0, Math.PI*2);
    ctx.fill();

    // central disk with gold rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, minR * 0.52, 0, Math.PI*2);
    var diskGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, minR * 0.52);
    diskGrad.addColorStop(0, 'rgba(40,28,18,0.9)');
    diskGrad.addColorStop(1, 'rgba(20,15,10,0.95)');
    ctx.fillStyle = diskGrad;
    ctx.fill();
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = 'rgba(201,148,58,0.55)';
    ctx.stroke();
    ctx.restore();

    // center number
    ctx.save();
    ctx.globalAlpha = Math.min(1, globalProgress * 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(245,237,224,0.95)';
    ctx.font = 'italic 300 42px "Fraunces", serif';
    ctx.fillText(String(d.total), cx, cy - 6);
    ctx.fillStyle = 'rgba(201,148,58,0.6)';
    ctx.font = '500 9px "DM Mono", monospace';
    ctx.fillText('MORNINGS', cx, cy + 22);
    ctx.restore();
  }

  function drawThreads(){
    // fine gold threads from center to each petal base — echoes the chain
    ctx.save();
    ctx.strokeStyle = 'rgba(201,148,58,0.12)';
    ctx.lineWidth = 0.5;
    placed.forEach(function(p){
      var baseR = minR * 0.5;
      var startX = cx + Math.cos(p.angle) * baseR;
      var startY = cy + Math.sin(p.angle) * baseR;
      var endX = cx + Math.cos(p.angle) * maxR * 1.05;
      var endY = cy + Math.sin(p.angle) * maxR * 1.05;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    });
    ctx.restore();
  }

  function frame(now){
    var elapsed = now - t0;
    ctx.clearRect(0,0,W,H);
    drawThreads();

    var allDone = true;
    placed.forEach(function(p, i){
      var local = (elapsed - i * STAGGER) / DURATION;
      var progress = Math.max(0, Math.min(1, ease(local)));
      if(progress < 1) allDone = false;
      drawPetal(p, progress);
    });

    // center appears as first petal starts
    drawCenter(Math.min(1, elapsed / (DURATION * 0.6)));

    if(!allDone) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
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
  var total = d.total || 0;
  var pct = Math.round((total / 365) * 100);

  // ── personalize with the user's name ──
  // Light sanitization + proper-case so the name reads as a noun ("Alterina").
  var userName = '';
  try {
    var u = JSON.parse(localStorage.getItem('gc_user') || '{}');
    var raw = (u.name || '').trim();
    if(raw && raw.length <= 40 &&
       raw.replace(/[\s'\-]/g, '').match(/^[a-zA-Z\u00c0-\u024f]+$/)){
      userName = _toProperCase(raw);
    }
  } catch(e){}

  // Helper: drop the name in naturally. Only used on ONE line per tier
  // so it doesn't feel like the app is shouting their name.
  function N(openingWithoutName, openingWithName){
    return userName ? openingWithName : openingWithoutName;
  }

  // Tiered witness copy — sentence-case throughout so proper nouns and
  // sentence starts read correctly. App-voice cadence preserved.
  var witness;
  if(total >= 365){
    witness = [
      'Three hundred sixty-five is not a round number people reach by accident.',
      'Every morning of the year — through holidays, travel, exhaustion, the days that asked too much — you returned.',
      N(
        'Most practices die at week two. Yours held for fifty-two.',
        'Most practices die at week two, ' + userName + '. Yours held for fifty-two.'
      ),
      'This is what it looks like when someone decides to be a witness to their own life, every single day, without skipping the inconvenient ones.',
      'The chain does not ask you to be proud of this.',
      'It only records the shape of what you did, and what you did was rare.',
      'A whole year of arrivals is not a trophy. It is evidence.'
    ];
  } else if(total >= 300){
    witness = [
      total + ' mornings is not casual.',
      'It is a shape you carved into your year on purpose — morning after morning, even when no one was watching and nothing was asking you to.',
      'The days you missed were the ones that asked more than you could give; the others, you gave.',
      N(
        'Most of the year, you kept the thread.',
        'Most of the year, ' + userName + ', you kept the thread.'
      ),
      'That is not a small thing. It does not feel impressive from the inside — consistent things rarely do — but from where the chain sits, it is what practice actually looks like.',
      'You showed up when the showing up was the whole point.'
    ];
  } else if(total >= 200){
    witness = [
      total + ' mornings. More than half of the year named.',
      'A practice does not need to be perfect to be real. Yours is real.',
      'What did not get written down was still lived — but what did made a record, and records are what let you look back and see yourself.',
      N(
        'There is something honest about an incomplete year that has been tended to anyway.',
        'There is something honest, ' + userName + ', about an incomplete year that has been tended to anyway.'
      ),
      'You kept returning. Not every day, but enough days to count as staying.',
      'The chain does not grade. It witnesses. And it witnessed a lot this year.'
    ];
  } else if(total >= 100){
    witness = [
      total + ' mornings is a hundred days of remembering to come back.',
      'That sounds small until you try it — most people never make it past thirty.',
      'The chain does not ask for every morning. It asks that you return when you can.',
      N(
        'You returned enough that the thread is still intact.',
        'You returned enough, ' + userName + ', that the thread is still intact.'
      ),
      'The days you did not arrive are not failures; they are just days that asked something else of you.',
      'What matters is that the practice is alive. It is.'
    ];
  } else if(total >= 30){
    witness = [
      total + ' mornings is more than most people manage.',
      'Habits this quiet are easy to abandon — no one reminds you, no one rewards you, no one notices if you skip.',
      N(
        'You noticed. You came back anyway.',
        userName + ', you noticed. You came back anyway.'
      ),
      'The thread holds what you gave it, and what you gave was real.',
      'A practice begins somewhere. This is your somewhere.',
      'There is no rush to make it bigger than it is.'
    ];
  } else {
    witness = [
      total + ' mornings is not a failure.',
      'It is a beginning the chain will remember.',
      N(
        'Starting is the hardest part, and you started.',
        'Starting is the hardest part, ' + userName + ', and you started.'
      ),
      'The days you came, you named something true. That is what this practice is.',
      'The number does not have to be big. It has to be honest.',
      'Whatever comes next, the thread is already here.'
    ];
  }

  // Build the witness block with staggered fade-in per sentence
  var witnessHtml = witness.map(function(s, i){
    var delay = 1100 + i * 240;
    return '<p style="'
      + 'font-family:Fraunces,serif;font-style:italic;font-weight:300;'
      + 'font-size:14px;line-height:1.75;letter-spacing:0.005em;'
      + 'color:rgba(245,237,224,0.72);'
      + 'text-align:center;max-width:340px;margin:0 auto 10px;'
      + 'opacity:0;transform:translateY(5px);'
      + 'animation:_yrArriveIn 720ms ' + delay + 'ms cubic-bezier(.2,.7,.25,1) forwards;'
      + '">' + s + '</p>';
  }).join('');

  // Inject keyframes once
  if(!document.getElementById('_yearArriveKeyframes')){
    var style = document.createElement('style');
    style.id = '_yearArriveKeyframes';
    style.textContent = '@keyframes _yrArriveIn { to { opacity: 1; transform: translateY(0); } }';
    document.head.appendChild(style);
  }

  var inner = ''
    + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.42;text-transform:uppercase;letter-spacing:0.22em;margin:0">mornings</p>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:52px;color:var(--gold);letter-spacing:-0.02em;margin:12px 0;text-align:center;line-height:1.15">'+word+'</p>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:15px;color:rgba(245,237,224,0.5);text-align:center;margin:0">mornings you arrived</p>'
    + '<p style="font-family:DM Mono,monospace;font-size:9px;color:rgba(201,148,58,0.4);letter-spacing:0.08em;margin:22px 0 0">'+pct+'% of the year</p>'
    // gold divider between the number and the witness copy
    + '<div style="width:28px;height:1px;background:linear-gradient(90deg,transparent,rgba(201,148,58,0.5),transparent);margin:28px auto 22px"></div>'
    + '<div style="width:100%">' + witnessHtml + '</div>';

  pageEl.innerHTML = _yearPageWrap(inner, {gap:'0'});
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
  // "You made these" witness sits here, BEFORE the 12 tiles. Framed as
  // achievement — the user's emotions are the material these pendants
  // are built from. Nothing denying, nothing subtractive.
  var inner = ''
    + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.42;text-transform:uppercase;letter-spacing:0.22em;margin:0 0 8px;text-align:center">the year in twelve</p>'
    + '<div style="width:28px;height:1px;background:linear-gradient(90deg,transparent,rgba(201,148,58,0.5),transparent);margin:0 auto 14px"></div>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:20px;color:rgba(245,237,224,0.92);text-align:center;margin:0 0 10px;line-height:1.45">You made these.</p>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:13px;color:rgba(245,237,224,0.7);text-align:center;margin:0 auto 6px;line-height:1.7;max-width:340px">Every petal, every color, every curve below comes from what you felt this year.</p>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:13px;color:rgba(245,237,224,0.7);text-align:center;margin:0 auto 18px;line-height:1.7;max-width:340px">Each shape is the math of your emotions — the days you showed up, the words you named, the quiet you honored. These are yours, earned and woven.</p>'
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
  // AI-authored year witness, rendered as sentence-per-block with breathing
  // room instead of one wall of text. Personalized with the user's name
  // when available. Querying via pageEl (not document) because pages are
  // detached at render time.
  var closing = YEAR_CLOSING_LINES[d.dominant] || 'a whole year held. the chain remembers it all.';
  var userName = '';
  try {
    var u = JSON.parse(localStorage.getItem('gc_user') || '{}');
    var _raw = (u.name || '').trim();
    if(_raw && _raw.length <= 40 &&
       _raw.replace(/[\s'\-]/g, '').match(/^[a-zA-Z\u00c0-\u024f]+$/)){
      userName = _toProperCase(_raw);
    }
  } catch(e){}

  var nameLine = userName
    ? '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:16px;color:rgba(201,148,58,0.6);text-align:center;margin:0 0 6px">For '+ _escForHtml(userName) +',</p>'
    : '';

  var inner = ''
    + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.42;text-transform:uppercase;letter-spacing:0.22em;margin:0 0 10px;text-align:center">the thread held</p>'
    + '<div style="width:28px;height:1px;background:linear-gradient(90deg,transparent,rgba(201,148,58,0.5),transparent);margin:0 auto 18px"></div>'
    + nameLine
    + '<div data-year-narrative-wrap="1" style="width:100%;max-width:400px;margin:0 auto">'
    +   '<p data-year-narrative-line="1" style="'
    +     'font-family:Fraunces,serif;font-style:italic;font-weight:300;'
    +     'font-size:16px;line-height:1.85;'
    +     'color:rgba(245,237,224,0.82);'
    +     'text-align:center;margin:0;'
    +     'transition:opacity 500ms ease;'
    +   '">' + _escForHtml(closing) + '</p>'
    + '</div>'
    + '<p style="'
    +   'font-family:DM Mono,monospace;font-size:9px;color:rgba(201,148,58,0.32);'
    +   'letter-spacing:0.18em;text-align:center;text-transform:uppercase;'
    +   'margin:24px 0 0;'
    + '">\u2014 the chain, witnessing</p>';
  pageEl.innerHTML = _yearPageWrap(inner, {padX:'28px', gap:'0'});

  function _narrativeWrap(){ return pageEl.querySelector('[data-year-narrative-wrap]'); }

  // Split narrative into readable sentence blocks. Handles both lowercase
  // app-voice punctuation ("x. y.") and inline em-dashes by preserving them.
  // Each sentence becomes its own <p> with subtle stagger-in.
  function _splitSentences(text){
    if(!text) return [];
    // split on sentence-ending punctuation followed by space+letter
    var parts = text.match(/[^.!?]+[.!?]+(?:["\u201d]?)(?:\s|$)/g);
    if(!parts) return [text.trim()];
    return parts.map(function(s){ return s.trim(); }).filter(Boolean);
  }

  function _applyAi(){
    var ai = window._yearInsights;
    if(!ai || !ai.year_narrative) return;
    var wrap = _narrativeWrap();
    if(!wrap) return;
    if(wrap.dataset.narrativeApplied === '1') return;
    wrap.dataset.narrativeApplied = '1';

    var sentences = _splitSentences(ai.year_narrative);
    if(sentences.length === 0) return;

    // Fade out the floor line, then inject per-sentence blocks with stagger.
    wrap.style.transition = 'opacity 340ms ease';
    wrap.style.opacity = '0';

    // inject keyframes once
    if(!document.getElementById('_yearNarrativeKeyframes')){
      var style = document.createElement('style');
      style.id = '_yearNarrativeKeyframes';
      style.textContent =
        '@keyframes _yrNarIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }';
      document.head.appendChild(style);
    }

    setTimeout(function(){
      var html = sentences.map(function(s, i){
        // Capitalize sentence start + any proper nouns the AI name-dropped.
        // Model outputs are all lowercase; we title-case sentence openings
        // so the rendered copy reads as proper prose, not a twitter thread.
        var shown = _capitalizeFirst(s.trim());
        if(userName){
          // turn embedded lowercase user-name occurrences into proper case
          var lowered = userName.toLowerCase();
          var re = new RegExp('\\b' + lowered.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b', 'g');
          shown = shown.replace(re, userName);
        }
        // First sentence gets a subtle larger-size treatment; the rest are even.
        var sizeRem = i === 0 ? 17 : 15.5;
        var opacity = i === 0 ? 0.92 : 0.78;
        var delay = 80 + i * 140;
        return '<p style="'
          + 'font-family:Fraunces,serif;font-style:italic;font-weight:300;'
          + 'font-size:' + sizeRem + 'px;line-height:1.7;'
          + 'letter-spacing:0.005em;'
          + 'color:rgba(245,237,224,' + opacity + ');'
          + 'text-align:center;margin:0 0 14px;'
          + 'opacity:0;transform:translateY(6px);'
          + 'animation:_yrNarIn 640ms ' + delay + 'ms cubic-bezier(.2,.7,.25,1) forwards;'
          + '">' + _escForHtml(shown) + '</p>';
      }).join('');
      wrap.innerHTML = html;
      wrap.style.opacity = '1';
    }, 360);
  }

  if(window._yearInsights && window._yearInsights.year_narrative){
    _applyAi();
  } else {
    var checks = 0;
    var pollId = setInterval(function(){
      checks++;
      if(window._yearInsights && window._yearInsights.year_narrative){
        clearInterval(pollId); _applyAi();
      } else if(checks > 40){
        clearInterval(pollId);
      }
    }, 200);
  }
}

// HTML escape helper scoped to held.js narrative blocks so user names
// (or AI output containing literal < / > / &) can't break layout.
function _escForHtml(s){
  return String(s||'')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// Page 7 — Carry one forward (pendant chooser inlined)
function _renderYearPage7(pageEl, d){
  // Page 5 already framed WHAT the pendants are (you made these, they're
  // calculated from your emotions). This page is about the ACT of choosing
  // — which month do you want to carry with you? Copy here is an
  // invitation, not an explanation.
  var header = ''
    + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.42;text-transform:uppercase;letter-spacing:0.22em;margin:0 0 10px;text-align:center">carry one forward</p>'
    + '<div style="width:28px;height:1px;background:linear-gradient(90deg,transparent,rgba(201,148,58,0.5),transparent);margin:0 auto 16px"></div>'
    // primary headline — about the choice itself
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:20px;color:rgba(245,237,224,0.92);text-align:center;margin:0 0 14px;line-height:1.45">Which one do you keep?</p>'
    // three breath-sized invitations to choose
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:14px;color:rgba(245,237,224,0.72);text-align:center;margin:0 0 10px;line-height:1.7;max-width:340px;margin-left:auto;margin-right:auto">Pick the month that meant something — the one that held you, the one you held most, the one you are not ready to let go of.</p>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:14px;color:rgba(245,237,224,0.72);text-align:center;margin:0 0 10px;line-height:1.7;max-width:340px;margin-left:auto;margin-right:auto">It does not have to be the brightest month. It can be the hardest. It can be the quietest. There is no wrong choice here.</p>'
    + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:14px;color:rgba(245,237,224,0.72);text-align:center;margin:0 0 22px;line-height:1.7;max-width:340px;margin-left:auto;margin-right:auto">Whichever you choose becomes the pendant on your chain. It will hang with you into year two.</p>';

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
      var _mIdx = parseInt(ym.split('-')[1], 10) - 1;
      localStorage.setItem('gc_pendant_year_'+year, JSON.stringify({
        ym: ym,
        monthISO: ym,
        monthIdx: _mIdx,
        monthName: monthName,
        dominant: mDom,
        count: monthEntries.length
      }));
      if (typeof window._invalidatePendantCache === 'function') window._invalidatePendantCache();
      // Show the "your necklace" witness message before dismissing the
      // ceremony. Gives the chosen moment its weight — the pendant isn't
      // just a picked month, it's the necklace they made from a whole year.
      _showNecklaceWitness({
        monthName: monthName,
        dominant: mDom,
        count: monthEntries.length,
        totalMornings: d.total,
        // pass the actual month's entries so the witness can render the
        // CHOSEN pendant rose-curve at full fidelity (not just a tinted orb)
        monthEntries: monthEntries,
        monthIdx: _mIdx
      });
    });
  });

  pageEl.innerHTML = '';
  var wrap = document.createElement('div');
  wrap.style.cssText = 'padding:80px 24px calc(80px + env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;height:100%;max-width:420px;margin:0 auto;box-sizing:border-box;overflow:hidden';
  wrap.innerHTML = header;
  wrap.appendChild(cardsWrap);
  pageEl.appendChild(wrap);
}

// Capitalize proper nouns (user names, month names) to read cleanly as nouns
// while the rest of the app voice stays in lowercase. Accepts things like
// "alterina" → "Alterina", "mary-jane" → "Mary-Jane", "o'brien" → "O'Brien".
function _toProperCase(s){
  if(!s) return s;
  return String(s).toLowerCase().replace(/(^|[\s'\-])([a-zA-Z\u00c0-\u024f])/g, function(_, sep, ch){
    return sep + ch.toUpperCase();
  });
}

// Capitalize the first alphabetic letter of a sentence. Preserves the rest.
function _capitalizeFirst(s){
  if(!s) return s;
  return String(s).replace(/^(\s*)([a-z\u00e0-\u024f])/, function(_, sp, ch){
    return sp + ch.toUpperCase();
  });
}

// The "your necklace" witness — shown after the user picks their pendant,
// before dismissing the year-end ceremony. Crossfades over the ceremony
// overlay with a longer reflection on what the pendant actually IS.
function _showNecklaceWitness(opts){
  opts = opts || {};
  var monthName = _toProperCase((opts.monthName || '').toString());
  var dominant = opts.dominant || 'calm';
  var count = opts.count || 0;
  var totalMornings = opts.totalMornings || 0;

  // personalize with name — keep as-entered if it's already cased, else proper-case it
  var userName = '';
  try {
    var u = JSON.parse(localStorage.getItem('gc_user') || '{}');
    var raw = (u.name || '').trim();
    if(raw && raw.length <= 40 &&
       raw.replace(/[\s'\-]/g, '').match(/^[a-zA-Z\u00c0-\u024f]+$/)){
      userName = _toProperCase(raw);
    }
  } catch(e){}

  var emotionWord = (typeof PORTRAIT_WORDS !== 'undefined' && PORTRAIT_WORDS[dominant]) || dominant;
  var palette = (typeof KNOT_PARAMS !== 'undefined' && KNOT_PARAMS[dominant])
    ? KNOT_PARAMS[dominant]
    : { color:'#c9943a', glow:'rgba(201,148,58,0.4)' };

  // The witness copy — 6 sentences. Sentence-case throughout (proper nouns
  // capitalized, sentence starts capitalized) while preserving the tender
  // cadence. Places the name once, naturally.
  function N(without, with_){ return userName ? with_ : without; }
  var lines = [
    'This is your necklace of the year.',
    'It is a keepsake of what you felt, and of the self who showed up to feel it.',
    N(
      'It is the shape you made by showing up ' + totalMornings + ' mornings — woven from your own honest days.',
      userName + ', it is the shape you made by showing up ' + totalMornings + ' mornings — woven from your own honest days.'
    ),
    'The pendant at its heart is ' + monthName + ' — the month that held your ' + emotionWord + ' most fully.',
    'It carries the color of what you felt, the weight of what you wrote, the quiet of everything the chain witnessed.',
    'Keep it. Wear it somewhere you can feel it. It is yours because you made it.'
  ];

  var overlay = document.getElementById('yearCeremonyOverlay');
  if(!overlay) return;

  // Create the witness layer, fade out existing content first
  var existingContent = overlay.firstElementChild;
  if(existingContent){
    existingContent.style.transition = 'opacity 500ms ease';
    existingContent.style.opacity = '0';
    existingContent.style.pointerEvents = 'none';
  }

  var layer = document.createElement('div');
  layer.id = 'necklaceWitnessLayer';
  layer.style.cssText = [
    'position:absolute','inset:0','z-index:5',
    'display:flex','flex-direction:column','align-items:center','justify-content:flex-start',
    // anchor the pendant near the top of the viewport and let copy flow below
    'padding:max(48px, calc(env(safe-area-inset-top) + 32px)) 24px 96px',
    'opacity:0','transition:opacity 800ms ease',
    'pointer-events:auto',
    'overflow-y:auto','-webkit-overflow-scrolling:touch'
  ].join(';');

  // inject keyframes once
  if(!document.getElementById('_necklaceWitnessKeyframes')){
    var style = document.createElement('style');
    style.id = '_necklaceWitnessKeyframes';
    style.textContent =
      '@keyframes _nwIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }' +
      '@keyframes _nwBreath { 0%,100% { transform: scale(1); } 50% { transform: scale(1.035); } }' +
      '@keyframes _nwHaloBreath { 0%,100% { opacity: 0.85; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }';
    document.head.appendChild(style);
  }

  var rgb = (function(){
    var h = (palette.color||'#c9943a').replace('#','');
    return {
      r: parseInt(h.slice(0,2),16),
      g: parseInt(h.slice(2,4),16),
      b: parseInt(h.slice(4,6),16)
    };
  })();
  var tint = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b;

  var sentencesHtml = lines.map(function(s, i){
    var delay = 1100 + i * 420;
    var sizeRem = i === 0 ? 20 : (i === 5 ? 17 : 15);
    var opacity = i === 0 ? 0.95 : (i === 5 ? 0.85 : 0.75);
    return '<p style="'
      + 'font-family:Fraunces,serif;font-style:italic;font-weight:300;'
      + 'font-size:' + sizeRem + 'px;line-height:1.7;letter-spacing:0.005em;'
      + 'color:rgba(245,237,224,' + opacity + ');'
      + 'text-align:center;margin:0 0 14px;max-width:400px;'
      + 'opacity:0;transform:translateY(8px);'
      + 'animation:_nwIn 900ms ' + delay + 'ms cubic-bezier(.2,.7,.25,1) forwards;'
      + '">' + _escForHtml(s) + '</p>';
  }).join('');

  // Pendant "stage" — bigger, sits near the top, with a halo + real rose curve
  // canvas so the colors/petals pop instead of a blurred orb.
  var PENDANT_SIZE = 180; // logical CSS px
  var pendantStageHtml = ''
    + '<div style="position:relative;width:' + PENDANT_SIZE + 'px;height:' + PENDANT_SIZE + 'px;margin:0 0 28px;">'
    // outer soft halo — palette tint
    +   '<div style="position:absolute;inset:-40px;border-radius:50%;'
    +     'background:radial-gradient(circle,' + tint + ',0.28) 0%,' + tint + ',0.1) 45%,' + tint + ',0) 75%);'
    +     'opacity:0;'
    +     'animation:_nwIn 1400ms 100ms cubic-bezier(.2,.7,.25,1) forwards, _nwHaloBreath 5s 1500ms ease-in-out infinite;'
    +   '"></div>'
    // inner brighter ring halo
    +   '<div style="position:absolute;inset:0;border-radius:50%;'
    +     'box-shadow:0 0 60px ' + tint + ',0.45), 0 0 140px ' + tint + ',0.22), inset 0 0 0 1px ' + tint + ',0.18);'
    +     'opacity:0;animation:_nwIn 1200ms 250ms cubic-bezier(.2,.7,.25,1) forwards;'
    +   '"></div>'
    // canvas where the actual rose-curve pendant renders
    +   '<canvas id="_necklacePendantCv" width="' + (PENDANT_SIZE * 2) + '" height="' + (PENDANT_SIZE * 2) + '" '
    +     'style="position:relative;width:' + PENDANT_SIZE + 'px;height:' + PENDANT_SIZE + 'px;display:block;'
    +     'opacity:0;'
    +     'animation:_nwIn 1200ms 400ms cubic-bezier(.2,.7,.25,1) forwards, _nwBreath 6s 1600ms ease-in-out infinite;'
    +     'filter:drop-shadow(0 8px 40px ' + tint + ',0.55));'
    +   '"></canvas>'
    + '</div>';

  layer.innerHTML = ''
    + pendantStageHtml
    // label
    + '<p style="'
    +   'font-family:DM Mono,monospace;font-size:10px;color:rgba(201,148,58,0.65);'
    +   'letter-spacing:0.26em;text-transform:uppercase;margin:0 0 26px;'
    +   'opacity:0;animation:_nwIn 800ms 650ms cubic-bezier(.2,.7,.25,1) forwards;'
    + '">woven ' + _escForHtml(monthName) + '</p>'
    // sentences
    + '<div style="width:100%;max-width:420px">' + sentencesHtml + '</div>'
    // dismiss prompt
    + '<p id="_necklaceDismiss" style="'
    +   'position:fixed;bottom:calc(36px + env(safe-area-inset-bottom));'
    +   'left:50%;transform:translateX(-50%);'
    +   'font-family:Fraunces,serif;font-style:italic;font-weight:300;'
    +   'font-size:13px;color:rgba(201,148,58,0.55);margin:0;'
    +   'cursor:pointer;opacity:0;'
    +   'animation:_nwIn 600ms ' + (1100 + lines.length * 420 + 500) + 'ms cubic-bezier(.2,.7,.25,1) forwards;'
    + '">tap to carry it with you</p>';

  overlay.appendChild(layer);
  requestAnimationFrame(function(){ layer.style.opacity = '1'; });

  // Draw the real rose-curve pendant on the canvas using the user's actual
  // month entries. Uses the same renderer as the year grid / chain clasp so
  // petal count, color blend, and curve exactly match what they picked.
  requestAnimationFrame(function(){
    var cv = document.getElementById('_necklacePendantCv');
    if(!cv) return;
    if(opts.monthEntries && opts.monthEntries.length > 0 && typeof drawKnotOnCanvas === 'function'){
      drawKnotOnCanvas(cv, opts.monthEntries, opts.monthIdx || 0);
    } else if(typeof _drawKnotGeometry === 'function' && opts.monthEntries){
      // fallback: direct geometry call
      var ctx = cv.getContext('2d');
      var dpr = Math.min(window.devicePixelRatio||1, 2);
      cv.width  = PENDANT_SIZE * dpr;
      cv.height = PENDANT_SIZE * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      _drawKnotGeometry(ctx, PENDANT_SIZE/2, PENDANT_SIZE/2, PENDANT_SIZE * 0.42, opts.monthEntries, opts.monthIdx || 0);
    }
  });

  // Dismiss on tap (anywhere on the layer) or Escape
  function _dismiss(){
    layer.style.opacity = '0';
    setTimeout(function(){
      if (typeof _dismissAnnualCeremony === 'function') _dismissAnnualCeremony();
    }, 600);
  }
  // give the copy a beat to appear before accepting taps
  setTimeout(function(){
    layer.addEventListener('click', _dismiss);
    document.addEventListener('keydown', function onKey(e){
      if(e.key === 'Escape'){
        document.removeEventListener('keydown', onKey);
        _dismiss();
      }
    });
  }, 1400);
}

function _showAnnualCeremony(){
  if (document.getElementById('yearCeremonyOverlay')) return;
  var d = _buildYearCeremonyData();
  if (d.total === 0) return;

  // ── AI YEAR NARRATIVE FETCH ──
  // Consume the prefetch kicked off by the demo panel or submit handler.
  // If none exists, fire a fresh fetch here. Either way, stash the result
  // on window._yearInsights so Page 6 can crossfade it in when it lands.
  // Rich JS fallback below if the backend never responds (or Foundry
  // returns a short narrative).
  (function(){
    var RICH_FALLBACK = {
      closing_line: 'the chain remembers every morning you arrived.',
      year_narrative: (
        'this is the shape of your year — the quiet accumulation of arrivals, morning after morning, through whatever the days actually held. ' +
        'some months were fuller than others; that is how years go. ' +
        'you wrote from light days and hard ones, and both made it onto the thread. ' +
        'the contrasts are real — hope and weight can live in the same year, and yours did. ' +
        'what this asked of you is not small: attention, honesty, the willingness to name the moment even when the moment was not easy. ' +
        'the chain does not ask you to be proud. it only witnesses that you came back.'
      ),
      pendant_whisper: 'it will hang with you into what comes next.'
    };

    // If the AI narrative is too short (backend returned a 1-2 sentence
    // legacy response), prefer the rich fallback instead of a thin one.
    function _chooseNarrative(ai){
      if(!ai) return RICH_FALLBACK;
      var n = ai.year_narrative || '';
      if(n.length < 180) {
        // keep other fields but upgrade the narrative
        return {
          closing_line: ai.closing_line || RICH_FALLBACK.closing_line,
          year_narrative: RICH_FALLBACK.year_narrative,
          pendant_whisper: ai.pendant_whisper || RICH_FALLBACK.pendant_whisper
        };
      }
      return ai;
    }

    // Pre-seed with rich fallback so Page 6 has good copy even if AI never lands
    if(!window._yearInsights) window._yearInsights = RICH_FALLBACK;

    var _promise = window._yearlyInsightsPrefetch;
    window._yearlyInsightsPrefetch = null;

    if(!_promise){
      // compose payload from ceremony data
      var _userName = '';
      try { _userName = (JSON.parse(localStorage.getItem('gc_user')||'{}').name || '').trim(); } catch(e){}
      var payload = {
        total_mornings: d.total,
        dominant_emotion: d.dominant || 'calm',
        year_word: d.word || 'stillness',
        fullest_month: d.fullestMonthName || '',
        top_emotions: (d.sortedEmos || []).slice(0,4),
        longest_entry_excerpt: d.longestEntry ? (d.longestEntry.text || '').slice(0,500) : '',
        name: _userName
      };
      _promise = fetch(API_BASE + '/yearly-insights', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      }).then(function(r){ return r.json(); })
        .catch(function(){ return null; });
    }
    // 6-second deadline — if the AI hasn't landed by then, stick with
    // the rich fallback rather than leaving users watching a spinner.
    var _settled = false;
    _promise.then(function(data){
      if(_settled) return;
      _settled = true;
      window._yearInsights = _chooseNarrative(data);
    });
    setTimeout(function(){
      if(_settled) return;
      _settled = true;
      // rich fallback already in place; no-op
    }, 6000);
  })();

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

// Move the parchment modal out of its tab container so parent opacity /
// visibility / transform states never affect it. Modals belong at body root.
(function relocateParchment(){
  var philosEl = document.getElementById('alongsidePhilosophy');
  if(philosEl && philosEl.parentElement !== document.body){
    document.body.appendChild(philosEl);
  }
})();

function _openParchmentModal(){
  var philosEl = document.getElementById('alongsidePhilosophy');
  if(!philosEl) return;
  // Defensive re-parent in case some later code moved it back.
  if(philosEl.parentElement !== document.body){
    document.body.appendChild(philosEl);
  }
  var laterBtn = document.getElementById('philosLaterBtn');
  var seen = localStorage.getItem('gc_link_philosophy_seen');
  if(laterBtn) laterBtn.textContent = seen ? 'back' : 'maybe later';
  philosEl.hidden = false;
  requestAnimationFrame(function(){ philosEl.classList.add('open'); });
}
function _closeParchmentModal(){
  var philosEl = document.getElementById('alongsidePhilosophy');
  if(!philosEl) return;
  philosEl.classList.remove('open');
  setTimeout(function(){ philosEl.hidden = true; }, 360);
}

function populateAlongsideTab(){
  var seen = localStorage.getItem('gc_link_philosophy_seen');
  var links = [];
  try{ links = JSON.parse(localStorage.getItem('gc_links')||'[]'); }catch(e){}
  var activeEl = document.getElementById('alongsideActive');
  if(!activeEl) return;

  // Active panel is always visible underneath; philosophy is a modal on top.
  activeEl.style.display = 'block';
  populateWalkingSection();

  // Fetch pending invitations from the backend (shows a card if any exist).
  if(typeof refreshPendingInvites === 'function') refreshPendingInvites();

  // First-ever visit → float the parchment on top so they read the rule.
  if(!seen && links.length === 0){
    _openParchmentModal();
  }
}

// Parchment modal wiring — philosophy is now a modal overlay.
(function(){
  function dismissPhilosophy(){
    localStorage.setItem('gc_link_philosophy_seen', '1');
    _closeParchmentModal();
  }

  var linkBtn = document.getElementById('philosLinkBtn');
  if(linkBtn){
    linkBtn.addEventListener('click', function(){
      dismissPhilosophy();
      setTimeout(function(){
        if(typeof showLinkInviteFlow === 'function') showLinkInviteFlow();
      }, 380);
    });
  }
  var laterBtn = document.getElementById('philosLaterBtn');
  if(laterBtn){
    laterBtn.addEventListener('click', dismissPhilosophy);
  }

  // "about walking alongside →" link on the active panel — re-opens the
  // parchment modal. Doesn't clear gc_link_philosophy_seen so tab-reopens
  // continue to go straight to the active panel.
  var aboutLink = document.getElementById('aboutAlongsideLink');
  if(aboutLink){
    aboutLink.addEventListener('click', _openParchmentModal);
  }

  // Backdrop tap — click outside the card closes the modal.
  var modal = document.getElementById('alongsidePhilosophy');
  if(modal){
    modal.addEventListener('click', function(e){
      if(e.target === modal){
        localStorage.setItem('gc_link_philosophy_seen', '1');
        _closeParchmentModal();
      }
    });
  }

  // Esc closes the modal too.
  document.addEventListener('keydown', function(e){
    if(e.key !== 'Escape') return;
    var philosEl = document.getElementById('alongsidePhilosophy');
    if(philosEl && !philosEl.hidden){
      localStorage.setItem('gc_link_philosophy_seen', '1');
      _closeParchmentModal();
    }
  });
})();

// Pending invitations — fetch from backend whenever alongside tab opens.
// Displayed above the active walking-alongside list as a small card with
// accept / decline controls.
function refreshPendingInvites(){
  var host = document.getElementById('pendingInvites');
  if(!host) return;
  var u = {};
  try{ u = JSON.parse(localStorage.getItem('gc_user')||'{}'); }catch(e){}
  // Server now derives email from user_id — no client-side email early-return.
  var uid = localStorage.getItem('gc_user_id') || '';
  fetch(API_BASE + '/link/pending?user_id=' + encodeURIComponent(uid))
    .then(function(r){ return r.json(); })
    .then(function(data){
      if(!data || !data.ok) return;
      var list = data.pending || [];
      if(list.length === 0){ host.style.display = 'none'; host.innerHTML = ''; return; }
      host.style.display = 'block';
      var html = '<p style="font-family:\'DM Mono\',monospace;font-size:8px;letter-spacing:0.18em;color:rgba(201,148,58,0.35);text-transform:uppercase;margin:0 0 10px">invitations waiting for you</p>';
      list.forEach(function(inv){
        var nickSafe = (inv.requester_nickname || 'someone').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        html += '<div class="pending-invite-card" data-link-id="'+inv.id+'" style="'+
          'padding:14px 16px;margin-bottom:10px;'+
          'background:rgba(201,148,58,0.04);border:1px solid rgba(201,148,58,0.18);'+
          'border-radius:14px;display:flex;flex-direction:column;gap:10px">'+
          '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-weight:300;'+
          'font-size:14px;color:rgba(245,237,224,0.85);margin:0;line-height:1.5">'+
          nickSafe + ' wants to walk alongside you.</p>'+
          '<div style="display:flex;gap:8px">'+
          '<button class="pending-accept" style="flex:1;padding:8px 14px;'+
          'background:rgba(201,148,58,0.14);border:1px solid rgba(201,148,58,0.45);'+
          'border-radius:10px;font-family:\'Fraunces\',serif;font-style:italic;font-size:12px;'+
          'color:var(--gold);cursor:pointer;transition:all 180ms ease">accept</button>'+
          '<button class="pending-decline" style="flex:1;padding:8px 14px;'+
          'background:transparent;border:1px solid rgba(245,237,224,0.1);'+
          'border-radius:10px;font-family:\'Fraunces\',serif;font-style:italic;font-size:12px;'+
          'color:rgba(245,237,224,0.4);cursor:pointer;transition:all 180ms ease">not now</button>'+
          '</div></div>';
      });
      host.innerHTML = html;

      // wire up button handlers
      host.querySelectorAll('.pending-invite-card').forEach(function(card){
        var linkId = card.dataset.linkId;
        var accept = card.querySelector('.pending-accept');
        var decline = card.querySelector('.pending-decline');
        if(accept) accept.addEventListener('click', function(){
          fetch(API_BASE + '/link/accept', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
              link_id: linkId,
              user_id: localStorage.getItem('gc_user_id') || ''
            })
          }).then(function(r){ return r.json(); }).then(function(res){
            if(res && res.ok){
              refreshPendingInvites();
              populateWalkingSection();
            }
          });
        });
        if(decline) decline.addEventListener('click', function(){
          fetch(API_BASE + '/link/decline', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
              link_id: linkId,
              user_id: localStorage.getItem('gc_user_id') || ''
            })
          }).then(function(){ refreshPendingInvites(); });
        });
      });
    })
    .catch(function(){ /* backend down — show nothing */ });
}

// Expose for other modules (navigation.js calls populateHeld → this fires)
window.refreshPendingInvites = refreshPendingInvites;

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

// Email-based link invitation flow. Replaces the old shareable-code generator.
// User types (1) a nickname they'll see for the person and (2) the target's
// email address. Backend stores a pending invitation. If the target is a
// GratitudeChain user, they'll see it on their Held > Alongside tab next time.
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
      'color:rgba(245,237,224,0.35);margin:0 0 28px;max-width:260px">',
      'enter their email. they\u2019ll see your invitation next time they open the app.</p>',
    '<input id="linkNicknameInput" placeholder="a name for them" maxlength="40" style="',
      'width:100%;max-width:280px;padding:14px 18px;background:var(--glass);',
      'border:1px solid var(--glass-border);border-radius:14px;font-family:\'Fraunces\',serif;',
      'font-style:italic;font-size:15px;color:var(--text);outline:none;text-align:center;',
      'transition:border-color 200ms;margin-bottom:12px">',
    '<input id="linkEmailInput" type="email" placeholder="their email" autocomplete="email" inputmode="email" style="',
      'width:100%;max-width:280px;padding:14px 18px;background:var(--glass);',
      'border:1px solid var(--glass-border);border-radius:14px;font-family:\'Fraunces\',serif;',
      'font-style:italic;font-size:15px;color:var(--text);outline:none;text-align:center;',
      'transition:border-color 200ms;margin-bottom:24px">',
    '<button id="linkSendBtn" style="background:rgba(201,148,58,0.06);',
      'border:1px solid rgba(201,148,58,0.2);border-radius:20px;padding:12px 28px;',
      'font-family:\'Fraunces\',serif;font-style:italic;font-size:13px;',
      'color:rgba(201,148,58,0.4);cursor:pointer;transition:all 200ms ease">',
      'send invitation</button>',
    '<p id="linkSendStatus" style="font-family:\'DM Mono\',monospace;font-size:9px;',
      'letter-spacing:0.08em;color:rgba(201,148,58,0.4);margin:18px 0 0;min-height:16px;text-align:center"></p>'
  ].join('');

  document.body.appendChild(overlay);
  requestAnimationFrame(function(){ overlay.style.opacity = '1'; });

  document.getElementById('linkFlowBack').addEventListener('click', function(){
    overlay.style.opacity = '0';
    setTimeout(function(){ if(overlay.parentNode) overlay.remove(); }, 500);
  });

  var nameInput  = document.getElementById('linkNicknameInput');
  var emailInput = document.getElementById('linkEmailInput');
  var sendBtn    = document.getElementById('linkSendBtn');
  var statusEl   = document.getElementById('linkSendStatus');

  function _isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||'').trim()); }
  function _updateReady(){
    var hasName  = nameInput.value.trim().length > 0;
    var hasEmail = _isValidEmail(emailInput.value);
    var ok = hasName && hasEmail;
    sendBtn.style.color       = ok ? 'var(--gold)' : 'rgba(201,148,58,0.4)';
    sendBtn.style.borderColor = ok ? 'rgba(201,148,58,0.4)' : 'rgba(201,148,58,0.2)';
    sendBtn.style.background  = ok ? 'rgba(201,148,58,0.1)' : 'rgba(201,148,58,0.06)';
  }
  nameInput.addEventListener('input', _updateReady);
  emailInput.addEventListener('input', _updateReady);
  [nameInput, emailInput].forEach(function(el){
    el.addEventListener('focus', function(){ el.style.borderColor = 'var(--gold)'; });
    el.addEventListener('blur',  function(){ el.style.borderColor = 'var(--glass-border)'; });
  });
  setTimeout(function(){ try{ nameInput.focus(); }catch(e){} }, 300);

  sendBtn.addEventListener('click', function(){
    var nickname = nameInput.value.trim();
    var targetEmail = emailInput.value.trim().toLowerCase();
    if(!nickname) return;
    if(!_isValidEmail(targetEmail)) return;
    var u = {};
    try{ u = JSON.parse(localStorage.getItem('gc_user')||'{}'); }catch(e){}
    if(!u.email){
      statusEl.textContent = 'set your email in settings first.';
      statusEl.style.color = 'rgba(180,80,60,0.6)';
      return;
    }
    if(targetEmail === u.email){
      statusEl.textContent = 'that\u2019s you.';
      statusEl.style.color = 'rgba(180,80,60,0.6)';
      return;
    }
    sendBtn.style.opacity = '0.5';
    sendBtn.style.pointerEvents = 'none';
    fetch(API_BASE + '/link/request', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: localStorage.getItem('gc_user_id') || '',
        user_email: u.email,
        nickname: nickname,
        target_email: targetEmail
      })
    }).then(function(r){ return r.json(); }).then(function(res){
      showSentConfirmation(overlay, nickname, targetEmail);
    }).catch(function(){
      // Graceful: even offline, treat as sent for privacy consistency.
      showSentConfirmation(overlay, nickname, targetEmail);
    });
  });
}

// Confirmation view — always same message whether target email exists or not.
// Privacy: do not confirm or deny whether the email is a known user.
function showSentConfirmation(overlay, nickname, email){
  overlay.style.opacity = '0';
  setTimeout(function(){
    overlay.innerHTML = [
      '<button id="codeDoneBtn" style="position:absolute;top:max(20px,env(safe-area-inset-top));',
        'right:20px;background:var(--glass);border:1px solid var(--glass-border);',
        'border-radius:20px;padding:6px 14px;font-family:\'DM Mono\',monospace;font-size:10px;',
        'letter-spacing:0.06em;color:var(--muted);cursor:pointer">close</button>',

      '<div style="width:56px;height:56px;border-radius:50%;',
        'background:rgba(201,148,58,0.08);border:1px solid rgba(201,148,58,0.35);',
        'display:flex;align-items:center;justify-content:center;margin:0 0 22px">',
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9943a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">',
        '<path d="M4 6l8 7 8-7"/><path d="M4 6v12h16V6"/></svg>',
      '</div>',

      '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-weight:300;font-size:20px;',
        'color:rgba(245,237,224,0.88);margin:0 0 14px;max-width:300px;line-height:1.45">invitation sent.</p>',

      '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-weight:300;font-size:13.5px;',
        'color:rgba(245,237,224,0.55);margin:0 0 10px;max-width:320px;line-height:1.7">',
        'if <span style="color:var(--gold)">'+email.replace(/</g,'&lt;')+'</span> is a GratitudeChain user,<br>',
        'they\u2019ll see your invitation next time they open the app.</p>',

      '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-weight:300;font-size:12.5px;',
        'color:rgba(245,237,224,0.35);margin:0 0 32px;max-width:300px;line-height:1.7">',
        'they won\u2019t be told who sent it until they accept.</p>',

      '<button id="sentDoneBtn" style="background:rgba(201,148,58,0.1);',
        'border:1px solid rgba(201,148,58,0.3);border-radius:20px;padding:12px 28px;',
        'font-family:\'Fraunces\',serif;font-style:italic;font-size:13px;',
        'color:var(--gold);cursor:pointer;transition:all 200ms ease">done</button>'
    ].join('');

    overlay.style.opacity = '1';

    function _close(){
      overlay.style.opacity = '0';
      setTimeout(function(){ if(overlay.parentNode) overlay.remove(); }, 500);
    }
    document.getElementById('codeDoneBtn').addEventListener('click', _close);
    document.getElementById('sentDoneBtn').addEventListener('click', _close);
  }, 500);
}

// Wire the "+ link someone" button once the DOM is ready
(function(){
  var btn = document.getElementById('linkAddBtn');
  if(btn){
    btn.addEventListener('click', function(){ showLinkInviteFlow(); });
  }
})();

