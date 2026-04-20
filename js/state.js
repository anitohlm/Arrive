// ═══ STATE ══════════════════════════════════════════
let emo = null, intent = null;
const $ = id => document.getElementById(id);

// Backend API base. Localhost dev → http://localhost:8766 (uvicorn). Production → same-origin.
// localStorage override removed — it was a phishing-sink waiting to happen.
// To swap dev ports, edit the hardcoded port here.
const API_BASE = (function(){
  try{
    if(location.hostname === 'localhost' || location.hostname === '127.0.0.1'){
      return 'http://localhost:8766';
    }
  }catch(e){}
  return '';
})();

// First-boot identity. Every browser gets its own random ID so backend state
// (memories, streaks, Cosmos entries) cannot commingle across installs.
(function(){
  if(localStorage.getItem('gc_user_id')) return;
  var id;
  try { id = crypto.randomUUID(); } catch(e){
    id = 'u-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,10);
  }
  localStorage.setItem('gc_user_id', id);
})();

// ── Self-heal stale "logged today" markers. ─────────────────────────────
// The splash checks two signals to decide whether today is already logged:
//   1. gc_logged_today === new Date().toDateString()   (string compare)
//   2. gc_logged_dates includes today's ISO            (array lookup)
// Demo seeds / test flows / abandoned drafts can leave these set even when no
// real entry exists for today. That blocks legitimate new entries the next day.
// Heal at boot: if either marker is present but there is no entry in gc_entries
// dated today, clear the phantom marker. Real entries are untouched.
(function healLoggedToday(){
  try{
    var today = new Date();
    var todayStr = today.toDateString();
    var pad = function(n){ return String(n).padStart(2,'0'); };
    var todayISO = today.getFullYear()+'-'+pad(today.getMonth()+1)+'-'+pad(today.getDate());

    var entries = JSON.parse(localStorage.getItem('gc_entries') || '[]');
    // Match on either `dateISO` (new entries) or `date` (older / seeded entries).
    // `date` may be a full timestamp or a plain YYYY-MM-DD — slice to 10 chars
    // to normalize. Anything that resolves to today's ISO counts as "real".
    var hasRealEntryToday = entries.some(function(e){
      if(e.dateISO && e.dateISO === todayISO) return true;
      if(e.date && String(e.date).slice(0,10) === todayISO) return true;
      return false;
    });
    if(hasRealEntryToday) return; // genuinely logged → keep state

    // (1) stale gc_logged_today — either wrong date OR set without a real entry
    var loggedToday = localStorage.getItem('gc_logged_today');
    if(loggedToday && (loggedToday !== todayStr || !hasRealEntryToday)){
      localStorage.removeItem('gc_logged_today');
    }

    // (2) phantom today's ISO in gc_logged_dates — remove it, keep the rest
    var loggedDates = JSON.parse(localStorage.getItem('gc_logged_dates') || '[]');
    if(loggedDates.indexOf(todayISO) >= 0){
      loggedDates = loggedDates.filter(function(d){ return d !== todayISO; });
      localStorage.setItem('gc_logged_dates', JSON.stringify(loggedDates));
    }
  }catch(e){ /* never block boot on healing logic */ }
})();

// ── Date-rollover guard ──────────────────────────────────────────────────
// If the user leaves the app open overnight, the module-level `hasLogged`
// in streak.js is set once at script load and never re-evaluates. Without
// this guard, opening the tab on a new day would still show yesterday's
// "logged" state until a hard refresh. Listen for visibility/focus events
// and force a reload the first time we notice the ISO date has changed —
// the boot-time healer then clears any stale flags naturally.
(function(){
  // LOCAL date (not UTC) so this triggers at local midnight, not UTC midnight.
  function _localISO(){
    var d = new Date(), p = function(n){ return String(n).padStart(2,'0'); };
    return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());
  }
  var bootISO = _localISO();
  function maybeReload(){
    try{
      var nowISO = _localISO();
      if(nowISO !== bootISO){
        // date rolled over while the tab was open → reload so heal + streak
        // recompute against the new day
        location.reload();
      }
    }catch(e){}
  }
  document.addEventListener('visibilitychange', function(){
    if(!document.hidden) maybeReload();
  });
  window.addEventListener('focus', maybeReload);
})();


// ═══ THEME ══════════════════════════════════════════
// Dark mode only — theme switching removed. Keep setTheme as a no-op
// so any leftover callers don't throw.
document.body.className = 'theme-dark';
localStorage.setItem('gc_theme', 'dark');
function setTheme(){ /* dark-only; no-op */ }

