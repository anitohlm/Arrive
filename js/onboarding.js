// ═══ SIGN IN → PROFILE → ONBOARDING ════════════════
(function(){
  var user = localStorage.getItem('gc_user');
  if(user) return; // already signed in

  var si = $('s-signin');
  var pf = $('s-profile');
  var authProvider = '';

  // Step 1: show OAuth sign-in
  si.style.display = '';

  function goToProfile(provider){
    authProvider = provider;
    // fade out sign-in, show profile
    si.classList.add('fade');
    setTimeout(function(){
      si.style.display='none';
      pf.style.display='';
    }, 800);
  }

  // Google sign-in (placeholder — wire up real OAuth later)
  $('signinGoogle').addEventListener('click', function(){
    // TODO: replace with real Google OAuth flow
    goToProfile('google');
  });

  // Apple sign-in (placeholder — wire up real Apple OAuth later)
  $('signinApple').addEventListener('click', function(){
    // TODO: replace with real Apple OAuth flow
    goToProfile('apple');
  });

  // Step 2: profile form — name + birthday
  var nameInput = $('profileName');
  var bdayInput = $('profileBday');
  var submitBtn = $('profileSubmit');

  function checkReady(){
    if(nameInput.value.trim().length>0) submitBtn.classList.add('ready');
    else submitBtn.classList.remove('ready');
  }
  nameInput.addEventListener('input', checkReady);

  // ── Custom calendar picker — matches the app's dark/gold aesthetic ──
  (function initBdayCalendar(){
    var field    = document.getElementById('profileBdayField');
    var btn      = document.getElementById('profileBdayBtn');
    var txt      = document.getElementById('profileBdayText');
    var cal      = document.getElementById('profileBdayCal');
    var grid     = document.getElementById('profileBdayGrid');
    var monthLbl = document.getElementById('profileBdayMonthLabel');
    var yearLbl  = document.getElementById('profileBdayYearLabel');
    var prevBtn  = document.getElementById('profileBdayPrev');
    var nextBtn  = document.getElementById('profileBdayNext');
    var title    = cal && cal.querySelector('.gc-cal-title');
    var footer   = cal && cal.querySelector('.gc-cal-footer');
    var jumpBtn  = document.getElementById('profileBdayJump');
    if(!field || !cal) return;
    window.__bdayCalReady = true;

    var MONTHS_LONG = ['january','february','march','april','may','june','july','august','september','october','november','december'];

    var today    = new Date();
    var viewYear = today.getFullYear();
    var viewMon  = today.getMonth();
    var selDate  = null; // Date object of the currently selected day, or null

    function pad(n){ return String(n).padStart(2,'0'); }
    function iso(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
    function fmt(d){
      return MONTHS_LONG[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }
    function isSameDay(a,b){
      return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
    }

    function renderGrid(){
      monthLbl.textContent = MONTHS_LONG[viewMon];
      yearLbl.textContent  = String(viewYear);
      grid.innerHTML = '';
      grid.style.display = 'grid';

      var first    = new Date(viewYear, viewMon, 1);
      var startDay = first.getDay();                     // 0 = Sun
      var daysIn   = new Date(viewYear, viewMon+1, 0).getDate();
      var prevLast = new Date(viewYear, viewMon, 0).getDate();

      // leading days from previous month (muted)
      for(var i=startDay-1;i>=0;i--){
        var cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'gc-cal-day other-month';
        cell.textContent = String(prevLast - i);
        grid.appendChild(cell);
      }
      // current month
      for(var d=1; d<=daysIn; d++){
        var cell2 = document.createElement('button');
        cell2.type = 'button';
        cell2.className = 'gc-cal-day';
        cell2.textContent = String(d);
        var cellDate = new Date(viewYear, viewMon, d);
        if(cellDate > today) cell2.classList.add('future');
        if(isSameDay(cellDate, today)) cell2.classList.add('today');
        if(isSameDay(cellDate, selDate)) cell2.classList.add('selected');
        (function(cd){
          cell2.addEventListener('click', function(){ pick(cd); });
        })(cellDate);
        grid.appendChild(cell2);
      }
      // trailing days to fill the grid (6 rows × 7 cols = 42)
      var total = startDay + daysIn;
      var trailing = (7 - (total % 7)) % 7;
      for(var j=1; j<=trailing; j++){
        var cell3 = document.createElement('button');
        cell3.type = 'button';
        cell3.className = 'gc-cal-day other-month';
        cell3.textContent = String(j);
        grid.appendChild(cell3);
      }
    }

    function renderYearGrid(){
      monthLbl.textContent = 'pick a year';
      yearLbl.textContent  = String(viewYear);
      grid.innerHTML = '';
      grid.className = 'gc-cal-year-grid';
      grid.style.display = 'grid';

      var nowYear = today.getFullYear();
      // range: 120 years back to current year
      for(var y = nowYear; y >= nowYear - 120; y--){
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'gc-cal-year-btn';
        b.textContent = String(y);
        if(y === viewYear) b.classList.add('selected');
        (function(yy){
          b.addEventListener('click', function(){
            viewYear = yy;
            grid.className = 'gc-cal-grid';
            renderGrid();
          });
        })(y);
        grid.appendChild(b);
      }
      // scroll to current selection
      requestAnimationFrame(function(){
        var sel = grid.querySelector('.gc-cal-year-btn.selected');
        if(sel) sel.scrollIntoView({block:'center'});
      });
    }

    function pick(d){
      selDate = d;
      bdayInput.value = iso(d);
      txt.textContent = fmt(d);
      txt.classList.remove('placeholder');
      close();
    }

    function open(){
      cal.hidden = false;
      btn.classList.add('open');
      // re-render in case selDate or view changed
      grid.className = 'gc-cal-grid';
      renderGrid();
    }
    function close(){
      cal.hidden = true;
      btn.classList.remove('open');
    }

    btn.addEventListener('click', function(e){
      e.stopPropagation();
      if(cal.hidden) open(); else close();
    });
    prevBtn.addEventListener('click', function(e){
      e.stopPropagation();
      if(grid.className === 'gc-cal-year-grid') return;
      viewMon--;
      if(viewMon < 0){ viewMon = 11; viewYear--; }
      renderGrid();
    });
    nextBtn.addEventListener('click', function(e){
      e.stopPropagation();
      if(grid.className === 'gc-cal-year-grid') return;
      viewMon++;
      if(viewMon > 11){ viewMon = 0; viewYear++; }
      renderGrid();
    });
    title.addEventListener('click', function(e){
      e.stopPropagation();
      if(grid.className === 'gc-cal-year-grid') renderGrid();
      else renderYearGrid();
    });
    jumpBtn.addEventListener('click', function(e){
      e.stopPropagation();
      if(grid.className === 'gc-cal-year-grid') renderGrid();
      else renderYearGrid();
    });
    cal.addEventListener('click', function(e){ e.stopPropagation(); });
    document.addEventListener('click', function(){ if(!cal.hidden) close(); });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && !cal.hidden) close();
    });
  })();

  submitBtn.addEventListener('click', function(){
    var name = nameInput.value.trim();
    if(!name){ nameInput.focus(); return; }
    // save user
    var userData = {name:name, birthday:bdayInput.value||'', provider:authProvider, created:new Date().toISOString()};
    localStorage.setItem('gc_user', JSON.stringify(userData));
    document.body.classList.add('has-user');
    // fade out profile, show onboard
    pf.classList.add('fade');
    setTimeout(function(){
      pf.style.display='none';
      runOnboard();
    }, 800);
  });

  // Step 3: onboard animation
  function runOnboard(){
    localStorage.setItem('gc_onboard_seen','1');
    var ob = $('s-onboard');
    ob.style.display = '';
    setTimeout(function(){ $('ob1').classList.add('vis'); }, 300);
    setTimeout(function(){ $('ob2').classList.add('vis'); }, 1000);
    setTimeout(function(){ $('ob3').classList.add('vis'); }, 1700);
    setTimeout(function(){ $('ob4').classList.add('vis'); }, 2400);
    setTimeout(function(){ ob.classList.add('fade'); }, 4500);
    setTimeout(function(){ ob.style.display='none'; }, 5300);
  }
})();

