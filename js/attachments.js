// ═══ JOURNAL ATTACHMENTS (photo + voice) ═══════════
// Photos and voice memos are stored as base64 data URLs so they persist
// across sessions and can be shipped to Cosmos via /submit-entry.
// Photos are compressed to ~1000px max and JPEG 0.75 before encoding so
// the entry stays well under Cosmos's 2MB-per-document limit.
var journalAttachments = { photos: [], voice: null };

// ── Image compression helper ──
// Returns a Promise<{dataUrl, width, height, size}> for a resized JPEG.
function _compressImage(file, maxDim, quality){
  maxDim = maxDim || 1000;
  quality = typeof quality === 'number' ? quality : 0.75;
  return new Promise(function(resolve, reject){
    var reader = new FileReader();
    reader.onload = function(e){
      var img = new Image();
      img.onload = function(){
        var w = img.width, h = img.height;
        if(w > maxDim || h > maxDim){
          var ratio = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        var canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        var dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({ dataUrl: dataUrl, width: w, height: h, size: dataUrl.length });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Generic blob → data URL ──
function _blobToDataURL(blob){
  return new Promise(function(resolve, reject){
    var reader = new FileReader();
    reader.onload = function(e){ resolve(e.target.result); };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// photo upload
$('attachPhotoBtn').addEventListener('click', function(){
  $('photoInput').click();
});
$('photoInput').addEventListener('change', function(e){
  var files = Array.from(e.target.files || []);
  files.forEach(function(file){
    if(journalAttachments.photos.length >= 3) return; // max 3 photos
    _compressImage(file, 1000, 0.75).then(function(result){
      if(journalAttachments.photos.length >= 3) return;
      var entry = { dataUrl: result.dataUrl, width: result.width, height: result.height };
      journalAttachments.photos.push(entry);
      var idx = journalAttachments.photos.length - 1;
      var thumb = document.createElement('div');
      thumb.className = 'attach-thumb';
      thumb.innerHTML = '<img src="'+result.dataUrl+'"><button class="remove-attach">&times;</button>';
      thumb.querySelector('.remove-attach').addEventListener('click', (function(el){
        return function(){
          var i = journalAttachments.photos.indexOf(entry);
          if(i >= 0) journalAttachments.photos.splice(i,1);
          el.remove();
        };
      })(thumb));
      $('attachPreview').appendChild(thumb);
    }).catch(function(err){
      console.warn('photo compression failed', err);
    });
  });
  e.target.value = '';
});

// voice recording
var mediaRecorder = null;
var audioChunks = [];
// feature-detect MediaRecorder support up front
if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder){
  $('attachVoiceBtn').disabled = true;
  $('attachVoiceBtn').style.opacity = '.4';
  $('attachVoiceBtn').style.cursor = 'not-allowed';
  $('recTimer').textContent = 'unsupported';
  $('attachVoiceBtn').title = 'voice recording not supported on this device';
}

$('attachVoiceBtn').addEventListener('click', function(){
  // guard: unsupported device
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder){
    return;
  }
  if(mediaRecorder && mediaRecorder.state === 'recording'){
    // stop recording
    mediaRecorder.stop();
    $('attachVoiceBtn').classList.remove('recording');
    $('recTimer').textContent='voice';
    if(window._recInterval){clearInterval(window._recInterval);window._recInterval=null;}
    return;
  }
  // start recording
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = function(e){ audioChunks.push(e.data); };
    mediaRecorder.onstop = function(){
      var blob = new Blob(audioChunks, {type:'audio/webm'});
      var mime = blob.type || 'audio/webm';
      stream.getTracks().forEach(function(t){t.stop()});
      _blobToDataURL(blob).then(function(dataUrl){
        journalAttachments.voice = { dataUrl: dataUrl, mime: mime, size: dataUrl.length };
        var existing = $('attachPreview').querySelector('.voice-chip');
        if(existing) existing.remove();
        var chip = document.createElement('div');
        chip.className = 'voice-chip';
        chip.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/></svg>voice memo<button class="remove-attach">&times;</button>';
        chip.querySelector('.remove-attach').addEventListener('click', function(){
          journalAttachments.voice = null;
          chip.remove();
        });
        $('attachPreview').appendChild(chip);
      }).catch(function(err){
        console.warn('voice encode failed', err);
      });
    };
    mediaRecorder.start();
    $('attachVoiceBtn').classList.add('recording');
    // start timer
    var recSeconds=0;
    var recTimerEl=$('recTimer');
    recTimerEl.textContent='0:00';
    window._recInterval=setInterval(function(){
      recSeconds++;
      var m=Math.floor(recSeconds/60);
      var s=recSeconds%60;
      recTimerEl.textContent=m+':'+String(s).padStart(2,'0');
    },1000);
    // auto-stop after 60s
    setTimeout(function(){
      if(mediaRecorder && mediaRecorder.state==='recording') mediaRecorder.stop();
      $('attachVoiceBtn').classList.remove('recording');
      $('recTimer').textContent='voice';
      if(window._recInterval){clearInterval(window._recInterval);window._recInterval=null;}
    }, 60000);
  }).catch(function(){
    // permission denied or no mic — show inline hint, don't block the app
    $('recTimer').textContent='mic denied';
    setTimeout(function(){ $('recTimer').textContent='voice'; }, 2500);
  });
});

$('journalSubmit').addEventListener('click',()=>{
  const entry = $('journalArea').value.trim();
  if(!entry || !emo) return; // guard: need both text and an emotion
  // reset AI cache for this submission
  window._pendingAi = null;
  // populate (but don't save yet — save happens on "carry it forward")
  $('postInsightIcon').src = emoIconPath(emo);
  $('postInsightEmo').textContent = emo;
  var displayEntry = entry.length > 150 ? entry.slice(0,147) + '\u2026' : entry;
  $('postInsightEntry').textContent = '\u201C' + displayEntry + '\u201D';
  // AI-first reveal: start the text area empty so the friend-voice line
  // from Foundry is what the user reads, not a placeholder. The loading
  // dot below stays visible until AI arrives (or the timeout below fires).
  $('postInsightAi').textContent = '';
  $('postInsightAi').style.opacity = '';
  // show loading dot while AI fetch runs
  $('aiLoadingDot').classList.add('vis');
  // stash the draft — not committed until user taps carry it forward
  window._pendingEntry = entry;
  window._pendingEmo = emo;
  window._pendingIntent = intent;
  // Snapshot the actual attachment data so it persists into the saved entry.
  // Photos: [{dataUrl,width,height}]. Voice: {dataUrl,mime,size} | null.
  window._pendingPhotos = journalAttachments.photos.map(function(p){
    return { dataUrl: p.dataUrl, width: p.width, height: p.height };
  });
  window._pendingVoice = journalAttachments.voice
    ? { dataUrl: journalAttachments.voice.dataUrl, mime: journalAttachments.voice.mime }
    : null;
  go('s-journal','s-post-insight');
  // AI-first reveal. If AI arrives quickly, show it. If it takes longer
  // than MAX_WAIT_MS, fall back to the hardcoded POST_AI[emo] so the
  // screen never stays empty. 6s gives Foundry room for occasional spikes.
  var MAX_WAIT_MS = 6000;
  var _resolved = false;
  function _revealPostInsight(text){
    if(_resolved) return;
    _resolved = true;
    $('aiLoadingDot').classList.remove('vis');
    var el = $('postInsightAi');
    el.style.transition = 'opacity 400ms ease';
    el.style.opacity = '0';
    setTimeout(function(){
      el.textContent = text;
      el.style.opacity = '1';
    }, 200);
  }
  // hard fallback — hardcoded wins if AI too slow / offline
  var aiTimeout = setTimeout(function(){
    if(!_resolved) _revealPostInsight(POST_AI[emo] || 'the chain grew.');
  }, MAX_WAIT_MS);

  fetch(API_BASE + '/post-insight', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({content:entry, mood:emo, day_number:dayNum-1})
  }).then(function(r){return r.json()}).then(function(data){
    clearTimeout(aiTimeout);
    if(data && data.success && data.insight){
      _revealPostInsight(data.insight);
      // remember the AI version so the saved entry stores it, not the fallback
      window._pendingAi = data.insight;
    } else if(!_resolved){
      _revealPostInsight(POST_AI[emo] || 'the chain grew.');
    }
  }).catch(function(){
    clearTimeout(aiTimeout);
    if(!_resolved) _revealPostInsight(POST_AI[emo] || 'the chain grew.');
    _showOfflineBanner();
  });
});

// post-insight "carry it forward" button — commits the entry and triggers fly-to-chain
$('postInsightBtn').addEventListener('click',function(){
  if(this.disabled) return;
  var _btnRect = this.getBoundingClientRect(); // capture before any DOM mutations
  this.style.transition = 'none';
  this.disabled = true;
  this.style.opacity = '0.4';
  if(this.lastChild) this.lastChild.textContent = '\u2026';
  var entry = window._pendingEntry || '';
  if(!entry){ this.disabled = false; this.style.opacity = ''; return; }
  var pendingEmo = window._pendingEmo || emo;
  var pendingIntent = window._pendingIntent || intent;
  // set start date on first ever entry
  if(!gcStartDate){
    gcStartDate = todayISO();
    localStorage.setItem('gc_start_date', gcStartDate);
  }
  // track this date as logged
  var today = todayISO();
  if(!gcLoggedSet.has(today)){
    gcLoggedDates.push(today);
    gcLoggedSet.add(today);
    localStorage.setItem('gc_logged_dates', JSON.stringify(gcLoggedDates));
  }
  dayNum = getDayNumber(today);
  // save birthday knot if today is the user's birthday
  if(isBirthday){
    var bdayKnots=JSON.parse(localStorage.getItem('gc_birthday_knots')||'[]');
    if(!bdayKnots.includes(dayNum)){
      bdayKnots.push(dayNum);
      localStorage.setItem('gc_birthday_knots',JSON.stringify(bdayKnots));
      gcBirthdayKnots=bdayKnots;
      gcBirthdayKnotsSet=new Set(bdayKnots);
    }
  }
  dayNum++; // internal tracking (display = dayNum-1)
  localStorage.setItem('gc_day', String(dayNum));
  localStorage.setItem('gc_logged_today', new Date().toDateString());
  hasLogged = true;
  showNav();
  // Resolve attachment snapshots (array of photos + optional voice).
  var pendingPhotos = Array.isArray(window._pendingPhotos) ? window._pendingPhotos : [];
  var pendingVoice  = window._pendingVoice && window._pendingVoice.dataUrl ? window._pendingVoice : null;

  // save entry to localStorage history (attachments included so memories work across reloads)
  var entries = JSON.parse(localStorage.getItem('gc_entries') || '[]');
  entries.push({
    day: dayNum - 1, // save display day, not post-increment internal
    emo: pendingEmo,
    intent: pendingIntent,
    text: entry,
    date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),
    dateISO: todayISO(), // reliable month-key for portrait filtering
    ai: window._pendingAi || POST_AI[pendingEmo] || '',
    photos: pendingPhotos,       // [{dataUrl,width,height}]
    voice:  pendingVoice,        // {dataUrl,mime} | null
    hasPhotos: pendingPhotos.length > 0,
    hasVoice:  !!pendingVoice
  });
  try{
    localStorage.setItem('gc_entries', JSON.stringify(entries));
  }catch(e){
    // localStorage quota exceeded — drop attachments and retry text-only to
    // protect the chain. User's text is never lost; only the media falls off.
    console.warn('localStorage full; stripping attachments from saved entry', e);
    entries[entries.length-1].photos = [];
    entries[entries.length-1].voice = null;
    entries[entries.length-1].hasPhotos = false;
    entries[entries.length-1].hasVoice = false;
    try{ localStorage.setItem('gc_entries', JSON.stringify(entries)); }catch(_){}
  }
  populateMemories();
  populateHeld();
  populatePortrait();

  // ── Best-effort Cosmos write (fire-and-forget) ──
  // Ships the entry (with attachments, if any) to the backend so the memory
  // agent, AI Search index, and cross-device sync can use it. Silent on failure.
  (function(){
    try{
      var userId = localStorage.getItem('gc_user_id') || 'demo-user';
      fetch(API_BASE + '/submit-entry', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          user_id: userId,
          content: entry,
          mood: pendingEmo,
          intention: pendingIntent || '',
          photos: pendingPhotos, // [{dataUrl,width,height}]
          voice:  pendingVoice   // {dataUrl,mime} | null
        })
      }).catch(function(){ /* offline / backend down — ignore */ });
    }catch(e){ /* no-op */ }
  })();
  // clear pending flags
  window._pendingEmo = null;
  window._pendingIntent = null;
  window._pendingPhotos = null;
  window._pendingVoice = null;
  flyKnotToChain(entry, _btnRect);
  // invalidate the pendant-entries cache — new entry might be in the chosen month
  if(typeof window._invalidatePendantCache === 'function') window._invalidatePendantCache();

  // end-of-month ceremony trigger — only fires on the last day of the month,
  // after the fly-knot animation has settled (~3.2s)
  var __ceremonyToday = new Date();
  var __ceremonyLastDay = new Date(
    __ceremonyToday.getFullYear(), __ceremonyToday.getMonth()+1, 0
  ).getDate();
  if(__ceremonyToday.getDate() === __ceremonyLastDay){
    setTimeout(function(){ showMonthEndCeremony(); }, 3200);
  }

  // year-close trigger — fires when the final day of the chain year completes the necklace
  var calDay = gcStartDate ? getDayNumber(todayISO()) : dayNum;
  var _chainYear = gcStartDate ? new Date(gcStartDate).getFullYear() : new Date().getFullYear();
  var _yearDays = (_chainYear%4===0&&(_chainYear%100!==0||_chainYear%400===0)) ? 366 : 365;
  var isYearComplete = calDay === _yearDays;
  if(isYearComplete && gcStartDate){
    var yearCompleteKey = 'gc_year_complete_' + _chainYear;
    if(!localStorage.getItem(yearCompleteKey)){
      localStorage.setItem(yearCompleteKey, '1');
      // Ordering rule: if today is also the last day of the month, the monthly
      // ceremony fires first; queue the annual to fire after monthly dismissal.
      var _today = new Date();
      var _lastDayOfMonth = new Date(_today.getFullYear(), _today.getMonth()+1, 0).getDate();
      var _isMonthEnd = _today.getDate() === _lastDayOfMonth;
      if (_isMonthEnd) {
        localStorage.setItem('gc_annual_pending', String(_today.getFullYear()));
      } else {
        setTimeout(function(){ _showAnnualCeremony(); }, 3200);
      }
    }
  }
});

