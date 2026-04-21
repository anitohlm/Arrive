// ═══ RESTORE STATE ON RELOAD ════════════════════════
// Load order: streak.js must be loaded before this module (`hasLogged` is read at module top).
if(hasLogged){
  $('s-splash').classList.add('logged');
  // homeStreak is set unconditionally below with splashDay (same calendar-based computation)
  showNav();
}
// logged messages — varies by streak
// messages tiered by streak depth — deeper messages for longer streaks
var LOGGED_MSGS_EARLY = [ // days 1-14
  'logged today. the chain grew.',
  'you showed up. that matters.',
  'one more link. one more day.',
  'another morning, another knot.',
  'today counted. you made it count.'
];
var LOGGED_MSGS_MID = [ // days 15-60
  'the thread holds. so do you.',
  'you arrived. the chain remembers.',
  'held again. quietly, beautifully.',
  'one day at a time. this was one.',
  'gentle work. the chain knows.',
  'you carried it forward today.',
  'another thread woven in.'
];
var LOGGED_MSGS_DEEP = [ // days 60+
  'the chain doesn\u2019t forget.',
  'still here. still holding.',
  'the knot is tied. rest now.',
  'you are the chain now.',
  'every knot remembers you.',
  'this is what showing up looks like.',
  'the thread knows your name.',
  'quietly, day after day. this is devotion.'
];
function getLoggedMsg(day){
  if(day<=14) return LOGGED_MSGS_EARLY[(day-1)%LOGGED_MSGS_EARLY.length];
  if(day<=60) return LOGGED_MSGS_MID[(day-1)%LOGGED_MSGS_MID.length];
  return LOGGED_MSGS_DEEP[(day-1)%LOGGED_MSGS_DEEP.length];
}
// update day counters on splash
var splashDay = gcStartDate
    ? getDayNumber(todayISO())
    : Math.max(1, hasLogged ? dayNum - 1 : dayNum);
$('homeStreak').textContent = 'morning '+splashDay;
// dayCounter element is intentionally display:none (day counter consolidated to homeStreak); no need to write here
if(hasLogged) $('loggedMsg').textContent = getLoggedMsg(splashDay);

// Annual ceremony safety net: if pending flag survived a force-close,
// fire annual now that splash is stable. Guard: only fire if the user
// is still on splash when the 600ms timer elapses — otherwise the
// ceremony would overlay arrival / insight / journal, which is jarring.
// In that case we re-stash the flag so it fires on the next boot-to-splash.
try {
  if (localStorage.getItem('gc_annual_pending') && !document.getElementById('monthEndOverlay') && !document.getElementById('yearCeremonyOverlay')) {
    var _pendingYear = localStorage.getItem('gc_annual_pending');
    localStorage.removeItem('gc_annual_pending');
    setTimeout(function(){
      var splash = document.getElementById('s-splash');
      if(!splash || !splash.classList.contains('active')){
        // user moved past splash; defer to next splash visit
        if(_pendingYear) localStorage.setItem('gc_annual_pending', _pendingYear);
        return;
      }
      if (typeof _showAnnualCeremony === 'function') _showAnnualCeremony();
    }, 600);
  }
} catch(e) {}

// ═══ SCREEN 1 → 2 ══════════════════════════════════
// Re-verify "logged today" on every splash tap instead of trusting the
// module-level `hasLogged` computed once at script load. If the user taps
// through and no real entry for today exists in gc_entries, any "logged"
// markers are phantom — clear them and let the tap proceed. This is the
// last line of defense against stale localStorage blocking a new entry.
// LOCAL-date ISO (not UTC) — users east of UTC would otherwise see today-ISO
// lag a day during early-morning hours, causing yesterday's entry to match
// "today" and locking the splash in "logged" state.
function _localTodayISO(){
  var d = new Date();
  var p = function(n){ return String(n).padStart(2,'0'); };
  return d.getFullYear() + '-' + p(d.getMonth()+1) + '-' + p(d.getDate());
}
function _reallyLoggedToday(){
  try{
    var iso = _localTodayISO();
    var entries = JSON.parse(localStorage.getItem('gc_entries')||'[]');
    return entries.some(function(e){
      if(e.dateISO && e.dateISO === iso) return true;
      if(e.date && String(e.date).slice(0,10) === iso) return true;
      if(e.timestamp && String(e.timestamp).slice(0,10) === iso) return true;
      return false;
    });
  }catch(err){ return false; }
}
function _forceClearTodayMarkers(){
  try{
    var iso = _localTodayISO();
    localStorage.removeItem('gc_logged_today');
    var arr = JSON.parse(localStorage.getItem('gc_logged_dates')||'[]').filter(function(d){ return d !== iso; });
    localStorage.setItem('gc_logged_dates', JSON.stringify(arr));
    $('s-splash').classList.remove('logged');
  }catch(err){}
}

