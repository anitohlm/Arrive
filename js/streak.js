// ═══ CALENDAR-BASED STREAK TRACKING ═══════════════
// gc_start_date: ISO date string of user's first day (e.g. "2026-04-10")
// gc_logged_dates: JSON array of ISO date strings for each logged day
// gc_day: total calendar days since start (kept for backward compat)
var gcStartDate = localStorage.getItem('gc_start_date') || '';
var gcLoggedDates = JSON.parse(localStorage.getItem('gc_logged_dates') || '[]');
var gcLoggedSet = new Set(gcLoggedDates);

// Use LOCAL date, not UTC. `.toISOString()` returns UTC, which is a day
// behind for users east of UTC during the early-morning hours — that caused
// today's entry to collide with "today ISO" lookups and locked the splash
// in "logged" state. Build the ISO string from local year/month/day instead.
function todayISO(){
  var d = new Date();
  var p = function(n){ return String(n).padStart(2,'0'); };
  return d.getFullYear() + '-' + p(d.getMonth()+1) + '-' + p(d.getDate());
}
function daysBetween(a,b){
  // anchor both dates at noon local time to avoid midnight floating-point drift
  var da = new Date(a + 'T12:00:00');
  var db = new Date(b + 'T12:00:00');
  return Math.round((db - da) / (1000*60*60*24));
}
function getDayNumber(dateStr){
  if(!gcStartDate) return 1;
  return daysBetween(gcStartDate, dateStr) + 1;
}

// compute dayNum from calendar
let dayNum;
if(gcStartDate){
  dayNum = getDayNumber(todayISO());
  if(dayNum<1) dayNum=1;
} else {
  dayNum = parseInt(localStorage.getItem('gc_day') || '0', 10);
  if(dayNum===0){ dayNum=1; localStorage.setItem('gc_day','1'); }
}
let hasLogged = gcLoggedSet.has(todayISO()) || localStorage.getItem('gc_logged_today') === new Date().toDateString();

// ═══ BIRTHDAY DETECTION ═══════════════════════════
// `gc_user.birthday` is stored as "MM-DD" (month+day only). Optional
// `gc_user.birthYear` supplies the year for age calculation; otherwise we
// stay silent about age rather than printing a wrong number.
var isBirthday = false;
var birthYear = 0;
(function(){
  try {
    var u = JSON.parse(localStorage.getItem('gc_user')||'{}');
    if(u.birthday){
      var parts = u.birthday.split('-');
      var bMonth, bDay;
      if(parts.length >= 3){
        // legacy "YYYY-MM-DD"
        birthYear = parseInt(parts[0],10) || 0;
        bMonth = parseInt(parts[1],10);
        bDay   = parseInt(parts[2],10);
      } else {
        // canonical "MM-DD"
        bMonth = parseInt(parts[0],10);
        bDay   = parseInt(parts[1],10);
      }
      if(u.birthYear) birthYear = parseInt(u.birthYear,10) || birthYear;
      var now = new Date();
      isBirthday = (now.getMonth()+1 === bMonth && now.getDate() === bDay);
    }
  } catch(e){}
})();
var gcBirthdayKnots = JSON.parse(localStorage.getItem('gc_birthday_knots')||'[]');
var gcBirthdayKnotsSet = new Set(gcBirthdayKnots);

// helper: check if a day number was logged
function isDayLogged(d){
  if(!gcStartDate) return d < dayNum; // fallback: assume all past days logged
  var date = new Date(gcStartDate);
  date.setDate(date.getDate() + d - 1);
  return gcLoggedSet.has(date.toISOString().slice(0,10));
}

// ═══ GRACE DAY SYSTEM (1 per month) ═════════════════
var gcGrace = JSON.parse(localStorage.getItem('gc_grace')||'{"month":"","remaining":1}');
var gcGraceDeclined = JSON.parse(localStorage.getItem('gc_grace_declined')||'[]');
var gcGraceDeclinedSet = new Set(gcGraceDeclined);
(function(){
  // reset grace day at the start of each month — also clear declined list
  var currentMonth = new Date().toISOString().slice(0,7); // "2026-04"
  if(gcGrace.month !== currentMonth){
    gcGrace = {month:currentMonth, remaining:1};
    localStorage.setItem('gc_grace', JSON.stringify(gcGrace));
    // fresh month — clear declined so users get a new chance
    gcGraceDeclined = [];
    gcGraceDeclinedSet = new Set();
    localStorage.setItem('gc_grace_declined', '[]');
  }
})();

// find the most recent missed day that the user hasn't already declined
function findUndeclinedMissedDay(){
  if(!gcStartDate) return null;
  var today = todayISO();
  var totalDays = getDayNumber(today);
  for(var i=totalDays-1;i>=1;i--){
    if(!isDayLogged(i)&&!gcGraceDeclinedSet.has(i)) return i;
  }
  return null;
}