// post-insight back button — return to journal without clearing textarea
$('postInsightBack').addEventListener('click',function(){
  go('s-post-insight','s-journal');
  // keep the textarea content intact, restore counter visibility if needed
  var len=$('journalArea').value.length;
  $('journalCount').textContent=len+' / 500';
  if(len>0) $('journalCount').classList.add('vis');
  setTimeout(function(){$('journalArea').focus()},300);
});

// ── fly-knot-to-chain animation (replaces post-submit slither) ──
function flyKnotToChain(entry, startBtn){
  startBtn = startBtn || $('postInsightBtn').getBoundingClientRect();

  // create a floating Sacred Knot overlay
  // dark overlay for smooth transition
  var overlay=document.createElement('div');
  var bgColor=getComputedStyle(document.body).getPropertyValue('--bg').trim()||'#0e0b07';
  overlay.style.cssText='position:fixed;inset:0;z-index:150;background:'+bgColor+';opacity:0;transition:opacity 400ms;pointer-events:none';
  document.body.appendChild(overlay);

  // flying knot
  var knot=document.createElement('div');
  knot.style.cssText='position:fixed;z-index:200;pointer-events:none;'+
    'width:80px;height:80px;'+
    'background:url(assets/logogchain.svg) center/contain no-repeat;'+
    'filter:drop-shadow(0 0 20px rgba(230,182,88,0.6));'+
    'transition:all 1.4s cubic-bezier(0.25,0.1,0.25,1);'+
    'left:'+(startBtn.left+startBtn.width/2-40)+'px;'+
    'top:'+(startBtn.top+startBtn.height/2-40)+'px;'+
    'opacity:1;transform:scale(1)';
  document.body.appendChild(knot);

  // fade to dark, then switch screens behind the overlay
  requestAnimationFrame(function(){ overlay.style.opacity='1'; });
  setTimeout(function(){
    // hide all screens then show splash with nav
    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});
    $('s-splash').classList.add('active');
    $('s-splash').classList.remove('dimmed');
    $('s-splash').classList.add('logged');
    $('bottomNav').classList.add('show');
    $('homeStreak').textContent = 'morning '+(dayNum-1);
    $('loggedMsg').textContent=getLoggedMsg(dayNum-1);
    if(window._splashShowChain) window._splashShowChain();
    // fade overlay out to reveal chain
    overlay.style.opacity='0';
    setTimeout(function(){ overlay.remove(); },500);
  },450);

  // after overlay fades, animate the knot to fly to today's chain position
  setTimeout(function(){
    var pos=window._getTodayKnotPos?window._getTodayKnotPos():null;
    var targetX=pos?pos.x-40:window.innerWidth*0.18-40;
    var targetY=pos?pos.y-40:window.innerHeight*0.80-40;
    knot.style.left=targetX+'px';
    knot.style.top=targetY+'px';
    knot.style.transform='scale(0.5)';
    knot.style.filter='drop-shadow(0 0 30px rgba(255,255,255,0.8))';
  },500);

  // after animation completes, flash bright then remove
  setTimeout(function(){
    knot.style.opacity='0';
    knot.style.filter='drop-shadow(0 0 40px rgba(255,255,255,1))';
    knot.style.transform='scale(0.2)';
  },2000);

  // Day 1 only: a quiet moment marking the chain's beginning
  if(dayNum - 1 === 1){
    var day1Card = document.createElement('div');
    day1Card.style.cssText = [
      'position:fixed','inset:0','z-index:100','pointer-events:none',
      'display:flex','flex-direction:column','align-items:center','justify-content:center',
      'gap:8px','opacity:0','transition:opacity 900ms ease'
    ].join(';');
    day1Card.innerHTML =
      '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-weight:300;font-size:24px;color:rgba(245,237,224,0.88);margin:0;text-align:center">day one.</p>'+
      '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-weight:300;font-size:14px;color:rgba(201,148,58,0.65);margin:0;text-align:center">the chain begins.</p>';
    document.body.appendChild(day1Card);
    setTimeout(function(){ day1Card.style.opacity = '1'; }, 1800);
    setTimeout(function(){ day1Card.style.opacity = '0'; }, 4000);
    setTimeout(function(){ day1Card.remove(); }, 4900);
  }

  setTimeout(function(){
    knot.remove();
    // reset arrival state for next session
    emo=null;intent=null;
    document.querySelectorAll('.chip').forEach(function(x){x.classList.remove('sel')});
    $('arriveBtn').classList.remove('ready');
    $('intentSec').classList.remove('vis');
    $('arrivalHint').classList.remove('vis');
    $('journalArea').value='';
    // reset attachments
    journalAttachments={photos:[],voice:null};
    $('attachPreview').innerHTML='';
  },2600);

  // check milestone — use display day (dayNum is post-increment)
  var milestoneDay = dayNum - 1;
  if(MILESTONES.includes(milestoneDay)){
    setTimeout(function(){
      runMilestone(milestoneDay, function(){
        // after milestone dismiss, go to chain home
        go('s-milestone','s-splash');
        $('s-splash').classList.add('logged');
        $('s-splash').classList.remove('dimmed');
        if(window._splashShowChain) window._splashShowChain();
      });
    },2000);
  }

  // Birthday gift — fires after the knot lands on the birthday, once per year.
  // Runs in addition to (not instead of) the milestone if both apply.
  if(isBirthday){
    var _bYear = new Date().getFullYear();
    var _bKey  = 'gc_birthday_ceremony_seen_' + _bYear;
    if(!localStorage.getItem(_bKey)){
      setTimeout(function(){
        try{ runBirthdayCeremony(function(){
          localStorage.setItem(_bKey, '1');
        }); }catch(e){}
      }, 2400);
    }
  }

  // Day 365/366 — close the circle after the knot lands and flashes
  var calDay365 = gcStartDate ? getDayNumber(todayISO()) : 0;
  var _cy365 = gcStartDate ? new Date(gcStartDate).getFullYear() : new Date().getFullYear();
  var _yd365 = (_cy365%4===0&&(_cy365%100!==0||_cy365%400===0)) ? 366 : 365;
  if(calDay365 === _yd365 && window._startCircleClose){
    setTimeout(function(){
      window._startCircleClose();
    }, 2200);
  }
}