$('s-splash').addEventListener('click', (e) => {
  // don't trigger if tapping nav
  if(e.target.closest('.bottom-nav')) return;

  // Trust only real entries. If the splash says "logged" but no entry in
  // gc_entries actually corresponds to today, the markers are stale — clear
  // them and open arrival like normal.
  if($('s-splash').classList.contains('logged') && !_reallyLoggedToday()){
    _forceClearTodayMarkers();
  }

  if($('s-splash').classList.contains('logged')){
    const msg = $('loggedTapMsg');
    msg.classList.add('vis');
    clearTimeout(window._loggedMsgTimer);
    window._loggedMsgTimer = setTimeout(()=> msg.classList.remove('vis'), 3000);
    return;
  }

  $('s-splash').classList.add('dimmed');
  // Reset arrival to step 1 (category cards) on fresh entry so each check-in
  // starts with a clean slate. Back-from-insight/breathing keeps their pick.
  if(typeof _arrivalShowStep1 === 'function') _arrivalShowStep1();
  setTimeout(() => go('s-splash','s-arrival'), 400);
});

// Safety-net heal: re-run at splash mount too, not just at boot. If the user
// reloads while the tab was backgrounded and heal-at-boot missed an edge, this
// catches it. Also strips the `.logged` class if it's there without truth.
(function(){
  if(!_reallyLoggedToday()){
    _forceClearTodayMarkers();
  }
})();

// dev helpers removed for production

// ═══ SCREEN 2: ARRIVAL ═════════════════════════════
// Step 1 (category cards) → Step 2 (one group's emotions). Progressive
// disclosure keeps the check-in conversational rather than survey-like.
function _arrivalShowStep1(){
  var cats = document.getElementById('arrivalCats');
  if(cats) cats.hidden = false;
  var back = document.getElementById('arrivalBack');
  if(back){ back.hidden = false; back.dataset.arrivalStep = '1'; }
  document.querySelectorAll('#emotions .emo-group').forEach(function(g){ g.hidden = true; });
  // hide the arrive footer on step 1 (category select) — it only belongs on step 2
  var footer = document.querySelector('.arrive-footer');
  if(footer) footer.style.display = 'none';
}
function _arrivalShowStep2(groupName){
  var cats = document.getElementById('arrivalCats');
  if(cats) cats.hidden = true;
  var back = document.getElementById('arrivalBack');
  if(back){ back.hidden = false; back.dataset.arrivalStep = '2'; }
  document.querySelectorAll('#emotions .emo-group').forEach(function(g){
    g.hidden = g.getAttribute('data-group') !== groupName;
  });
  // restore the arrive footer for the emotion-pick step
  var footer = document.querySelector('.arrive-footer');
  if(footer) footer.style.display = '';
}
document.querySelectorAll('.arrival-cat').forEach(function(btn){
  btn.addEventListener('click', function(){
    _arrivalShowStep2(btn.getAttribute('data-group'));
  });
});
document.getElementById('arrivalBack').addEventListener('click', function(){
  if(this.dataset.arrivalStep === '1'){
    go('s-arrival','s-splash');
    $('s-splash').classList.remove('dimmed');
    return;
  }
  _arrivalShowStep1();
  // Deselect any emotion; retract the intent / arrive UI until a new one is picked.
  emo = null;
  document.querySelectorAll('.chip').forEach(function(x){ x.classList.remove('sel'); });
  var intentSec = document.getElementById('intentSec');
  if(intentSec) intentSec.classList.remove('vis');
  var arriveBtn = document.getElementById('arriveBtn');
  if(arriveBtn) arriveBtn.classList.remove('ready');
  var hintEl = document.getElementById('arrivalHint');
  if(hintEl) hintEl.classList.remove('vis');
});

