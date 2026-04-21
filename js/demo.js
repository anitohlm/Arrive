// ═══ DEMO / HACKATHON CONTROL PANEL ═════════════════════════════
// Floating button + panel for fast-forwarding time and seeding test data
// during the judges' demo. Production stripped: see `if (DEMO_ENABLED)` —
// flip that flag to false before shipping.
//
// What it does (no console pasting needed):
//   • Seed N days of journey (7 / 14 / 30 / 100)
//   • Jump to a specific day number (simulates being deeper in the streak)
//   • Trigger ceremonies: month-end, birthday, year-end
//   • Fast-forward ONE day (yesterday's state → today fresh)
//   • Reset everything
//
// Implementation notes:
//   • Time travel is done by backdating `gc_start_date` and backfilling
//     `gc_logged_dates` + `gc_entries`. The app then naturally renders
//     "morning N" and the full chain as if the user had been journaling
//     for N days.
//   • Fast-forward uses the same mechanism — shifting both start date AND
//     all logged dates back by one day so "today" becomes "yesterday" in
//     the data, which means today is free to log again.

(function(){
  var DEMO_ENABLED = true; // ← flip to false for production

  if(!DEMO_ENABLED) return;

  // ── data helpers ───────────────────────────────────────────────
  function pad(n){ return String(n).padStart(2,'0'); }
  function _localISO(d){
    d = d || new Date();
    return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate());
  }
  function _addDays(iso, n){
    var parts = iso.split('-').map(Number);
    var d = new Date(parts[0], parts[1]-1, parts[2]);
    d.setDate(d.getDate() + n);
    return _localISO(d);
  }

  // Emotion palette for varied seed data. Mix from all categories.
  var DEMO_EMOTIONS = [
    'grateful','calm','hopeful','tender','passionate','alive','content',
    'quiet','foggy','restless','searching','yearning',
    'hard','heavy','sad','anxious','exhausted','frustrated'
  ];
  var DEMO_INTENTS = ['clarity','peace','gratitude','courage'];
  var DEMO_ENTRIES = [
    'the morning was quiet. the kettle. the cat. that was enough.',
    'a hard meeting. i stayed in it. did not run.',
    'my mom called. we talked about nothing. it was everything.',
    'the jasmine on the walk home. i almost missed it.',
    'something opened today. i am not naming it yet.',
    'tired. showed up anyway. that counts.',
    'bought flowers for no reason. that is the reason.',
    'sat with the discomfort. did not try to fix it.',
    'the afternoon sun on the floor. held it for a second.',
    'said the hard thing. it did not break anything.',
    'walked without headphones. the city had its own music.',
    'burned the rice. laughed about it. twice.',
    'read one page before bed. one page counts.',
    'the cold water on my face in the morning. thank you.',
    'watched him sleep. felt lucky for plain things.',
    'the meeting went long. i got through. that is enough today.',
    'made the call i was avoiding. shaking after. still did it.',
    'a stranger held the door. i almost cried. small things lately.',
    'fed the plants. talked to them a little. they do not mind.',
    'the smell of bread from the bakery. walked past slower.'
  ];
  function _rand(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

  // ── main actions ───────────────────────────────────────────────
  function seedJourney(days){
    if(!confirm('seed ' + days + ' days of demo journey? this will overwrite existing entries.')) return;
    var today = _localISO();
    var startISO = _addDays(today, -(days - 1));
    localStorage.setItem('gc_start_date', startISO);
    localStorage.setItem('gc_day', String(days));
    localStorage.setItem('gc_onboard_seen', '1');

    var entries = [];
    var loggedDates = [];
    for(var i = 0; i < days - 1; i++){ // leave today unlogged so user can still write
      var dISO = _addDays(startISO, i);
      var emoPick = _rand(DEMO_EMOTIONS);
      entries.push({
        day: i + 1,
        emo: emoPick,
        intent: _rand(DEMO_INTENTS),
        text: _rand(DEMO_ENTRIES),
        dateISO: dISO,
        date: dISO,
        timestamp: dISO + 'T09:30:00.000Z',
        ai: ''
      });
      loggedDates.push(dISO);
    }
    localStorage.setItem('gc_entries', JSON.stringify(entries));
    localStorage.setItem('gc_logged_dates', JSON.stringify(loggedDates));
    localStorage.removeItem('gc_logged_today');
    _toast('seeded ' + days + ' days. reloading…');
    setTimeout(function(){ location.reload(); }, 700);
  }

  function jumpToDay(n){
    n = parseInt(n, 10);
    if(!n || n < 1 || n > 3650){ _toast('enter 1–3650'); return; }
    seedJourney(n);
  }

  function fastForwardOneDay(){
    // Shift everything back by 1 day so "today" becomes a fresh unlogged day.
    // Start date moves back by 1, logged dates all shift back by 1, entries
    // get their dates decremented. Net effect: day N+1 is available to log.
    var startISO = localStorage.getItem('gc_start_date');
    if(!startISO){ _toast('no journey started yet — seed first'); return; }
    localStorage.setItem('gc_start_date', _addDays(startISO, -1));
    var logged = JSON.parse(localStorage.getItem('gc_logged_dates')||'[]');
    logged = logged.map(function(d){ return _addDays(d, -1); });
    localStorage.setItem('gc_logged_dates', JSON.stringify(logged));
    var entries = JSON.parse(localStorage.getItem('gc_entries')||'[]');
    entries = entries.map(function(e){
      if(e.dateISO) e.dateISO = _addDays(e.dateISO, -1);
      if(e.date)    e.date    = _addDays(String(e.date).slice(0,10), -1);
      if(e.timestamp) e.timestamp = _addDays(String(e.timestamp).slice(0,10), -1) + 'T09:30:00.000Z';
      return e;
    });
    localStorage.setItem('gc_entries', JSON.stringify(entries));
    localStorage.removeItem('gc_logged_today');
    _toast('fast-forwarded one day. reloading…');
    setTimeout(function(){ location.reload(); }, 500);
  }

  function triggerMonthEndCeremony(){
    // Fire the ceremony DIRECTLY, independent of any other trigger. Clear
    // the "seen" guard so it plays, then invoke the function.
    var ym = new Date().toISOString().slice(0,7);
    localStorage.removeItem('gc_ceremony_seen_' + ym);
    localStorage.removeItem('gc_portrait_seen_' + ym);
    if(typeof showMonthEndCeremony === 'function'){
      showMonthEndCeremony();
      _toast('month-end ceremony firing');
    } else {
      _toast('ceremony fn not loaded yet — try after portrait view');
    }
  }

  function triggerBirthdayCeremony(){
    // Set birthday to today (so data is consistent) then fire the ceremony
    // function directly — no reload, no waiting for splash to re-boot.
    var u = JSON.parse(localStorage.getItem('gc_user')||'{}');
    var today = new Date();
    u.birthday = pad(today.getMonth()+1) + '-' + pad(today.getDate());
    if(!u.birthYear) u.birthYear = today.getFullYear() - 25;
    if(!u.name) u.name = 'demo';
    localStorage.setItem('gc_user', JSON.stringify(u));
    if(typeof runBirthdayCeremony === 'function'){
      runBirthdayCeremony(function(){});
      _toast('birthday ceremony firing');
    } else {
      _toast('ceremony fn not loaded yet');
    }
  }

  function triggerYearEndCeremony(){
    // Fire the annual ceremony directly without requiring 365 entries.
    // If the helper isn't available yet, fall back to seeding.
    if(typeof _showAnnualCeremony === 'function'){
      // ensure there's SOME data so the ceremony has something to display
      var entries = JSON.parse(localStorage.getItem('gc_entries')||'[]');
      if(entries.length < 30){
        _toast('needs a seeded journey first — click 100 days');
        return;
      }
      _showAnnualCeremony();
      _toast('year-end ceremony firing');
    } else {
      _toast('year ceremony fn not loaded');
    }
  }

  function triggerMilestone(day){
    // Fire a streak ceremony at a specific milestone day (7, 100, 200, 250, 300).
    // Uses the same runMilestone() that attachments.js calls when a real
    // submit crosses the milestone boundary.
    if(typeof runMilestone !== 'function'){
      _toast('milestone fn not loaded yet');
      return;
    }
    var splash = document.getElementById('s-splash');
    if(splash && !splash.classList.contains('active')){
      // runMilestone activates #s-milestone from current screen; ensure we
      // have a clean return path to splash.
      document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('active'); });
      splash.classList.add('active');
    }
    runMilestone(day, function(){
      document.getElementById('s-milestone').classList.remove('active');
      document.getElementById('s-splash').classList.add('active');
    });
    _toast('milestone ' + day + ' firing');
  }

  function triggerGraceDay(){
    // Simulate a missed yesterday + offer the grace message. Two paths:
    //   1. Strip yesterday out of gc_logged_dates so the app sees a gap.
    //   2. Fire the /grace-message endpoint result via the existing UI hook
    //      if one exists. Otherwise just reload so the splash re-detects the
    //      gap and the chain renders with a missed knot.
    var today = _localISO();
    var yesterday = _addDays(today, -1);
    var logged = JSON.parse(localStorage.getItem('gc_logged_dates')||'[]');
    var before = logged.length;
    logged = logged.filter(function(d){ return d !== yesterday; });
    localStorage.setItem('gc_logged_dates', JSON.stringify(logged));
    // also remove yesterday's entry so the chain shows a gap
    var entries = JSON.parse(localStorage.getItem('gc_entries')||'[]');
    entries = entries.filter(function(e){
      var d = (e.dateISO || e.date || '').slice(0,10);
      return d !== yesterday;
    });
    localStorage.setItem('gc_entries', JSON.stringify(entries));
    // reset grace-used flag for this month so grace is available
    var user = JSON.parse(localStorage.getItem('gc_user')||'{}');
    user.graceRemaining = 1;
    user.graceUsed = 0;
    user.graceMonth = new Date().toISOString().slice(0,7);
    localStorage.setItem('gc_user', JSON.stringify(user));
    if(before === logged.length){
      _toast('yesterday was not logged — seed first');
      return;
    }
    _toast('yesterday cleared — grace day available. reloading…');
    setTimeout(function(){ location.reload(); }, 600);
  }

  function resetAll(){
    if(!confirm('wipe ALL local data? this clears entries, streaks, user, links. cannot be undone locally.')) return;
    var keys = [];
    for(var i = 0; i < localStorage.length; i++){
      var k = localStorage.key(i);
      if(k && k.indexOf('gc_') === 0) keys.push(k);
    }
    keys.forEach(function(k){ localStorage.removeItem(k); });
    _toast('wiped. reloading…');
    setTimeout(function(){ location.reload(); }, 500);
  }

  function setMood(emo){
    // Shortcut — pre-select an emotion so the dev doesn't have to click through.
    // Stashes it in sessionStorage; the arrival screen can pick this up if we
    // wire it. For now we just note it and navigate to arrival.
    sessionStorage.setItem('_demoPreselect', emo);
    _toast('mood preselected: ' + emo);
  }

  // ── toast ──────────────────────────────────────────────────────
  function _toast(msg){
    var t = document.getElementById('_demoToast');
    if(!t){
      t = document.createElement('div');
      t.id = '_demoToast';
      t.style.cssText = 'position:fixed;bottom:140px;left:50%;transform:translateX(-50%);'
        + 'background:rgba(22,16,8,0.95);color:#c9943a;padding:10px 16px;border-radius:12px;'
        + 'font-family:"DM Mono",monospace;font-size:11px;letter-spacing:.04em;'
        + 'border:1px solid rgba(201,148,58,0.35);z-index:9999;pointer-events:none;'
        + 'box-shadow:0 8px 24px rgba(0,0,0,0.4);transition:opacity 250ms ease;opacity:0';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._timer);
    t._timer = setTimeout(function(){ t.style.opacity = '0'; }, 2400);
  }

  // ── panel UI ───────────────────────────────────────────────────
  function buildPanel(){
    // Floating trigger button
    var btn = document.createElement('button');
    btn.id = '_demoBtn';
    btn.setAttribute('aria-label', 'demo panel');
    btn.innerHTML = 'DEMO';
    btn.style.cssText = [
      'position:fixed',
      'top:max(14px,env(safe-area-inset-top))',
      'left:14px',
      'width:auto',
      'padding:6px 12px',
      'background:rgba(201,148,58,0.12)',
      'color:#c9943a',
      'border:1px solid rgba(201,148,58,0.45)',
      'border-radius:14px',
      'font-family:"DM Mono",monospace',
      'font-size:10px',
      'letter-spacing:0.18em',
      'cursor:pointer',
      'z-index:9998',
      'backdrop-filter:blur(6px)',
      '-webkit-backdrop-filter:blur(6px)',
      'transition:background 220ms ease, transform 180ms ease'
    ].join(';');
    btn.addEventListener('mouseenter', function(){ btn.style.background='rgba(201,148,58,0.22)'; });
    btn.addEventListener('mouseleave', function(){ btn.style.background='rgba(201,148,58,0.12)'; });

    // Panel
    var panel = document.createElement('div');
    panel.id = '_demoPanel';
    panel.style.cssText = [
      'position:fixed',
      'top:max(58px,calc(env(safe-area-inset-top) + 44px))',
      'left:14px',
      'width:min(320px, calc(100vw - 28px))',
      'max-height:calc(100vh - 120px)',
      'overflow-y:auto',
      'background:rgba(14,10,6,0.96)',
      'border:1px solid rgba(201,148,58,0.28)',
      'border-radius:16px',
      'padding:16px',
      'color:#f5ede0',
      'font-family:"DM Sans",sans-serif',
      'font-size:12px',
      'z-index:9997',
      'display:none',
      'backdrop-filter:blur(14px)',
      '-webkit-backdrop-filter:blur(14px)',
      'box-shadow:0 20px 60px rgba(0,0,0,0.6)',
    ].join(';');

    panel.innerHTML = ''
      + '<div style="font-family:\'Fraunces\',serif;font-style:italic;font-size:16px;color:#c9943a;margin-bottom:4px">demo controls</div>'
      + '<div style="font-family:\'DM Mono\',monospace;font-size:9px;letter-spacing:.14em;color:rgba(245,237,224,0.45);text-transform:uppercase;margin-bottom:14px">for hackathon demo only</div>'

      + '<div class="_demoSection">'
      +   '<div class="_demoLbl">seed a journey</div>'
      +   '<div class="_demoRow">'
      +     '<button class="_demoAct" data-act="seed-7">7 days</button>'
      +     '<button class="_demoAct" data-act="seed-14">14 days</button>'
      +     '<button class="_demoAct" data-act="seed-30">30 days</button>'
      +     '<button class="_demoAct" data-act="seed-100">100 days</button>'
      +   '</div>'
      + '</div>'

      + '<div class="_demoSection">'
      +   '<div class="_demoLbl">jump to specific day</div>'
      +   '<div class="_demoRow">'
      +     '<input id="_demoDayInput" type="number" min="1" max="3650" placeholder="day #" class="_demoInput">'
      +     '<button class="_demoAct" data-act="jump">jump</button>'
      +   '</div>'
      + '</div>'

      + '<div class="_demoSection">'
      +   '<div class="_demoLbl">fast-forward</div>'
      +   '<div class="_demoRow">'
      +     '<button class="_demoAct" data-act="ff-1">+1 day (free today)</button>'
      +   '</div>'
      + '</div>'

      + '<div class="_demoSection">'
      +   '<div class="_demoLbl">ceremonies</div>'
      +   '<div class="_demoRow">'
      +     '<button class="_demoAct" data-act="month-end">month-end</button>'
      +     '<button class="_demoAct" data-act="birthday">birthday</button>'
      +     '<button class="_demoAct" data-act="year-end">year-end</button>'
      +   '</div>'
      + '</div>'

      + '<div class="_demoSection">'
      +   '<div class="_demoLbl">streak milestones</div>'
      +   '<div class="_demoRow">'
      +     '<button class="_demoAct" data-act="ms-7">day 7</button>'
      +     '<button class="_demoAct" data-act="ms-100">day 100</button>'
      +     '<button class="_demoAct" data-act="ms-200">day 200</button>'
      +     '<button class="_demoAct" data-act="ms-250">day 250</button>'
      +     '<button class="_demoAct" data-act="ms-300">day 300</button>'
      +   '</div>'
      + '</div>'

      + '<div class="_demoSection">'
      +   '<div class="_demoLbl">grace</div>'
      +   '<div class="_demoRow">'
      +     '<button class="_demoAct" data-act="grace">simulate missed yesterday</button>'
      +   '</div>'
      + '</div>'

      + '<div class="_demoSection">'
      +   '<div class="_demoLbl">state inspector</div>'
      +   '<div id="_demoState" class="_demoState">…</div>'
      + '</div>'

      + '<div class="_demoSection" style="margin-top:8px">'
      +   '<button class="_demoAct _demoDanger" data-act="reset">reset everything</button>'
      + '</div>';

    // stylesheet for panel internals
    var style = document.createElement('style');
    style.textContent = ''
      + '#_demoPanel ._demoSection{margin-bottom:14px}'
      + '#_demoPanel ._demoLbl{font-family:"DM Mono",monospace;font-size:9px;letter-spacing:.14em;color:rgba(201,148,58,0.6);text-transform:uppercase;margin-bottom:6px}'
      + '#_demoPanel ._demoRow{display:flex;flex-wrap:wrap;gap:6px}'
      + '#_demoPanel ._demoAct{flex:1 1 auto;min-width:72px;padding:8px 10px;background:rgba(201,148,58,0.08);color:#e6b658;border:1px solid rgba(201,148,58,0.28);border-radius:10px;font-family:"DM Sans",sans-serif;font-size:11px;cursor:pointer;transition:background 160ms ease, transform 120ms ease}'
      + '#_demoPanel ._demoAct:hover{background:rgba(201,148,58,0.16)}'
      + '#_demoPanel ._demoAct:active{transform:scale(0.97)}'
      + '#_demoPanel ._demoAct._demoDanger{flex:1 1 100%;background:rgba(184,60,60,0.1);border-color:rgba(220,80,80,0.4);color:#e39494}'
      + '#_demoPanel ._demoAct._demoDanger:hover{background:rgba(184,60,60,0.2)}'
      + '#_demoPanel ._demoInput{flex:1;padding:8px 10px;background:rgba(201,148,58,0.04);color:#f5ede0;border:1px solid rgba(201,148,58,0.22);border-radius:10px;font-family:"DM Mono",monospace;font-size:11px;min-width:70px}'
      + '#_demoPanel ._demoInput:focus{outline:none;border-color:rgba(201,148,58,0.5)}'
      + '#_demoPanel ._demoState{font-family:"DM Mono",monospace;font-size:10px;line-height:1.6;color:rgba(245,237,224,0.6);background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;white-space:pre-wrap;word-break:break-all}';

    document.body.appendChild(style);
    document.body.appendChild(panel);
    document.body.appendChild(btn);

    // toggle panel
    btn.addEventListener('click', function(){
      var open = panel.style.display === 'block';
      panel.style.display = open ? 'none' : 'block';
      if(!open) refreshStateInspector();
    });

    // click dispatch
    panel.addEventListener('click', function(e){
      var act = e.target.closest('[data-act]');
      if(!act) return;
      var a = act.dataset.act;
      if(a === 'seed-7')   return seedJourney(7);
      if(a === 'seed-14')  return seedJourney(14);
      if(a === 'seed-30')  return seedJourney(30);
      if(a === 'seed-100') return seedJourney(100);
      if(a === 'jump')     return jumpToDay(document.getElementById('_demoDayInput').value);
      if(a === 'ff-1')     return fastForwardOneDay();
      if(a === 'month-end')return triggerMonthEndCeremony();
      if(a === 'birthday') return triggerBirthdayCeremony();
      if(a === 'year-end') return triggerYearEndCeremony();
      if(a === 'ms-7')     return triggerMilestone(7);
      if(a === 'ms-100')   return triggerMilestone(100);
      if(a === 'ms-200')   return triggerMilestone(200);
      if(a === 'ms-250')   return triggerMilestone(250);
      if(a === 'ms-300')   return triggerMilestone(300);
      if(a === 'grace')    return triggerGraceDay();
      if(a === 'reset')    return resetAll();
    });

    // enter key on input = jump
    panel.addEventListener('keydown', function(e){
      if(e.target.id === '_demoDayInput' && e.key === 'Enter'){
        e.preventDefault();
        jumpToDay(e.target.value);
      }
    });
  }

  function refreshStateInspector(){
    var el = document.getElementById('_demoState');
    if(!el) return;
    var entries = JSON.parse(localStorage.getItem('gc_entries')||'[]');
    var logged = JSON.parse(localStorage.getItem('gc_logged_dates')||'[]');
    var u = JSON.parse(localStorage.getItem('gc_user')||'{}');
    var today = _localISO();
    el.textContent = [
      'today:       ' + today,
      'start date:  ' + (localStorage.getItem('gc_start_date') || '(none)'),
      'day number:  ' + (localStorage.getItem('gc_day') || '(none)'),
      'entries:     ' + entries.length,
      'logged days: ' + logged.length,
      'logged today: ' + (logged.indexOf(today) >= 0 ? 'yes' : 'no'),
      'user:        ' + (u.name || '(none)') + (u.email ? '  <' + u.email + '>' : ''),
      'birthday:    ' + (u.birthday || '(none)'),
    ].join('\n');
  }

  // ── init ──────────────────────────────────────────────────────
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', buildPanel);
  } else {
    buildPanel();
  }
})();
