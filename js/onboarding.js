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

