// ═══ BOTTOM NAV ═════════════════════════════════════
var navShown = false;
function showNav(){
  if(navShown) return;
  navShown = true;
  document.body.classList.add('has-nav');
  $('bottomNav').classList.add('show');
}

function setNavTheme(screenId){
  const nav = $('bottomNav');
  if(DARK_SCREENS.includes(screenId)){
    nav.classList.add('dark'); nav.classList.remove('light');
  } else {
    nav.classList.remove('dark'); nav.classList.add('light');
  }
}

function setActiveTab(screenId){
  document.querySelectorAll('.nav-tab').forEach(t=>{
    // chain tab covers splash/arrival/post; others map 1:1
    const owns = t.dataset.screen;
    const isActive = owns===screenId ||
      (owns==='s-splash' && ['s-splash','s-arrival','s-breathing','s-insight','s-journal','s-post-insight'].includes(screenId));
    t.classList.toggle('active', isActive);
  });
}

document.querySelectorAll('.nav-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    const target = tab.dataset.screen;
    // guard: if mid-journal with unsaved content, show the leave sheet
    const onJournal = $('s-journal').classList.contains('active');
    const text = $('journalArea').value.trim();
    if(onJournal && text){
      window._pendingNavTarget = target;
      $('leaveSheet').classList.add('open');
      return;
    }
    // hide all screens, show target — pause knot rotation when leaving portrait
    if(target !== 's-portrait'){
      stopKnotRotation();
      if(typeof stopPortraitLoadingAnim === 'function') stopPortraitLoadingAnim();
    }
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    $(target).classList.add('active');
    setNavTheme(target);
    setActiveTab(target);
    // if returning to chain, reset splash state
    if(target==='s-splash') $('s-splash').classList.remove('dimmed');
    // re-populate portrait on nav so first-view weave plays AND rotation resumes
    if(target==='s-portrait' && window.__portraitReady) populatePortrait();
    // reset held to "held" tab + refresh content when visiting
    if(target==='s-held'){
      try{
        if(typeof setHeldTab === 'function') setHeldTab('today');
        if(typeof populateHeld === 'function') populateHeld();
      }catch(e){}
    }
    if(target==='s-unfold'){
      try{
        if(typeof renderUnfold === 'function') renderUnfold();
      }catch(e){}
    }
  });
});

// patch go() to also update nav + toggle body.in-journal flag
const _go = go;
const JOURNAL_SCREENS = ['s-arrival','s-breathing','s-insight','s-journal','s-post-insight'];
go = function(from, to){
  _go(from, to);
  if(hasLogged){ setNavTheme(to); setActiveTab(to); }
  if(JOURNAL_SCREENS.includes(to)) document.body.classList.add('in-journal');
  else document.body.classList.remove('in-journal');
};

