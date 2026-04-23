// ═══ STATE ══════════════════════════════════════════
let emo = null, intent = null;
const $ = id => document.getElementById(id);

// Backend API base. Localhost dev → http://localhost:8766 (uvicorn). Production → Azure.
// localStorage override removed — it was a phishing-sink waiting to happen.
// To swap dev ports, edit the hardcoded port here.
const API_BASE = (function(){
  try{
    if(location.hostname === 'localhost' || location.hostname === '127.0.0.1'){
      return 'http://localhost:8766';
    }
  }catch(e){}
  return 'https://arrive.azurewebsites.net';
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


// ═══ HEAL: stale current-month "ceremony seen" flag ═══
// If a user fired the month-end ceremony via the demo panel (or an earlier
// buggy code path) while the month is still in progress, the
// gc_ceremony_seen_YYYY-MM flag gets set. That flag then tricks the Portrait
// into rendering the month as a FULLY-FORMED pendant even though the month
// hasn't ended yet — April showing "becoming" + "you kept leaning..." on
// April 22 is the bug this heal removes.
//
// Rule: if the flag is for the CURRENT calendar month AND today is not the
// last day of that month, clear the flag. The ceremony will re-fire when
// the real month-end arrives.
(function healCurrentMonthCeremonyFlag(){
  try{
    var now = new Date();
    var pad = function(n){ return String(n).padStart(2,'0'); };
    var ym  = now.getFullYear() + '-' + pad(now.getMonth()+1);
    var lastDayOfMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    var isLastDay = now.getDate() === lastDayOfMonth;
    if(isLastDay) return; // flag could be legitimate today
    localStorage.removeItem('gc_ceremony_seen_' + ym);
    localStorage.removeItem('gc_portrait_seen_' + ym);
  }catch(e){}
})();


// ═══ CLOUD SYNC FLAG ═══════════════════════════════════
// Cloud-backed by default (hackathon requirement — Azure Cosmos DB is
// an active part of the stack). Entries, photos, voice, and AI
// reflections are persisted to Cosmos so the user's chain survives
// device loss and the Memory agent has semantic recall data.
//
// The privacy contract is still explicit:
//   • Every record is scoped to gc_user_id (no cross-user reads)
//   • Azure Cosmos encrypts at rest and in transit
//   • Crisis disclosures (abuse / self-harm / suicide) are NEVER saved
//     (enforced server-side by agents/safety.py short-circuit)
//   • User can delete any time via the demo panel's nuclear reset
//
// Flip GC_OFFLINE_FIRST to true to disable all cloud writes and run the
// app purely on localStorage (e.g. if judges want to see the offline
// fallback story, or for future privacy-mode toggle in settings).
var GC_OFFLINE_FIRST = false;
window.GC_OFFLINE_FIRST = GC_OFFLINE_FIRST;


// ═══ AI PREFETCH HELPERS ═════════════════════════════
// Called from the submit handler (real users) or the demo panel when we
// know a ceremony is about to fire. Fires the AI request now so by the
// time the ceremony actually opens (3.2s later for real submits), the
// response is in hand instead of making the user wait through a slow
// Foundry roundtrip AFTER the ceremony animation starts.

function prefetchMonthlyReflection(){
  try{
    var now = new Date();
    var ym = now.toISOString().slice(0,7);
    var entries = JSON.parse(localStorage.getItem('gc_entries')||'[]');
    var monthEntries = entries.filter(function(e){
      var d = (e.dateISO || e.date || e.timestamp || '').slice(0,7);
      return d === ym;
    });
    if(monthEntries.length === 0) return;
    var counts = {};
    monthEntries.forEach(function(e){
      if(e.emo) counts[e.emo] = (counts[e.emo]||0) + 1;
    });
    var topEmos = Object.keys(counts).sort(function(a,b){ return counts[b]-counts[a]; });
    var dominant = topEmos[0] || 'calm';
    var monthName = now.toLocaleDateString('en-US',{month:'long'}).toLowerCase();
    var monthWord = (typeof PORTRAIT_WORDS !== 'undefined' && PORTRAIT_WORDS[dominant]) || dominant;
    // personalize the paragraph
    var _userName = '';
    try { _userName = (JSON.parse(localStorage.getItem('gc_user')||'{}').name || '').trim(); } catch(e){}
    window._monthlyReflectionPrefetch = fetch(API_BASE + '/monthly-reflection', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        month_name: monthName,
        mornings: monthEntries.length,
        dominant: dominant,
        month_word: monthWord,
        top_emotions: topEmos.slice(0,4),
        name: _userName
      })
    }).then(function(r){ return r.json(); })
      .then(function(data){ return (data && data.success && data.reflection) ? data.reflection : null; })
      .catch(function(){ return null; });
  }catch(e){ window._monthlyReflectionPrefetch = null; }
}

function prefetchYearlyInsights(){
  try{
    var entries = JSON.parse(localStorage.getItem('gc_entries')||'[]');
    if(entries.length < 30) return; // not enough data to call — ceremony will use defaults
    var counts = {};
    var longest = '', longestLen = 0;
    entries.forEach(function(e){
      if(e.emo) counts[e.emo] = (counts[e.emo]||0) + 1;
      var t = (e.text || '').length;
      if(t > longestLen){ longestLen = t; longest = (e.text||'').slice(0,120); }
    });
    var topEmos = Object.keys(counts).sort(function(a,b){ return counts[b]-counts[a]; });
    var dominant = topEmos[0] || 'calm';
    // Find fullest month
    var monthCounts = {};
    entries.forEach(function(e){
      var ym = (e.dateISO || e.date || e.timestamp || '').slice(0,7);
      if(ym) monthCounts[ym] = (monthCounts[ym]||0) + 1;
    });
    var fullestYm = Object.keys(monthCounts).sort(function(a,b){ return monthCounts[b]-monthCounts[a]; })[0] || '';
    var fullestMonth = '';
    if(fullestYm){
      var fm = fullestYm.split('-');
      if(fm.length === 2){
        fullestMonth = new Date(parseInt(fm[0]), parseInt(fm[1])-1, 1)
          .toLocaleDateString('en-US',{month:'long'}).toLowerCase();
      }
    }
    var yearWord = (typeof PORTRAIT_WORDS !== 'undefined' && PORTRAIT_WORDS[dominant]) || dominant;
    var _userName = '';
    try { _userName = (JSON.parse(localStorage.getItem('gc_user')||'{}').name || '').trim(); } catch(e){}
    // OFFLINE-FIRST: never transmit entry text, even as an excerpt. The
    // yearly-insights prompt can still produce a warm paragraph from just
    // counts + dominant emotion + fullest month + name.
    var _excerpt = window.GC_OFFLINE_FIRST ? '' : longest;
    window._yearlyInsightsPrefetch = fetch(API_BASE + '/yearly-insights', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        total_mornings: entries.length,
        dominant_emotion: dominant,
        year_word: yearWord,
        fullest_month: fullestMonth,
        top_emotions: topEmos.slice(0,4),
        longest_entry_excerpt: _excerpt,
        name: _userName
      })
    }).then(function(r){ return r.json(); })
      .catch(function(){ return null; });
  }catch(e){ window._yearlyInsightsPrefetch = null; }
}