$('emotions').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if(!c) return;
  document.querySelectorAll('.chip').forEach(x=>x.classList.remove('sel'));
  c.classList.add('sel');
  emo = c.dataset.c;
  $('intentSec').classList.add('vis');
  $('whisper').classList.remove('vis');
  $('arriveBtn').classList.add('ready');
  updateArrivalHint();
  var _bl = document.getElementById('breathingLabel');
  if(_bl) _bl.textContent = emo + ' \u00B7 breathe with me';
});
document.querySelectorAll('.intent-pill').forEach(p=>p.addEventListener('click',()=>{
  document.querySelectorAll('.intent-pill').forEach(x=>x.classList.remove('sel'));
  p.classList.add('sel'); intent=p.dataset.i; updateArrivalHint();
}));
$('skipIntent').addEventListener('click',()=>{
  intent=null;document.querySelectorAll('.intent-pill').forEach(x=>x.classList.remove('sel'));updateArrivalHint();
});
function updateArrivalHint(){
  const el=$('arrivalHint');
  if(!emo){el.classList.remove('vis');return}
  const k=intent?`${emo}|${intent}`:null;
  const newText=(isBirthday&&BIRTHDAY_HINTS[emo])||(k&&ARRIVAL_HINTS[k])||ARRIVAL_FALLBACK[emo]||'';
  if(!newText){el.classList.remove('vis');return}
  // fade out → swap → fade in
  el.style.opacity='0';
  setTimeout(()=>{
    el.textContent=newText;
    el.classList.add('vis');
    el.style.opacity='';
  },200);
}
var _openAppCache = null; // cached /open-app response for current session
var _openAppFetch = null; // in-flight promise — used to late-bind AI data if fetch is slow

// ── offline indicator ─────────────────────────────────────────────
var _offlineBannerTimer = null;
function _showOfflineBanner(){ /* banner intentionally removed — fail quietly */ }
$('arriveBtn').addEventListener('click',()=>{
  if(!emo){
    $('arrivalInner').classList.remove('shake');void $('arrivalInner').offsetWidth;
    $('arrivalInner').classList.add('shake');$('whisper').classList.add('vis');return;
  }
  // immediate feedback — dim button
  $('arriveBtn').style.opacity='0.4';
  $('arriveBtn').style.pointerEvents='none';

  // ── AI prefetch ──
  // Fire /reflection NOW instead of waiting for the insight screen to mount.
  // Foundry typically takes 1–3s; starting the request here means the
  // response is often back by the time runInsightSequence runs, so AI
  // shows up first with minimal visible delay.
  var _userName = '';
  try{ _userName = (JSON.parse(localStorage.getItem('gc_user')||'{}').name)||''; }catch(e){}
  window._reflectionPrefetch = fetch(API_BASE + '/reflection', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({mood: emo, intention: intent||'', name: _userName})
  }).then(function(r){ return r.json(); })
    .then(function(data){ return (data && data.success && data.insight) ? data.insight : null; })
    .catch(function(){ return null; });

  setTimeout(()=>{
    // restore button for next time
    $('arriveBtn').style.opacity='';
    $('arriveBtn').style.pointerEvents='';
    // kick off /open-app for ALL emotions — the prompt goes to the journal
    // screen, and memories/exercise get used for breathing + memory flows.
    // Prefetching here (not in setupJournal) means the prompt is usually
    // back by the time the user finishes the insight screen.
    _openAppCache = null;
    _openAppFetch = null;
    var userId = localStorage.getItem('gc_user_id') || 'demo-user';
    _openAppFetch = fetch(API_BASE + '/open-app', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({user_id:userId, mood:emo, intention:intent||'', hours_absent:0})
    }).then(function(r){ return r.json(); }).then(function(data){ _openAppCache = data; _openAppFetch = null; }).catch(function(){ _openAppFetch = null; _showOfflineBanner(); });
    if(BREATHING_EMOTIONS.has(emo)){
      go('s-arrival','s-breathing');
      startBreathingExercise();
      return;
    }
    go('s-arrival','s-insight');
    runInsightSequence();
  },150);
});