// ═══ SETTINGS SCREEN ═══════════════════════════════
(function(){
  // mark body as having a user whenever gc_user exists (shows settings btn)
  function syncHasUser(){
    if(localStorage.getItem('gc_user')) document.body.classList.add('has-user');
    else document.body.classList.remove('has-user');
  }
  syncHasUser();

  // ── populate settings fields from localStorage ──
  function populateSettings(){
    var u = {};
    try{ u = JSON.parse(localStorage.getItem('gc_user')||'{}'); }catch(e){}
    $('settingsNameValue').textContent = u.name || '—';
    // birthday — prefer "MM-DD" canonical; accept legacy "YYYY-MM-DD"
    var bdTxt = '—';
    if(u.birthday){
      var _bp = u.birthday.split('-');
      var _m, _d;
      if(_bp.length >= 3){ _m = parseInt(_bp[1],10); _d = parseInt(_bp[2],10); }
      else             { _m = parseInt(_bp[0],10); _d = parseInt(_bp[1],10); }
      var _months = ['','jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
      if(_m >= 1 && _m <= 12 && _d >= 1 && _d <= 31){
        bdTxt = _months[_m] + ' ' + _d + (u.birthYear ? ', ' + u.birthYear : '');
      }
    }
    $('settingsBirthdayValue').textContent = bdTxt;
    // no real email yet — show provider placeholder
    var emailTxt = '—';
    if(u.provider==='google') emailTxt = 'google account';
    else if(u.provider==='apple') emailTxt = 'apple id';
    $('settingsEmailValue').textContent = emailTxt;

    // chain stats
    var startDate = localStorage.getItem('gc_start_date') || '';
    if(startDate){
      try{
        var d = new Date(startDate+'T12:00:00');
        var months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
        $('settingsStartDate').textContent = months[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear();
      }catch(e){ $('settingsStartDate').textContent = startDate; }
    } else {
      $('settingsStartDate').textContent = 'not started';
    }
    var graceObj = {};
    try{ graceObj = JSON.parse(localStorage.getItem('gc_grace')||'{}'); }catch(e){}
    // gc_grace stores {month, remaining}; "used" = 1 - remaining for current month, else 0 (fresh month)
    var _gcMonth = new Date().toISOString().slice(0,7);
    var _gcRemaining = (graceObj.month === _gcMonth && typeof graceObj.remaining === 'number') ? graceObj.remaining : 1;
    $('settingsGraceUsed').textContent = (1 - _gcRemaining) + ' / 1';
    var entries = [];
    try{ entries = JSON.parse(localStorage.getItem('gc_entries')||'[]'); }catch(e){}
    $('settingsTotalEntries').textContent = String(entries.length);

    // notifications state
    var notifOn = localStorage.getItem('gc_notif_enabled')==='true';
    $('settingsNotifToggle').classList.toggle('on', notifOn);
    $('settingsNotifTimeRow').classList.toggle('hidden', !notifOn);
    $('settingsNotifTime').value = localStorage.getItem('gc_notif_time') || '08:00';
    var graceNudge = localStorage.getItem('gc_grace_nudge')!=='false'; // default on
    $('settingsGraceToggle').classList.toggle('on', graceNudge);

  }

  // ── open / close ──
  function openSettings(){
    populateSettings();
    $('s-settings').classList.add('open');
  }
  function closeSettings(){
    $('s-settings').classList.remove('open');
  }
  $('settingsBtn').addEventListener('click', openSettings);
  $('settingsBack').addEventListener('click', closeSettings);

  // ── notifications ──
  $('settingsNotifToggle').addEventListener('click', function(){
    var on = this.classList.toggle('on');
    localStorage.setItem('gc_notif_enabled', on ? 'true' : 'false');
    $('settingsNotifTimeRow').classList.toggle('hidden', !on);
  });
  $('settingsNotifTime').addEventListener('change', function(){
    localStorage.setItem('gc_notif_time', this.value || '08:00');
  });
  $('settingsGraceToggle').addEventListener('click', function(){
    var on = this.classList.toggle('on');
    localStorage.setItem('gc_grace_nudge', on ? 'true' : 'false');
  });

  // ── edit name sheet ──
  $('settingsNameRow').addEventListener('click', function(){
    var u = {};
    try{ u = JSON.parse(localStorage.getItem('gc_user')||'{}'); }catch(e){}
    $('editNameInput').value = u.name || '';
    $('editNameSheet').classList.add('open');
    setTimeout(function(){ $('editNameInput').focus(); }, 200);
  });
  $('editNameCancel').addEventListener('click', function(){
    $('editNameSheet').classList.remove('open');
  });
  $('editNameSave').addEventListener('click', function(){
    var newName = $('editNameInput').value.trim();
    if(!newName){ $('editNameInput').focus(); return; }
    var u = {};
    try{ u = JSON.parse(localStorage.getItem('gc_user')||'{}'); }catch(e){}
    u.name = newName;
    localStorage.setItem('gc_user', JSON.stringify(u));
    $('settingsNameValue').textContent = newName;
    $('editNameSheet').classList.remove('open');
  });
  $('editNameSheet').addEventListener('click', function(e){
    if(e.target===this) this.classList.remove('open');
  });

  // (birthday is set at sign-up and not editable after — no handler needed)

  // ── export entries ──
  $('settingsExportBtn').addEventListener('click', function(){
    var entries = localStorage.getItem('gc_entries') || '[]';
    var blob = new Blob([entries], {type:'application/json'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'gratitudechain-entries.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  });

  // ── clear all data ──
  $('settingsClearBtn').addEventListener('click', function(){
    $('clearDataSheet').classList.add('open');
  });
  $('clearDataCancel').addEventListener('click', function(){
    $('clearDataSheet').classList.remove('open');
  });
  $('clearDataSheet').addEventListener('click', function(e){
    if(e.target===this) this.classList.remove('open');
  });
  $('clearDataConfirm').addEventListener('click', function(){
    // wipe all gc_* keys
    var keys = [];
    for(var i=0;i<localStorage.length;i++){
      var k = localStorage.key(i);
      if(k && k.indexOf('gc_')===0) keys.push(k);
    }
    keys.forEach(function(k){ localStorage.removeItem(k); });
    $('clearDataSheet').classList.remove('open');
    location.reload();
  });

  // ── sign out ──
  $('settingsSignOutBtn').addEventListener('click', function(){
    $('signOutSheet').classList.add('open');
  });
  $('signOutCancel').addEventListener('click', function(){
    $('signOutSheet').classList.remove('open');
  });
  $('signOutSheet').addEventListener('click', function(e){
    if(e.target===this) this.classList.remove('open');
  });
  $('signOutConfirm').addEventListener('click', function(){
    var keysToRemove = [];
    for(var i = 0; i < localStorage.length; i++){
      if(localStorage.key(i).startsWith('gc_')) keysToRemove.push(localStorage.key(i));
    }
    keysToRemove.forEach(function(k){ localStorage.removeItem(k); });
    $('signOutSheet').classList.remove('open');
    location.reload();
  });
})();