function getMissedDateISO(dayNumber){
  var date = new Date(gcStartDate);
  date.setDate(date.getDate() + dayNumber - 1);
  return date.toISOString().slice(0,10);
}

function showGracePrompt(missedDay){
  var overlay = document.createElement('div');
  overlay.className = 'grace-overlay';
  var missedDate = getMissedDateISO(missedDay);
  var dateDisplay = new Date(missedDate).toLocaleDateString('en-US',{month:'short',day:'numeric'});
  // fallback message
  var fallbackMsg = 'You weren\u2019t here on '+dateDisplay+' \u2014 and that\u2019s okay. Some days are harder than others. You came back, and that\u2019s what matters. If you\u2019d like, you can use a Grace Day to gently close that gap.';
  overlay.innerHTML =
    '<div class="grace-card">'+
    '<svg class="grace-icon" width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#c9943a" stroke-width="1.5" stroke-dasharray="8 4" opacity=".4"/><circle cx="24" cy="24" r="4" fill="#c9943a" opacity=".6"/><circle cx="24" cy="24" r="8" stroke="#e6b658" stroke-width="0.8" opacity=".3"/></svg>'+
    '<div class="grace-title">life happened</div>'+
    '<div class="grace-sub" id="graceMsg">'+fallbackMsg+'</div>'+
    '<div class="grace-count">'+gcGrace.remaining+' grace day remaining this month</div>'+
    '<div class="grace-buttons">'+
    '<button class="grace-btn grace-btn-skip" id="graceSkip">it\u2019s okay, leave it</button>'+
    '<button class="grace-btn grace-btn-use" id="graceUse">close the gap \u2661</button>'+
    '</div></div>';
  document.body.appendChild(overlay);
  requestAnimationFrame(function(){ overlay.classList.add('open'); });
  // fetch AI grace message (non-blocking — replaces fallback when ready)
  var lastEmo = '';
  var entries = JSON.parse(localStorage.getItem('gc_entries')||'[]');
  if(entries.length>0) lastEmo = entries[entries.length-1].emo||'';
  var daysAway = getDayNumber(todayISO()) - missedDay;
  fetch(API_BASE + '/grace-message',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({days_missed:1, streak_before:missedDay-1, last_emotion:lastEmo, days_away:daysAway})
  }).then(function(r){return r.json()}).then(function(data){
    if(data.success && data.message){
      var el = document.getElementById('graceMsg');
      if(!el) return;
      el.style.transition = 'opacity 400ms ease';
      el.style.opacity = '0';
      setTimeout(function(){
        if(!el.parentNode) return; // overlay already dismissed
        el.textContent = data.message;
        el.style.opacity = '1';
      }, 420);
    }
  }).catch(function(){ _showOfflineBanner(); });

  overlay.querySelector('#graceUse').addEventListener('click',function(){
    // fill the missed day
    var dateStr = getMissedDateISO(missedDay);
    if(!gcLoggedSet.has(dateStr)){
      gcLoggedDates.push(dateStr);
      gcLoggedSet.add(dateStr);
      localStorage.setItem('gc_logged_dates', JSON.stringify(gcLoggedDates));
    }
    // remove from declined if present (no longer needed)
    if(gcGraceDeclinedSet.has(missedDay)){
      gcGraceDeclinedSet.delete(missedDay);
      gcGraceDeclined=gcGraceDeclined.filter(function(d){return d!==missedDay});
      localStorage.setItem('gc_grace_declined',JSON.stringify(gcGraceDeclined));
    }
    gcGrace.remaining = Math.max(0, gcGrace.remaining - 1);
    localStorage.setItem('gc_grace', JSON.stringify(gcGrace));
    overlay.classList.remove('open');
    setTimeout(function(){ overlay.remove(); },400);
  });

  overlay.querySelector('#graceSkip').addEventListener('click',function(){
    // record this specific missed day as declined — never prompt for it again
    if(!gcGraceDeclinedSet.has(missedDay)){
      gcGraceDeclined.push(missedDay);
      gcGraceDeclinedSet.add(missedDay);
      localStorage.setItem('gc_grace_declined',JSON.stringify(gcGraceDeclined));
    }
    overlay.classList.remove('open');
    setTimeout(function(){ overlay.remove(); },400);
  });
}

// check on load: if there's an undeclined missed day and grace is available
(function(){
  if(!gcStartDate || !hasLogged) return;
  if(gcGrace.remaining <= 0) return;
  var missed = findUndeclinedMissedDay();
  if(missed){
    // show prompt after a short delay so the chain loads first
    setTimeout(function(){ showGracePrompt(missed); }, 1500);
  }
})();