// ═══ SCREEN 2b: BREATHING EXERCISE ════════════════

var _breathingRAF = null;
var _breathingRunning = false;

function startBreathingExercise(){
  if(_breathingRAF) cancelAnimationFrame(_breathingRAF);
  _breathingRunning = true;

  var canvas = document.getElementById('breathingCanvas');
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio||1, 2);
  canvas.width = 220 * dpr;
  canvas.height = 220 * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  var cx = 110, cy = 110;
  var minR = 40, maxR = 90;
  var currentR = minR;

  // 4-7-8 pattern in seconds
  var PHASES = [
    { name: 'inhale',  duration: 4, targetR: maxR },
    { name: 'hold',    duration: 7, targetR: maxR },
    { name: 'exhale',  duration: 8, targetR: minR },
  ];

  var phaseIndex = 0;
  var phaseElapsed = 0;
  var cyclesDone = 0;
  var MAX_CYCLES = 1;
  var lastTime = null;

  function updateLabels(phase){
    var instrEl = document.getElementById('breathingInstruction');
    var countEl = document.getElementById('breathingCount');
    if(instrEl){
      instrEl.style.opacity = '0';
      setTimeout(function(){
        instrEl.textContent = phase.name;
        instrEl.style.opacity = '1';
      }, 200);
    }
    if(countEl) countEl.textContent = phase.duration;
  }

  function drawFrame(timestamp){
    if(!_breathingRunning) return;
    if(!lastTime) lastTime = timestamp;
    var dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    var phase = PHASES[phaseIndex];
    phaseElapsed += dt;

    var remaining = Math.max(1, Math.ceil(phase.duration - phaseElapsed));
    var countEl = document.getElementById('breathingCount');
    if(countEl && parseInt(countEl.textContent) !== remaining){
      countEl.textContent = remaining;
    }

    var progress = Math.min(phaseElapsed / phase.duration, 1);
    var eased = progress < 0.5
      ? 2*progress*progress
      : -1+(4-2*progress)*progress;

    if(phase.name === 'inhale'){
      currentR = minR + (maxR - minR) * eased;
    } else if(phase.name === 'hold'){
      currentR = maxR;
    } else {
      currentR = maxR - (maxR - minR) * eased;
    }

    ctx.clearRect(0, 0, 220, 220);

    // Outer ghost ring
    ctx.beginPath();
    ctx.arc(cx, cy, maxR + 8, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(201,148,58,0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glow
    var grd = ctx.createRadialGradient(cx,cy,0,cx,cy,currentR*1.4);
    grd.addColorStop(0, 'rgba(201,148,58,0.12)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, currentR*1.4, 0, Math.PI*2);
    ctx.fill();

    // Main circle
    ctx.beginPath();
    ctx.arc(cx, cy, currentR, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(201,148,58,0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Center spark
    var sg = ctx.createRadialGradient(cx,cy,0,cx,cy,6);
    sg.addColorStop(0, 'rgba(255,255,255,0.9)');
    sg.addColorStop(0.4, 'rgba(230,182,88,0.7)');
    sg.addColorStop(1, 'rgba(201,148,58,0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI*2);
    ctx.fill();

    if(phaseElapsed >= phase.duration){
      phaseElapsed = 0;
      phaseIndex = (phaseIndex + 1) % PHASES.length;
      if(phaseIndex === 0){
        cyclesDone++;
        if(cyclesDone >= MAX_CYCLES){
          setTimeout(function(){ finishBreathing(); }, 800);
          return;
        }
      }
      updateLabels(PHASES[phaseIndex]);
    }

    _breathingRAF = requestAnimationFrame(drawFrame);
  }

  var labelEl = document.getElementById('breathingLabel');
  if(labelEl) labelEl.textContent = emo + ' \u00B7 breathe with me';

  // ── Preparation countdown ───────────────────────────────────────
  // Give the user a beat to settle before the 4-7-8 cycle begins.
  // Shows "settle in" then a gentle 3-2-1, with the min-radius circle
  // already drawn so the canvas isn't empty during prep.
  var instrEl = document.getElementById('breathingInstruction');
  var countEl = document.getElementById('breathingCount');

  // Draw the initial small circle so canvas has presence during prep
  (function drawPrepCircle(){
    ctx.clearRect(0, 0, 220, 220);
    ctx.beginPath();
    ctx.arc(cx, cy, maxR + 8, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(201,148,58,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, minR, 0, Math.PI*2);
    var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, minR);
    grd.addColorStop(0, 'rgba(230,182,88,0.22)');
    grd.addColorStop(1, 'rgba(201,148,58,0.04)');
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.strokeStyle = 'rgba(201,148,58,0.35)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  })();

  var prepSteps = [
    { text: 'settle in', count: '' },
    { text: 'begin in', count: '3' },
    { text: 'begin in', count: '2' },
    { text: 'begin in', count: '1' }
  ];
  var prepIdx = 0;
  function prepTick(){
    if(!_breathingRunning) return;
    if(prepIdx >= prepSteps.length){
      // Prep done — hand off to the real breathing loop
      updateLabels(PHASES[0]);
      lastTime = null;
      _breathingRAF = requestAnimationFrame(drawFrame);
      return;
    }
    var s = prepSteps[prepIdx];
    if(instrEl){
      instrEl.style.opacity = '0';
      setTimeout(function(){
        if(!_breathingRunning) return;
        instrEl.textContent = s.text;
        instrEl.style.opacity = '1';
      }, 180);
    }
    if(countEl) countEl.textContent = s.count;
    prepIdx++;
    setTimeout(prepTick, 1000);
  }
  prepTick();

  // surface Mindfulness Agent response if available — poll briefly then give up
  var guideEl = document.getElementById('breathingAiGuide');
  if(guideEl) guideEl.classList.remove('vis');
  (function pollGuide(attempts){
    if(!_breathingRunning) return;
    if(_openAppCache && _openAppCache.exercise){
      if(guideEl){
        // show first sentence only — keep it subtle
        var firstLine = _openAppCache.exercise.split(/\n|\.(?=\s)/)[0].replace(/^\d+\.\s*/,'').trim();
        guideEl.textContent = firstLine;
        guideEl.classList.add('vis');
      }
    } else if(attempts > 0){
      setTimeout(function(){ pollGuide(attempts - 1); }, 600);
    }
  })(10); // poll up to 6 seconds

  document.getElementById('breathingSkip')
    .addEventListener('click', finishBreathing, { once: true });

  document.getElementById('breathingBack')
    .addEventListener('click', function(){
      _breathingRunning = false;
      if(_breathingRAF){ cancelAnimationFrame(_breathingRAF); _breathingRAF = null; }
      go('s-breathing', 's-arrival');
    }, { once: true });
}

function finishBreathing(){
  _breathingRunning = false;
  if(_breathingRAF){ cancelAnimationFrame(_breathingRAF); _breathingRAF = null; }
  go('s-breathing', 's-insight');
  runInsightSequence();
}

function showInsightMemory(currentEmo){
  var memEl = $('insightMemory');
  var labelEl = $('memoryLabel');
  var quoteEl = $('memoryQuote');

  // reset
  memEl.classList.remove('vis');
  labelEl.textContent = '';
  quoteEl.textContent = '';

  // look up past entries with matching emotion
  var allEntries = [];
  try{ allEntries = JSON.parse(localStorage.getItem('gc_entries')||'[]'); }catch(e){}
  var matches = allEntries.filter(function(e){ return e.emo === currentEmo; });
  if(matches.length === 0) return;

  if(LIGHT_EMOTIONS.has(currentEmo)){
    // random past entry — label + truncated quote
    var pick = matches[Math.floor(Math.random() * matches.length)];
    var rawLabel = MEMORY_LIGHT_LABELS[Math.floor(Math.random() * MEMORY_LIGHT_LABELS.length)];
    labelEl.textContent = rawLabel.replace('{emo}', currentEmo);
    var snippet = pick.text.length > 120 ? pick.text.slice(0, 117) + '\u2026' : pick.text;
    quoteEl.textContent = '\u201C' + snippet + '\u201D';
  } else {
    // heavy / middle — render as a quoted whisper, same card shape as light
    var recent = matches[matches.length - 1];
    var phrase = MEMORY_HEAVY_PHRASES[Math.floor(Math.random() * MEMORY_HEAVY_PHRASES.length)];
    var localNudge = phrase + ' \u2014 day ' + recent.day + '. the chain held, and so did you.';
    labelEl.textContent = 'a note from before';
    function _setQuote(msg){ quoteEl.textContent = msg; }
    if(_openAppCache && _openAppCache.memories && _openAppCache.memories.message){
      _setQuote(_openAppCache.memories.message);
    } else if(_openAppFetch){
      _setQuote(localNudge);
      _openAppFetch.then(function(){
        if(_openAppCache && _openAppCache.memories && _openAppCache.memories.message){
          _setQuote(_openAppCache.memories.message);
        }
      });
    } else {
      _setQuote(localNudge);
    }
  }

  requestAnimationFrame(function(){
    memEl.classList.add('vis');
  });
}

// ═══ SCREEN 3: INSIGHT SEQUENCE ════════════════════
function runInsightSequence(){
  // clear stale content before the screen becomes visible
  $('insightText').textContent = '';
  $('insightWord').textContent = '';
  $('birthdayLine').textContent = '';
  $('birthdayLine').style.opacity = '0';
  ['insightRule1','bridgeRule','insightText','bridgeQ'].forEach(id=>$(id).classList.remove('vis'));
  $('beginFooter').classList.remove('vis');
  $('insightMemory').classList.remove('vis');
  $('memoryLabel').textContent = '';
  $('memoryQuote').textContent = '';
  $('loadingDots').classList.remove('hide');
  var _pib = $('postInsightBtn');
  _pib.disabled = false; _pib.style.opacity = ''; _pib.style.transition = '';
  if(_pib.lastChild) _pib.lastChild.textContent = 'carry it forward';

  const e = EMO[emo];
  // set emotion visuals
  $('insightEmoji').className = 'insight-emoji emo-' + emo;
  $('insightEmoji').innerHTML = '<img src="' + emoIconPath(emo) + '" alt="' + emo + '" style="width:84px;height:84px;object-fit:contain;filter:drop-shadow(0 4px 14px rgba(201,148,58,0.35))">';
  $('insightEmoji').style.setProperty('--emo-shadow', e.shadow);
  $('insightWord').textContent = emo;
  var bgBase=getComputedStyle(document.body).getPropertyValue('--bg').trim()||'#f5ede0';
  var isMorning=document.body.classList.contains('theme-morning');
  var emoBg=e.bg;
  // boost opacity on morning theme so the gradient is visible on cream
  if(isMorning) emoBg=emoBg.replace(/,\s*[\d.]+\)$/,',0.15)');
  $('s-insight').style.background = `radial-gradient(ellipse 60% 40% at 50% 35%,${emoBg},transparent 70%),${bgBase}`;
  // reset all
  ['insightRule1','bridgeRule'].forEach(id=>$(id).classList.remove('vis'));
  ['insightText','bridgeQ'].forEach(id=>$(id).classList.remove('vis'));
  $('beginFooter').classList.remove('vis');
  $('insightMemory').classList.remove('vis');
  $('memoryLabel').textContent = '';
  $('memoryQuote').textContent = '';
  $('loadingDots').classList.remove('hide');
  $('insightText').textContent='';
  $('birthdayLine').style.opacity='0';
  $('birthdayLine').textContent='';

  // ── AI-first reveal with prefetch ──
  // The arrive button starts the /reflection fetch immediately (see
  // window._reflectionPrefetch in the arriveBtn click handler). By the time
  // this sequence runs, the AI response may already be back — in which case
  // we reveal it the moment the opening rule settles.
  //
  // EARLIEST_REVEAL_MS is now tiny (400ms) — just long enough for the
  // decorative rule above to fade in. No more artificial 1400ms pause.
  // MAX_WAIT_MS stays generous (6000ms) because Foundry occasionally spikes.
  var _reflectionReqId = (window._reflectionReqId||0) + 1;
  window._reflectionReqId = _reflectionReqId;

  var EARLIEST_REVEAL_MS = 400;
  var MAX_WAIT_MS        = 6000;

  var _revealed = false;
  var _aiResult = null;
  var _startTs  = Date.now();

  function _revealInsightText(text){
    if(_revealed) return;
    if(_reflectionReqId !== window._reflectionReqId) return;
    _revealed = true;
    $('loadingDots').classList.add('hide');
    var txtEl = $('insightText');
    txtEl.textContent = text;
    txtEl.classList.add('vis');
    // cascade relative to reveal
    setTimeout(function(){ showInsightMemory(emo); }, 800);
    setTimeout(function(){ $('bridgeRule').classList.add('vis'); }, 1400);
    setTimeout(function(){ $('bridgeQ').classList.add('vis'); }, 2200);
    if(isBirthday && birthYear > 0){
      setTimeout(function(){
        var age = new Date().getFullYear() - birthYear;
        $('birthdayLine').textContent = 'today the chain marks ' + age + ' years of you.';
        $('birthdayLine').style.opacity = '0.7';
      }, 3000);
      setTimeout(function(){ $('beginFooter').classList.add('vis'); }, 3800);
    } else {
      setTimeout(function(){ $('beginFooter').classList.add('vis'); }, 3000);
    }
  }

  function _tryReveal(){
    if(_revealed) return;
    var elapsed = Date.now() - _startTs;
    if(_aiResult && elapsed >= EARLIEST_REVEAL_MS){
      _revealInsightText(_aiResult);
    }
  }

  // Consume the prefetch kicked off from the arrive button. If no prefetch
  // exists (edge case: navigated to insight without clicking arrive), fall
  // back to firing the request here.
  (function(){
    var prefetch = window._reflectionPrefetch;
    window._reflectionPrefetch = null;
    if(!prefetch){
      var _userName = '';
      try{ _userName = (JSON.parse(localStorage.getItem('gc_user')||'{}').name)||''; }catch(e){}
      prefetch = fetch(API_BASE + '/reflection', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({mood: emo, intention: intent||'', name: _userName})
      }).then(function(r){ return r.json(); })
        .then(function(data){ return (data && data.success && data.insight) ? data.insight : null; })
        .catch(function(){ return null; });
    }
    prefetch.then(function(insight){
      if(_reflectionReqId !== window._reflectionReqId) return;
      if(!insight) return;
      _aiResult = insight;
      window._reflectionResult = insight;
      _tryReveal();
    });
  })();

  // opening ornamental rule
  setTimeout(function(){ $('insightRule1').classList.add('vis'); }, 300);

  // earliest-reveal checkpoint — if AI already landed, reveal now
  setTimeout(_tryReveal, EARLIEST_REVEAL_MS + 20);

  // hard fallback to hardcoded
  setTimeout(function(){
    if(_revealed) return;
    if(_reflectionReqId !== window._reflectionReqId) return;
    _revealInsightText(INSIGHTS[emo]);
  }, MAX_WAIT_MS);
}
// skip on tap
$('s-insight').addEventListener('click', e => {
  if(e.target.closest('.insight-back')||e.target.closest('.begin-btn')) return;
  $('beginFooter').classList.add('vis');
});
$('insightBack').addEventListener('click',()=>go('s-insight','s-arrival'));
$('beginBtn').addEventListener('click',()=>{
  go('s-insight','s-journal');
  setupJournal();
});

// ═══ SCREEN 4: JOURNAL ═════════════════════════════
function setupJournal(){
  const e = EMO[emo];
  $('promptCard').style.background = e.bg;
  $('promptText').textContent = PROMPTS[emo];
  $('journalArea').placeholder = PLACEHOLDERS[emo];
  $('journalArea').value = '';
  $('journalCount').textContent = '0 / 500';
  $('s-journal').style.background = `var(--bg)`;
  setTimeout(()=>$('journalArea').focus(), 600);

  // ── Live AI prompt ──
  // Use cached /open-app response if arrival already fetched it; otherwise fire a fresh one.
  // Hardcoded PROMPTS[emo] already on screen; swap in AI with a gentle crossfade.
  var _promptReqId = (window._promptReqId||0) + 1;
  window._promptReqId = _promptReqId;

  function _swapPrompt(newText){
    if(_promptReqId !== window._promptReqId) return;
    if(!newText) return;
    var el = $('promptText');
    // don't swap if user has already started typing
    if($('journalArea').value.trim().length > 0) return;
    el.style.transition = 'opacity 500ms ease';
    el.style.opacity = '0';
    setTimeout(function(){
      if(_promptReqId !== window._promptReqId) return;
      el.textContent = newText;
      el.style.opacity = '1';
    }, 520);
  }

  if(_openAppCache && _openAppCache.prompt){
    _swapPrompt(_openAppCache.prompt);
  } else if(_openAppFetch){
    _openAppFetch.then(function(){
      if(_openAppCache && _openAppCache.prompt) _swapPrompt(_openAppCache.prompt);
    });
  } else {
    var userId = localStorage.getItem('gc_user_id') || 'demo-user';
    fetch(API_BASE + '/open-app', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({user_id:userId, mood:emo, intention:intent||'', hours_absent:0})
    }).then(function(r){ return r.json(); })
      .then(function(data){
        _openAppCache = data;
        if(data && data.prompt) _swapPrompt(data.prompt);
      })
      .catch(function(){ /* fail quietly */ });
  }
}
$('journalArea').addEventListener('input',()=>{
  var len=$('journalArea').value.length;
  var el = $('journalCount');
  el.textContent = `${len} / 500`;
  el.classList.toggle('vis', len > 0);
  el.classList.toggle('near-limit', len >= 400 && len < 500);
  el.classList.toggle('at-limit', len >= 500);
});
$('journalBack').addEventListener('click',()=>{
  const text = $('journalArea').value.trim();
  if(!text){
    $('journalArea').value='';
    $('journalCount').textContent='0 / 500';$('journalCount').classList.remove('vis');
    go('s-journal','s-insight');
    return;
  }
  $('leaveSheet').classList.add('open');
});
$('leaveConfirm').addEventListener('click',()=>{
  $('leaveSheet').classList.remove('open');
  $('journalArea').value='';
  $('journalCount').textContent='0 / 500';$('journalCount').classList.remove('vis');
  // if user triggered leave from a nav tab, route to that target instead of arrival
  if(window._pendingNavTarget){
    var target=window._pendingNavTarget;
    window._pendingNavTarget=null;
    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});
    $(target).classList.add('active');
    setNavTheme(target);
    setActiveTab(target);
    if(target==='s-splash') $('s-splash').classList.remove('dimmed');
  } else {
    go('s-journal','s-insight');
  }
});
$('leaveStay').addEventListener('click',()=>{
  window._pendingNavTarget=null;
  $('leaveSheet').classList.remove('open');
  setTimeout(()=>$('journalArea').focus(),300);
});
$('leaveSheet').addEventListener('click',(e)=>{
  if(e.target===$('leaveSheet')){
    window._pendingNavTarget=null;
    $('leaveSheet').classList.remove('open');
  }
});
// ═══ POST-SUBMIT INSIGHTS (per emotion) ═════════════
const POST_AI = {
  calm:'You held the stillness today. That takes more strength than you think.',
  tender:'Something softened in you. That\u2019s not weakness \u2014 it\u2019s the whole point.',
  grateful:'You named what matters. Now it\u2019s real.',
  hard:'You showed up on a hard day. The chain remembers.',
  heavy:'You carried the weight and still wrote. That\u2019s everything.',
  overwhelmed:'One word was enough. You did more than that.',
  alive:'You poured the fire into something. It\u2019s held now.',
  numb:'You arrived numb and still left something. The chain felt it.',
  hopeful:'You named your hope. Now it exists outside of you. That matters.',
  light:'You noticed the lightness. That\u2019s the whole practice.',
  quiet:'Quiet days deserve noticing too. You gave yours that.',
  foggy:'You found something in the fog. The chain grew.',
  restless:'You gave your restlessness a direction. That\u2019s enough for today.',
  searching:'You named the search. Sometimes that\u2019s the whole answer.',
  sad:'You showed up sad and still wrote. The chain remembers.',
  frustrated:'You turned frustration into honesty. The chain felt it.',
  anxious:'You found the one safe thing. That was everything.',
  heartbroken:'You arrived broken and still found something true. That\u2019s the whole practice.',
  disappointed:'You named the hope. Even disappointed hopes deserve to be spoken.',
  exhausted:'You wrote through the exhaustion. The chain holds that.',
  moved:'You let something touch you. That\u2019s rare. The chain keeps it.',
};

// dayNum and hasLogged are declared at the top of the script
const DARK_SCREENS = ['s-splash','s-arrival','s-breathing','s-post-insight'];

