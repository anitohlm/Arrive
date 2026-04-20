// ═══ CAPSULE DATA + RENDER ══════════════════════════
function getCapsules(){
  try{ return JSON.parse(localStorage.getItem('gc_time_capsules')||'[]'); }catch(e){ return []; }
}

function saveCapsules(arr){
  localStorage.setItem('gc_time_capsules', JSON.stringify(arr));
}

function openCapsule(id){
  var caps = getCapsules();
  caps = caps.map(function(c){
    return c.id === id ? Object.assign({}, c, {opened_at: new Date().toISOString()}) : c;
  });
  saveCapsules(caps);
}

function deleteCapsule(id){
  var caps = getCapsules().filter(function(c){ return c.id !== id; });
  saveCapsules(caps);
}

function _todayISO(){
  // local date, not UTC — see streak.js todayISO() comment
  var d = new Date();
  var p = function(n){ return String(n).padStart(2,'0'); };
  return d.getFullYear() + '-' + p(d.getMonth()+1) + '-' + p(d.getDate());
}

function _todayLoggedEmo(){
  var today = _todayISO();
  var entries = [];
  try{ entries = JSON.parse(localStorage.getItem('gc_entries')||'[]'); }catch(e){}
  var todayEntry = entries.filter(function(e){ return e.date === today; });
  return todayEntry.length ? todayEntry[todayEntry.length-1].emo : null;
}

function _capsuleBuckets(){
  var caps = getCapsules();
  var today = _todayISO();
  var todayEmo = _todayLoggedEmo();

  var ready = [], sealed = [], opened = [];
  caps.forEach(function(c){
    if(c.opened_at){
      opened.push(c);
      return;
    }
    var dateReady = c.unlock_date <= today;
    var moodReady = !c.mood_trigger || c.mood_trigger === todayEmo;
    if(dateReady && moodReady){
      ready.push(c);
    } else {
      sealed.push(c);
    }
  });

  // opened: most recent first
  opened.sort(function(a,b){ return b.opened_at.localeCompare(a.opened_at); });
  // sealed: soonest unlock first
  sealed.sort(function(a,b){ return a.unlock_date.localeCompare(b.unlock_date); });
  // ready: written_at oldest first (the one waiting longest comes first)
  ready.sort(function(a,b){ return a.written_at.localeCompare(b.written_at); });

  return {ready:ready, sealed:sealed, opened:opened};
}

function _fmtDate(iso){
  if(!iso) return '';
  var d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
  return d.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}).toLowerCase();
}

function _countdown(unlockISO){
  var today = new Date(_todayISO()+'T12:00:00');
  var unlock = new Date(unlockISO+'T12:00:00');
  var diffMs = unlock - today;
  var diffDays = Math.round(diffMs / 86400000);
  if(diffDays <= 0) return 'today';
  if(diffDays === 1) return 'tomorrow';
  if(diffDays < 30) return 'in ' + diffDays + ' day' + (diffDays===1?'':'s');
  var months = Math.round(diffDays / 30.4);
  if(months < 12) return 'in ' + months + ' month' + (months===1?'':'s');
  var years = Math.round(diffDays / 365);
  return 'in ' + years + ' year' + (years===1?'':'s');
}

function _waxSealSVG(small){
  var s = small ? 20 : 28;
  return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" fill="none" xmlns="http://www.w3.org/2000/svg">'
    +'<circle cx="12" cy="12" r="9" stroke="#c9943a" stroke-width="1.2" opacity="0.5"/>'
    +'<circle cx="12" cy="12" r="5" stroke="#c9943a" stroke-width="1" opacity="0.7"/>'
    +'<circle cx="12" cy="12" r="2" fill="#c9943a" opacity="0.4"/>'
    +'</svg>';
}

function _chainLinkSVG(){
  return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">'
    +'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#c9943a" stroke-width="1.3" stroke-linecap="round" opacity="0.45"/>'
    +'<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#c9943a" stroke-width="1.3" stroke-linecap="round" opacity="0.45"/>'
    +'</svg>';
}

function _excerpt(text, words){
  if(!text) return '';
  var ws = text.trim().split(/\s+/);
  if(ws.length <= words) return text.trim();
  return ws.slice(0, words).join(' ') + '\u2026';
}

function renderUnfold(){
  var buckets = _capsuleBuckets();
  var total = buckets.ready.length + buckets.sealed.length + buckets.opened.length;

  // show empty state or content
  var emptyEl = $('unfoldEmpty');
  var contentEl = $('unfoldContent');
  var fabEl = $('unfoldFab');
  if(!emptyEl || !contentEl) return;

  if(total === 0){
    emptyEl.hidden = false;
    contentEl.hidden = true;
    if(fabEl) fabEl.hidden = true;
    return;
  }
  emptyEl.hidden = true;
  contentEl.hidden = false;
  if(fabEl) fabEl.hidden = false;

  // ── Ready section ──
  var readySec = $('unfoldReady');
  var readyList = $('unfoldReadyList');
  if(buckets.ready.length > 0){
    readySec.hidden = false;
    readyList.innerHTML = '';
    buckets.ready.forEach(function(c){
      var card = document.createElement('div');
      card.className = 'unfold-ready-card';
      card.setAttribute('role','button');
      card.setAttribute('tabindex','0');
      card.setAttribute('aria-label','open capsule written '+_fmtDate(c.written_at));
      card.innerHTML = '<p class="unfold-ready-eyebrow">a message from your past self</p>'
        +'<p class="unfold-ready-title">ready to open</p>'
        +'<p class="unfold-ready-meta">written '+_fmtDate(c.written_at)+'</p>';
      card.addEventListener('click', function(){ _openReadyCapsule(c.id); });
      card.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); _openReadyCapsule(c.id); } });
      readyList.appendChild(card);
    });
  } else {
    readySec.hidden = true;
  }

  // ── Sealed section ──
  var sealedSec = $('unfoldSealed');
  var sealedList = $('unfoldSealedList');
  if(buckets.sealed.length > 0){
    sealedSec.hidden = false;
    sealedList.innerHTML = '';
    buckets.sealed.forEach(function(c){
      var card = document.createElement('div');
      card.className = 'unfold-sealed-card';
      var moodLine = c.mood_trigger
        ? '<p class="unfold-sealed-mood">'+_waxSealSVG(true)+' when you feel <em>'+_escHtml(c.mood_trigger)+'</em></p>'
        : '';
      card.innerHTML = '<div class="unfold-sealed-icon">'+_waxSealSVG(false)+'</div>'
        +'<div class="unfold-sealed-body">'
        +'<p class="unfold-sealed-written">written '+_fmtDate(c.written_at)+'</p>'
        +'<p class="unfold-sealed-unlock">unlocks '+_fmtDate(c.unlock_date)+'</p>'
        +'<p class="unfold-sealed-countdown">'+(c.unlock_date <= _todayISO() && c.mood_trigger ? 'waiting for a '+_escHtml(c.mood_trigger)+' day' : _countdown(c.unlock_date))+'</p>'
        +moodLine
        +'</div>';
      // long-press to delete
      var _pressTimer = null;
      card.addEventListener('pointerdown', function(){
        _pressTimer = setTimeout(function(){ _confirmDeleteCapsule(c.id, card); }, 600);
      });
      card.addEventListener('pointerup', function(){ clearTimeout(_pressTimer); });
      card.addEventListener('pointerleave', function(){ clearTimeout(_pressTimer); });
      sealedList.appendChild(card);
    });
  } else {
    sealedSec.hidden = true;
  }

  // ── Opened section ──
  var openedSec = $('unfoldOpened');
  var openedList = $('unfoldOpenedList');
  if(buckets.opened.length > 0){
    openedSec.hidden = false;
    openedList.innerHTML = '';
    buckets.opened.forEach(function(c){
      var card = document.createElement('div');
      card.className = 'unfold-opened-card';
      card.setAttribute('role','button');
      card.setAttribute('tabindex','0');
      card.setAttribute('aria-label','re-read capsule, written '+_fmtDate(c.written_at)+', opened '+_fmtDate(c.opened_at));
      card.innerHTML = '<div class="unfold-opened-icon">'+_chainLinkSVG()+'</div>'
        +'<div class="unfold-opened-body">'
        +'<p class="unfold-opened-preview">'+_escHtml(_excerpt(c.message, 15))+'</p>'
        +'<p class="unfold-opened-meta">written '+_fmtDate(c.written_at)+' \u00b7 opened '+_fmtDate(c.opened_at)+'</p>'
        +'</div>';
      card.addEventListener('click', function(){ _reReadCapsule(c); });
      card.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); _reReadCapsule(c); } });
      openedList.appendChild(card);
    });
  } else {
    openedSec.hidden = true;
  }
}

function _openReadyCapsule(id){
  var caps = getCapsules();
  var cap = caps.find(function(c){ return c.id === id; });
  if(!cap) return;
  // show unlock overlay
  _showCapsuleReveal(cap, function(){
    openCapsule(id);
    renderUnfold();
  });
}

function _showCapsuleReveal(cap, onDone){
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed','inset:0','z-index:300',
    'background:var(--bg)',
    'display:flex','flex-direction:column','align-items:center','justify-content:center',
    'padding:32px','text-align:center','gap:24px',
    'opacity:0','transition:opacity 400ms ease'
  ].join(';');

  var msgHtml = '<p style="font-family:\'DM Mono\',monospace;font-size:9px;letter-spacing:.16em;color:rgba(201,148,58,.5);text-transform:lowercase">a message from your past self</p>'
    +'<p style="font-family:\'DM Mono\',monospace;font-size:10px;color:rgba(201,148,58,.45);letter-spacing:.08em">written '+_fmtDate(cap.written_at)+'</p>'
    +'<p id="_capsuleRevealMsg" style="font-family:\'Fraunces\',serif;font-style:italic;font-weight:300;font-size:17px;color:rgba(245,237,224,.85);line-height:1.7;max-width:320px;opacity:0;transition:opacity 800ms ease">'+_escHtml(cap.message)+'</p>'
    +'<div style="display:flex;flex-direction:column;gap:12px;margin-top:16px;width:100%;max-width:280px">'
    +'<button id="_capsuleRevealShare" style="padding:13px 24px;background:rgba(201,148,58,.1);border:1px solid rgba(201,148,58,.25);border-radius:100px;color:var(--gold,#c9943a);font-family:\'Fraunces\',serif;font-style:italic;font-size:15px;cursor:pointer">share this moment</button>'
    +'<button id="_capsuleRevealDone" style="padding:12px 24px;background:none;border:none;color:rgba(245,237,224,.45);font-family:\'DM Mono\',monospace;font-size:11px;letter-spacing:.08em;cursor:pointer">done</button>'
    +'</div>';

  if(reducedMotion){
    overlay.innerHTML = msgHtml;
    document.body.appendChild(overlay);
    requestAnimationFrame(function(){
      overlay.style.opacity = '1';
      var msg = overlay.querySelector('#_capsuleRevealMsg');
      if(msg) setTimeout(function(){ msg.style.opacity = '1'; }, 100);
    });
  } else {
    // Build wax-seal SVG (gold circle + two crack lines)
    var sealSvg = '<svg id="_capsuleSeal" width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"'
      +' style="display:block;margin:0 auto;animation:sealAppear 600ms cubic-bezier(.34,1.4,.64,1) forwards;">'
      +'<circle cx="32" cy="32" r="29" fill="#c9943a" stroke="#c9943a" stroke-width="1.5" opacity="0.6"/>'
      +'<circle cx="32" cy="32" r="22" fill="#c9943a" opacity="0.22"/>'
      +'<line id="_sealCrack1" x1="22" y1="18" x2="42" y2="46"'
      +' stroke="#0e0b07" stroke-width="1.5" stroke-linecap="round"'
      +' style="stroke-dasharray:80;stroke-dashoffset:80;opacity:0"/>'
      +'<line id="_sealCrack2" x1="38" y1="16" x2="26" y2="48"'
      +' stroke="#0e0b07" stroke-width="1" stroke-linecap="round"'
      +' style="stroke-dasharray:80;stroke-dashoffset:80;opacity:0"/>'
      +'</svg>';

    // Container: seal shown first, message hidden
    overlay.innerHTML = sealSvg + msgHtml;
    // Hide message content until seal exits
    var msgNodes = overlay.querySelectorAll('p, div');
    msgNodes.forEach(function(n){ n.style.opacity = '0'; });

    document.body.appendChild(overlay);

    requestAnimationFrame(function(){
      overlay.style.opacity = '1';

      // After seal appears (~600ms), animate crack lines
      setTimeout(function(){
        var c1 = overlay.querySelector('#_sealCrack1');
        var c2 = overlay.querySelector('#_sealCrack2');
        if(c1) c1.style.cssText += ';animation:sealCrackLine 350ms ease forwards';
        if(c2) c2.style.cssText += ';animation:sealCrackLine 350ms ease 80ms forwards';

        // After crack lines draw (~400ms), crack/shatter the seal
        setTimeout(function(){
          var seal = overlay.querySelector('#_capsuleSeal');
          if(seal){
            seal.style.animation = 'sealCrack 400ms ease forwards';
          }

          // After seal exits (~400ms), fade in message
          setTimeout(function(){
            var seal2 = overlay.querySelector('#_capsuleSeal');
            if(seal2) seal2.style.display = 'none';
            var msg = overlay.querySelector('#_capsuleRevealMsg');
            var allNodes = overlay.querySelectorAll('p, div');
            allNodes.forEach(function(n){ n.style.opacity = ''; });
            if(msg) setTimeout(function(){ msg.style.opacity = '1'; }, 40);
          }, 420);
        }, 380);
      }, 620);
    });
  }

  overlay.addEventListener('click', function(e){
    var share = overlay.querySelector('#_capsuleRevealShare');
    var done = overlay.querySelector('#_capsuleRevealDone');
    if(share && e.target === share){ _shareCapsule(cap); }
    if(done && e.target === done){
      overlay.style.opacity = '0';
      setTimeout(function(){ overlay.remove(); if(onDone) onDone(); }, 420);
    }
  });
}

function _escHtml(str){
  if(!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function _reReadCapsule(cap){
  _showCapsuleReveal(cap, null); // no callback — already opened
}

function _confirmDeleteCapsule(id, cardEl){
  // build a bottom sheet overlay styled consistently with the app
  var sheet = document.createElement('div');
  sheet.style.cssText = [
    'position:fixed','inset:0','z-index:400',
    'background:rgba(0,0,0,0.55)',
    'display:flex','align-items:flex-end','justify-content:center',
    'opacity:0','transition:opacity 250ms ease'
  ].join(';');

  var inner = document.createElement('div');
  inner.style.cssText = [
    'width:100%','max-width:480px',
    'background:var(--bg,#0e0b07)',
    'border-top:1px solid rgba(201,148,58,0.12)',
    'border-radius:20px 20px 0 0',
    'padding:24px 24px calc(32px + env(safe-area-inset-bottom))',
    'display:flex','flex-direction:column','gap:12px',
    'transform:translateY(20px)','transition:transform 250ms ease'
  ].join(';');

  inner.innerHTML = '<p style="font-family:\'Fraunces\',serif;font-style:italic;font-weight:300;font-size:16px;color:rgba(245,237,224,.8);margin:0 0 4px;line-height:1.4">delete this capsule?</p>'
    +'<p style="font-size:13px;color:rgba(245,237,224,.4);margin:0 0 16px;line-height:1.5">your future self won\'t get this.</p>'
    +'<button id="_capsuleDeleteConfirm" style="width:100%;padding:14px;background:rgba(180,60,60,.15);border:1px solid rgba(180,60,60,.3);border-radius:100px;color:rgba(220,100,100,.9);font-family:\'DM Mono\',monospace;font-size:12px;letter-spacing:.06em;cursor:pointer">delete capsule</button>'
    +'<button id="_capsuleDeleteCancel" style="width:100%;padding:12px;background:none;border:none;color:rgba(245,237,224,.35);font-family:\'DM Mono\',monospace;font-size:11px;letter-spacing:.06em;cursor:pointer">keep it</button>';

  sheet.appendChild(inner);
  document.body.appendChild(sheet);

  requestAnimationFrame(function(){
    sheet.style.opacity = '1';
    inner.style.transform = 'translateY(0)';
  });

  function _dismiss(){ sheet.style.opacity = '0'; setTimeout(function(){ sheet.remove(); }, 260); }

  inner.querySelector('#_capsuleDeleteConfirm').addEventListener('click', function(){
    _dismiss();
    deleteCapsule(id);
    renderUnfold();
  });
  inner.querySelector('#_capsuleDeleteCancel').addEventListener('click', _dismiss);
  sheet.addEventListener('click', function(e){ if(e.target === sheet) _dismiss(); });
}

function _showCopyToast(msg){
  var toast = document.createElement('div');
  toast.textContent = msg || 'copied';
  toast.style.cssText = [
    'position:fixed','bottom:32px','left:50%','transform:translateX(-50%)',
    'z-index:500',
    'font-family:\'DM Mono\',monospace','font-size:11px',
    'color:var(--gold,#c9943a)',
    'background:rgba(14,11,7,.9)',
    'border:1px solid rgba(201,148,58,.2)',
    'border-radius:100px',
    'padding:8px 20px',
    'white-space:nowrap',
    'opacity:0','transition:opacity 250ms ease',
    'pointer-events:none'
  ].join(';');
  document.body.appendChild(toast);
  requestAnimationFrame(function(){
    toast.style.opacity = '1';
    setTimeout(function(){
      toast.style.opacity = '0';
      setTimeout(function(){ toast.remove(); }, 260);
    }, 2000);
  });
}

function _showCapsuleGlowTooltip(text, x, y){
  var tip = document.createElement('div');
  tip.style.cssText = [
    'position:fixed',
    'left:'+x+'px',
    'top:'+(y-48)+'px',
    'transform:translateX(-50%)',
    'white-space:nowrap',
    'font-family:\'DM Mono\',monospace',
    'font-size:10px',
    'color:rgba(201,148,58,0.85)',
    'letter-spacing:0.08em',
    'background:rgba(14,11,7,0.88)',
    'border:1px solid rgba(201,148,58,0.2)',
    'border-radius:100px',
    'padding:6px 14px',
    'pointer-events:none',
    'z-index:200',
    'opacity:0',
    'transition:opacity 200ms ease'
  ].join(';');
  tip.textContent = text;
  document.body.appendChild(tip);
  requestAnimationFrame(function(){ tip.style.opacity = '1'; });
  setTimeout(function(){ tip.style.opacity = '0'; }, 2000);
  setTimeout(function(){ tip.remove(); }, 2200);
}

function _requestCapsuleNotifPermission(){
  if(!('Notification' in window)) return;
  if(Notification.permission === 'granted' || Notification.permission === 'denied') return;
  Notification.requestPermission();
}

function _checkCapsuleNotifications(){
  if(!('Notification' in window)) return;
  if(Notification.permission !== 'granted') return;

  var caps = getCapsules();
  var today = _todayISO();
  var todayEmo = (typeof _todayLoggedEmo === 'function') ? _todayLoggedEmo() : null;
  var lastNotifDate = localStorage.getItem('gc_capsule_notif_date') || '';

  // only notify once per day
  if(lastNotifDate === today) return;

  var readyCount = 0;
  caps.forEach(function(c){
    if(c.opened_at) return; // skip opened capsules
    var dateReady = c.unlock_date <= today;
    var moodReady = !c.mood_trigger || c.mood_trigger === todayEmo;
    if(dateReady && moodReady) readyCount++;
  });

  if(readyCount === 0) return;

  localStorage.setItem('gc_capsule_notif_date', today);

  var body = readyCount === 1
    ? 'a time capsule is ready to open.'
    : readyCount + ' time capsules are ready to open.';

  try{
    new Notification('gratitudechain', {
      body: body,
      icon: 'logogchain.svg',
      silent: false
    });
  }catch(e){}
}

function _shareCapsule(cap){
  var written = _fmtDate(cap.written_at);
  var plainText = '\u201c'+cap.message+'\u201d\n\nwritten '+written+' \u00b7 gratitudechain';

  // Helper: month-distance label for canvas tag line
  function _monthsAgo(iso){
    if(!iso) return 'some time';
    var then = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    var now = new Date();
    var months = (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth());
    if(months <= 0) return 'just now';
    if(months === 1) return '1 month ago';
    if(months < 12) return months + ' months ago';
    var yrs = Math.round(months / 12);
    return yrs + ' year' + (yrs === 1 ? '' : 's') + ' ago';
  }

  function _doShare(blob){
    var file = blob ? new File([blob], 'gratitudechain.png', {type:'image/png'}) : null;
    if(file && navigator.canShare && navigator.canShare({files:[file]})){
      navigator.share({files:[file]}).catch(function(){});
    } else if(navigator.share){
      navigator.share({text: plainText}).catch(function(){});
    } else {
      var cb = navigator.clipboard;
      if(cb){
        cb.writeText(plainText).then(function(){ _showCopyToast('copied'); }).catch(function(){ _showCopyToast('copied'); });
      } else {
        _showCopyToast('copied');
      }
    }
  }

  // Build canvas card
  var W = 1080, H = 540;
  var canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  var ctx = canvas.getContext('2d');

  function _drawCard(){
    // Background
    ctx.fillStyle = '#0e0b07';
    ctx.fillRect(0, 0, W, H);

    // Radial glow — center warm amber at ~5% opacity
    var grd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.6);
    grd.addColorStop(0, 'rgba(201,148,58,0.05)');
    grd.addColorStop(1, 'rgba(201,148,58,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    // Message text — Fraunces italic, 28px, centered, word-wrapped in upper 2/3
    var msgFontFamily = document.fonts && document.fonts.check('italic 28px Fraunces') ? '\'Fraunces\'' : 'Georgia, serif';
    ctx.font = 'italic 300 28px ' + msgFontFamily;
    ctx.fillStyle = 'rgba(245,237,224,0.85)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Word-wrap the message to max 320px wide
    var maxW = 320;
    var words = cap.message.split(' ');
    var lines = [];
    var cur = '';
    for(var i = 0; i < words.length; i++){
      var test = cur ? cur + ' ' + words[i] : words[i];
      if(ctx.measureText(test).width > maxW && cur){
        lines.push(cur);
        cur = words[i];
      } else {
        cur = test;
      }
    }
    if(cur) lines.push(cur);

    var lineHeight = 44;
    var totalTextH = lines.length * lineHeight;
    // Vertically center in upper 2/3 (0 to H*2/3)
    var upperMid = (H * 2/3) / 2;
    var startY = upperMid - totalTextH / 2 + lineHeight / 2;
    for(var j = 0; j < lines.length; j++){
      ctx.fillText(lines[j], W/2, startY + j * lineHeight);
    }

    // Thin gold horizontal rule between message and tag
    var ruleY = H * 2/3 + 20;
    ctx.strokeStyle = 'rgba(201,148,58,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W/2 - 40, ruleY);
    ctx.lineTo(W/2 + 40, ruleY);
    ctx.stroke();

    // Tag line — DM Mono, 11px, #c9943a at 50% opacity, 32px from bottom
    var monoFont = document.fonts && document.fonts.check('11px \'DM Mono\'') ? '\'DM Mono\'' : 'monospace';
    ctx.font = '11px ' + monoFont;
    ctx.fillStyle = 'rgba(201,148,58,0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('written ' + _monthsAgo(cap.written_at) + ' \u00b7 gratitudechain', W/2, H - 32);

    canvas.toBlob(function(blob){ _doShare(blob); }, 'image/png');
  }

  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(_drawCard).catch(_drawCard);
  } else {
    _drawCard();
  }
}

// ═══ CAPSULE COMPOSER ═══════════════════════════════
(function(){
  var _capsuleData = {
    message: '',
    unlock_date: '',
    mood_trigger: null
  };
  var _selectedDateChip = null;
  var _selectedMood = null;

  var MOOD_FAMILIES = [
    { label:'arriving light',
      moods:['grateful','tender','hopeful','calm','alive','light','passionate','content','relaxed','focused','inspired','certain'] },
    { label:'in between',
      moods:['quiet','numb','foggy','nervous','restless','searching','lost','yearning','bored'] },
    { label:'carrying weight',
      moods:['hard','heavy','overwhelmed','livid','sad','frustrated','anxious','lonely','upset','insecure'] },
    { label:'hard to name',
      moods:['heartbroken','disappointed','exhausted','moved','ashamed','vulnerable','betrayed'] }
  ];
  var MOODS = MOOD_FAMILIES.reduce(function(all, f){ return all.concat(f.moods); }, []);

  // ── open/close ──────────────────────────────────────
  function openComposer(){
    var el = $('capsuleComposer');
    if(!el) return;
    _capsuleData = {message:'',unlock_date:'',mood_trigger:null};
    _selectedDateChip = null;
    _selectedMood = null;
    // reset all steps
    _showStep(1);
    $('capsuleMessage').value = '';
    $('capsuleCharRow').hidden = true;
    $('capsuleCharCount').textContent = '0';
    $('capsuleNext1').disabled = true;
    // reset date chips
    document.querySelectorAll('.capsule-date-chip').forEach(function(c){ c.classList.remove('sel'); });
    $('capsuleCustomDate').hidden = true;
    $('capsuleCustomDate').value = '';
    $('capsuleNext2').disabled = true;
    // reset mood
    document.querySelectorAll('.capsule-mood-chip').forEach(function(c){ c.classList.remove('sel'); });

    el.hidden = false;
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        el.classList.add('open');
        setTimeout(function(){ $('capsuleMessage').focus(); }, 420);
      });
    });
  }

  function closeComposer(){
    var el = $('capsuleComposer');
    if(!el) return;
    el.classList.remove('open');
    setTimeout(function(){ el.hidden = true; }, 420);
  }

  function _showStep(n){
    [1,2,3,4].forEach(function(i){
      var s = $('capsuleStep'+i);
      if(s) s.hidden = (i !== n);
    });
  }

  // ── Step 1: message ─────────────────────────────────
  $('capsuleBack1').addEventListener('click', closeComposer);

  $('capsuleMessage').addEventListener('input', function(){
    var len = this.value.length;
    _capsuleData.message = this.value;
    $('capsuleNext1').disabled = len === 0;
    // show char count approaching limit
    $('capsuleCharRow').hidden = len < 750;
    $('capsuleCharCount').textContent = len;
  });

  $('capsuleNext1').addEventListener('click', function(){
    if(!_capsuleData.message.trim()) return;
    _showStep(2);
  });

  // ── Step 2: unlock date ──────────────────────────────
  $('capsuleBack2').addEventListener('click', function(){ _showStep(1); });

  document.querySelectorAll('.capsule-date-chip').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.capsule-date-chip').forEach(function(c){ c.classList.remove('sel'); });
      btn.classList.add('sel');
      _selectedDateChip = btn.dataset.months;

      if(btn.dataset.months === '0'){
        // custom date
        $('capsuleCustomDate').hidden = false;
        $('capsuleCustomDate').focus();
        // set min date to tomorrow
        var tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
        $('capsuleCustomDate').min = tomorrow.toISOString().slice(0,10);
        // disable next until custom date chosen
        $('capsuleNext2').disabled = !$('capsuleCustomDate').value;
      } else {
        $('capsuleCustomDate').hidden = true;
        var d = new Date();
        d.setMonth(d.getMonth() + parseInt(btn.dataset.months, 10));
        _capsuleData.unlock_date = d.toISOString().slice(0,10);
        $('capsuleNext2').disabled = false;
      }
    });
  });

  $('capsuleCustomDate').addEventListener('change', function(){
    if(this.value){
      _capsuleData.unlock_date = this.value;
      $('capsuleNext2').disabled = false;
    }
  });

  $('capsuleNext2').addEventListener('click', function(){
    if(!_capsuleData.unlock_date) return;
    var wrap = $('capsuleMoodChips');
    wrap.innerHTML = '';

    // "any feeling" default — clears any specific mood. Selected unless user picks one.
    var anyBtn = document.createElement('button');
    anyBtn.type = 'button';
    anyBtn.className = 'capsule-any-pill sel';
    anyBtn.textContent = 'any feeling';
    anyBtn.addEventListener('click', function(){
      document.querySelectorAll('.capsule-mood-word.sel').forEach(function(c){ c.classList.remove('sel'); });
      anyBtn.classList.add('sel');
      _selectedMood = null;
    });
    wrap.appendChild(anyBtn);

    function selectWord(btn, mood){
      var isDeselect = (_selectedMood === mood);
      document.querySelectorAll('.capsule-mood-word.sel').forEach(function(c){ c.classList.remove('sel'); });
      anyBtn.classList.remove('sel');
      if(isDeselect){
        _selectedMood = null;
        anyBtn.classList.add('sel');
      } else {
        btn.classList.add('sel');
        _selectedMood = mood;
      }
    }

    MOOD_FAMILIES.forEach(function(family){
      var group = document.createElement('div');
      group.className = 'capsule-mood-group';
      var label = document.createElement('p');
      label.className = 'capsule-mood-group-label';
      label.textContent = family.label;
      group.appendChild(label);

      var words = document.createElement('div');
      words.className = 'capsule-mood-words';
      family.moods.forEach(function(m){
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'capsule-mood-word';
        btn.dataset.mood = m;
        btn.textContent = m;
        btn.addEventListener('click', function(){ selectWord(btn, m); });
        words.appendChild(btn);
      });
      group.appendChild(words);
      wrap.appendChild(group);
    });

    // reset selection state when the picker opens
    _selectedMood = null;
    _showStep(3);
  });

  // ── Step 3: mood trigger ─────────────────────────────
  $('capsuleBack3').addEventListener('click', function(){ _showStep(2); });

  $('capsuleNext3').addEventListener('click', function(){
    _capsuleData.mood_trigger = _selectedMood;
    _sealCapsule();
  });

  $('capsuleSkip3').addEventListener('click', function(){
    _capsuleData.mood_trigger = null;
    _sealCapsule();
  });

  // ── Step 4: seal + save ──────────────────────────────
  function _sealCapsule(){
    if(!_capsuleData.unlock_date){ return; }
    // save to localStorage
    var capsules = [];
    try{ capsules = JSON.parse(localStorage.getItem('gc_time_capsules')||'[]'); }catch(e){}
    var now = new Date().toISOString();
    var id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    capsules.push({
      id: id,
      message: _capsuleData.message,
      written_at: now,
      unlock_date: _capsuleData.unlock_date,
      mood_trigger: _capsuleData.mood_trigger,
      opened_at: null,
      shared_at: null
    });
    localStorage.setItem('gc_time_capsules', JSON.stringify(capsules));
    if(typeof _requestCapsuleNotifPermission === 'function') _requestCapsuleNotifPermission();

    // build confirm message
    var unlockFmt = new Date(_capsuleData.unlock_date + 'T12:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}).toLowerCase();
    var sub = 'your future self will see this on ' + unlockFmt + '.';
    if(_capsuleData.mood_trigger){
      sub += ' when you next feel ' + _capsuleData.mood_trigger + '.';
    }
    $('capsuleConfirmSub').textContent = sub;
    $('capsuleConfirmTitle').textContent = 'sealed.';

    _showStep(4);
  }

  $('capsuleDoneBtn').addEventListener('click', function(){
    closeComposer();
    // refresh unfold screen
    setTimeout(function(){
      if(typeof renderUnfold === 'function') renderUnfold();
    }, 450);
  });

  // ── FAB wiring ───────────────────────────────────────
  var fab = $('unfoldFab');
  if(fab) fab.addEventListener('click', openComposer);
  var firstBtn = $('unfoldWriteFirstBtn');
  if(firstBtn) firstBtn.addEventListener('click', openComposer);

  // expose for external triggers
  window.openCapsuleComposer = openComposer;
})();

// ── DEV-ONLY helpers (fenced) ───────────────────────────────────────────
if (typeof window !== 'undefined') {
  window._DEV = window._DEV || {};
  window._DEV.demoAnnual = function(year){
    year = year || new Date().getFullYear();
    var today = new Date();
    var pad = function(n){ return String(n).padStart(2,'0'); };
    var iso = function(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); };
    var start = new Date(today); start.setDate(start.getDate() - 364);
    // full 37-emotion arc — every emotion appears at least once across the year
    var monthEmos = [
      ['quiet','searching','overwhelmed','lost'],       // Jan — new year weight
      ['tender','heartbroken','exhausted','vulnerable'],// Feb — winter grief
      ['heavy','lonely','ashamed','disappointed'],      // Mar — still in it
      ['restless','foggy','bored','nervous'],           // Apr — beginning to stir
      ['hopeful','inspired','anxious','yearning'],      // May — turning point
      ['alive','focused','content','frustrated'],       // Jun — opening up
      ['grateful','passionate','light','certain'],      // Jul — full summer
      ['calm','relaxed','moved','tender'],              // Aug — settled warmth
      ['sad','betrayed','numb','insecure'],             // Sep — autumn shadow
      ['hard','upset','livid','searching'],             // Oct — season turning
      ['grateful','tender','heavy','moved'],            // Nov — gratitude with weight
      ['hopeful','calm','inspired','certain'],          // Dec — year-end peace
    ];
    // 50/30/10/10 distribution using LCG seed per day — deterministic, non-mechanical
    var emoWeights = [0,0,0,0,0,1,1,1,2,3];
    var logged = [], entries = [];
    for (var i = 0; i < 365; i++) {
      var d = new Date(start); d.setDate(start.getDate() + i);
      var date = iso(d);
      logged.push(date);
      var mIdx = d.getMonth();
      var pool = monthEmos[mIdx];
      var lseed = (((d.getDate() * 1103515245) ^ (mIdx * 22695477)) + 12345) >>> 0;
      var r = ((lseed >> 8) ^ (lseed >> 4)) % 10;
      var emo = pool[emoWeights[r]];
      entries.push({day: i+1, date: date, emo: emo, intent:'carry-forward', text: 'day '+(i+1)+'.', ts: d.getTime()});
    }
    localStorage.setItem('gc_user', JSON.stringify({name:'Dev', birthday:'04-25', email:'d@test'}));
    localStorage.setItem('gc_onboard_seen', '1');
    localStorage.setItem('gc_start_date', iso(start));
    localStorage.setItem('gc_logged_dates', JSON.stringify(logged));
    localStorage.setItem('gc_logged_today', today.toDateString());
    localStorage.setItem('gc_day', '366');
    localStorage.setItem('gc_entries', JSON.stringify(entries));
    localStorage.setItem('gc_theme', 'theme-dark');
    localStorage.setItem('gc_birthday_knots', '[]');
    var months = {};
    logged.forEach(function(d){ months[d.slice(0,7)] = true; });
    Object.keys(months).forEach(function(ym){ localStorage.setItem('gc_ceremony_seen_'+ym, '1'); });
    localStorage.removeItem('gc_year_complete_'+year);
    localStorage.removeItem('gc_annual_pending');
    return { entries: 365, startDate: iso(start), today: iso(today) };
  };

  // ── Second demo set — 12 distinct dominant emotions across the year ──
  // Produces a different ceremony result per month: no dominant repeats.
  // Mapping (month → dominant):
  //   Jan hopeful · Feb heartbroken · Mar restless · Apr grateful ·
  //   May passionate · Jun content · Jul alive · Aug moved ·
  //   Sep yearning · Oct frustrated · Nov tender · Dec calm
  window._DEV.demoAnnualAlt = function(year){
    year = year || new Date().getFullYear();
    var pad = function(n){ return String(n).padStart(2,'0'); };
    var iso = function(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); };

    // Each month: first item is the guaranteed dominant (weighted heaviest),
    // then three supporting emotions from diverse groups for 3-layer weave variety.
    var monthEmos = [
      ['hopeful',     'quiet',       'searching',  'inspired'],   // Jan — a soft turn
      ['heartbroken', 'tender',      'exhausted',  'vulnerable'], // Feb — valentine shadow
      ['restless',    'foggy',       'bored',      'yearning'],   // Mar — end-of-winter itch
      ['grateful',    'light',       'moved',      'calm'],       // Apr — birthday bloom
      ['passionate',  'alive',       'focused',    'nervous'],    // May — bloom hot
      ['content',     'relaxed',     'certain',    'grateful'],   // Jun — settled
      ['alive',       'passionate',  'inspired',   'light'],      // Jul — midsummer full
      ['moved',       'tender',      'ashamed',    'yearning'],   // Aug — tender late warmth
      ['yearning',    'sad',         'searching',  'lonely'],     // Sep — autumn longing
      ['frustrated',  'hard',        'upset',      'livid'],      // Oct — season turn
      ['tender',      'grateful',    'heavy',      'moved'],      // Nov — gratitude with weight
      ['calm',        'hopeful',     'quiet',      'relaxed']     // Dec — year-end peace
    ];
    // Weight the first pool item so it always wins dominance (dominant ≈ 60%, rest split ~20/13/7)
    var emoWeights = [0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,3,3];

    var today = new Date();
    var start = new Date(today); start.setDate(start.getDate() - 364); // rolling window, same as demoAnnual
    var daysInYear = 365;

    var logged = [], entries = [];
    for (var i = 0; i < daysInYear; i++) {
      var d = new Date(start); d.setDate(start.getDate() + i);
      var date = iso(d);
      logged.push(date);
      var mIdx = d.getMonth();
      var pool = monthEmos[mIdx];
      // deterministic but non-mechanical pick
      var lseed = (((d.getDate() * 2654435761) ^ (mIdx * 40503) ^ (year * 2246822519)) + 12345) >>> 0;
      var r = ((lseed >> 12) ^ (lseed >> 6)) % emoWeights.length;
      var emo = pool[emoWeights[r]];
      entries.push({day: i+1, date: date, emo: emo, intent:'carry-forward', text: 'day '+(i+1)+' — '+emo+'.', ts: d.getTime()});
    }

    localStorage.setItem('gc_user', JSON.stringify({name:'Dev', birthday:'04-25', email:'d@test'}));
    localStorage.setItem('gc_onboard_seen', '1');
    localStorage.setItem('gc_start_date', iso(start));
    localStorage.setItem('gc_logged_dates', JSON.stringify(logged));
    localStorage.setItem('gc_logged_today', today.toDateString());
    localStorage.setItem('gc_day', String(logged.length));
    localStorage.setItem('gc_entries', JSON.stringify(entries));
    localStorage.setItem('gc_birthday_knots', '[]');
    // clear any seen-ceremony flags so each month can replay fresh
    for (var m = 0; m < 12; m++) {
      localStorage.removeItem('gc_ceremony_seen_'+year+'-'+pad(m+1));
      localStorage.removeItem('gc_portrait_seen_'+year+'-'+pad(m+1));
    }
    localStorage.removeItem('gc_year_complete_'+year);
    localStorage.removeItem('gc_annual_pending');

    // summary: confirm every month has a distinct dominant
    var summary = [];
    for (var mi = 0; mi < 12; mi++){
      var ct = {};
      entries.filter(function(e){ return e.date.slice(5,7) === pad(mi+1); })
             .forEach(function(e){ ct[e.emo] = (ct[e.emo]||0)+1; });
      var top = Object.keys(ct).sort(function(a,b){ return ct[b]-ct[a]; })[0] || '—';
      summary.push(pad(mi+1)+': '+top);
    }
    return { entries: entries.length, startDate: iso(start), monthDominants: summary };
  };

  // ── Third demo set — wave-based month shape ──
  // Each month has an early / mid / late emotional phase. The mid week
  // carries the month's dominant heaviest; the edges add arc and variance.
  // 12 new distinct dominants — none shared with demoAnnual or demoAnnualAlt:
  //   Jan ashamed · Feb lonely · Mar anxious · Apr inspired · May focused ·
  //   Jun certain · Jul relaxed · Aug light · Sep sad · Oct overwhelmed ·
  //   Nov vulnerable · Dec bored
  window._DEV.demoAnnualWaves = function(year){
    year = year || new Date().getFullYear();
    var pad = function(n){ return String(n).padStart(2,'0'); };
    var iso = function(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); };

    // [earlyPool, midDominant+supports, latePool] — the mid anchor is pool[0]
    var phases = [
      // Jan — new-year weight; ashamed middle, dims toward hopeful
      [['heavy','quiet','tender'],   ['ashamed','disappointed','insecure','exhausted'], ['hopeful','calm','grateful']],
      // Feb — winter isolation; lonely middle, ends tender
      [['quiet','numb','foggy'],     ['lonely','sad','yearning','heartbroken'],         ['tender','moved','grateful']],
      // Mar — season shift; anxious middle
      [['restless','foggy','numb'],  ['anxious','nervous','overwhelmed','frustrated'],  ['hopeful','alive','moved']],
      // Apr — bloom; inspired middle
      [['hopeful','calm','tender'],  ['inspired','alive','passionate','grateful'],      ['focused','light','content']],
      // May — clarity; focused middle
      [['calm','content','relaxed'], ['focused','certain','inspired','alive'],          ['passionate','grateful','moved']],
      // Jun — summer fullness; certain middle
      [['relaxed','content','calm'], ['certain','focused','grateful','alive'],          ['passionate','light','moved']],
      // Jul — midsummer ease; relaxed middle
      [['alive','light','content'],  ['relaxed','calm','grateful','tender'],            ['moved','hopeful','passionate']],
      // Aug — late-summer warmth; light middle
      [['tender','grateful','calm'], ['light','alive','moved','passionate'],            ['yearning','searching','nervous']],
      // Sep — autumn grief / return; sad middle
      [['quiet','tender','moved'],   ['sad','yearning','lonely','heartbroken'],         ['searching','restless','foggy']],
      // Oct — year pressure; overwhelmed middle
      [['foggy','restless','numb'],  ['overwhelmed','anxious','frustrated','heavy'],    ['hard','livid','upset']],
      // Nov — tenderness / thanksgiving; vulnerable middle
      [['grateful','moved','tender'],['vulnerable','tender','ashamed','yearning'],      ['hopeful','quiet','calm']],
      // Dec — winter quiet; bored middle
      [['quiet','calm','foggy'],     ['bored','numb','restless','lost'],                ['hopeful','tender','content']]
    ];

    var today = new Date();
    var start = new Date(year, 0, 1);
    var daysInYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;

    var logged = [], entries = [];
    for (var i = 0; i < daysInYear; i++) {
      var d = new Date(start); d.setDate(start.getDate() + i);
      var date = iso(d);
      logged.push(date);

      var mIdx = d.getMonth();
      var dayOfMonth = d.getDate();
      var daysInMonth = new Date(d.getFullYear(), mIdx+1, 0).getDate();
      var phase = phases[mIdx];

      // phase weighting by position in month (early third / mid third / late third)
      // mid third leans hardest on pool[0] (the month's dominant)
      var third = dayOfMonth / daysInMonth;
      var pool, weights;
      if (third < 0.20) {
        pool = phase[0]; // early (days 1-6 of 30)
        weights = [0,0,1,1,2,2];
      } else if (third > 0.80) {
        pool = phase[2]; // late (days 25-30)
        weights = [0,0,1,1,2,2];
      } else {
        pool = phase[1]; // mid (days 7-24) — wider window, stronger dominant
        // pool[0] ≈ 70%, pool[1] ≈ 20%, pool[2] ≈ 6%, pool[3] ≈ 4%
        weights = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,2,2,3];
      }
      // deterministic LCG pick keyed on day+month+year
      var lseed = (((d.getDate() * 2654435761) ^ (mIdx * 40503) ^ (year * 374761393)) + 2166136261) >>> 0;
      var r = ((lseed >> 11) ^ (lseed >> 5)) % weights.length;
      var emo = pool[weights[r]] || pool[0];
      entries.push({day: i+1, date: date, emo: emo, intent:'carry-forward', text: 'day '+(i+1)+' — '+emo+'.', ts: d.getTime()});
    }

    localStorage.setItem('gc_user', JSON.stringify({name:'Dev', birthday:'04-25', email:'d@test'}));
    localStorage.setItem('gc_onboard_seen', '1');
    localStorage.setItem('gc_start_date', iso(start));
    localStorage.setItem('gc_logged_dates', JSON.stringify(logged));
    localStorage.setItem('gc_logged_today', today.toDateString());
    localStorage.setItem('gc_day', String(logged.length));
    localStorage.setItem('gc_entries', JSON.stringify(entries));
    localStorage.setItem('gc_birthday_knots', '[]');
    for (var m = 0; m < 12; m++) {
      localStorage.removeItem('gc_ceremony_seen_'+year+'-'+pad(m+1));
      localStorage.removeItem('gc_portrait_seen_'+year+'-'+pad(m+1));
    }
    localStorage.removeItem('gc_year_complete_'+year);
    localStorage.removeItem('gc_annual_pending');

    var summary = [];
    for (var mi = 0; mi < 12; mi++){
      var ct = {};
      entries.filter(function(e){ return e.date.slice(5,7) === pad(mi+1); })
             .forEach(function(e){ ct[e.emo] = (ct[e.emo]||0)+1; });
      var top = Object.keys(ct).sort(function(a,b){ return ct[b]-ct[a]; })[0] || '—';
      summary.push(pad(mi+1)+': '+top);
    }
    return { entries: entries.length, startDate: iso(start), monthDominants: summary };
  };

  // ── Step through any month's ceremony by stubbing Date to that month-end ──
  // Usage: _DEV.playCeremony(2026, 6)  → fires the July 2026 ceremony.
  // Restores real Date when the overlay closes.
  window._DEV.playCeremony = function(year, monthNum){
    year = year || new Date().getFullYear();
    monthNum = monthNum || (new Date().getMonth() + 1);
    var pad = function(n){ return String(n).padStart(2,'0'); };
    var lastDay = new Date(year, monthNum, 0).getDate();
    var stubISO = year+'-'+pad(monthNum)+'-'+pad(lastDay)+'T23:00:00';
    var Real = window.__RealDate || Date;
    window.__RealDate = Real;
    var Stub = function(){
      if(arguments.length===0) return new Real(stubISO);
      return new (Function.prototype.bind.apply(Real, [null].concat(Array.from(arguments))));
    };
    Stub.now = function(){ return new Real(stubISO).getTime(); };
    Stub.parse = Real.parse;
    Stub.UTC = Real.UTC;
    Stub.prototype = Real.prototype;
    window.Date = Stub;
    localStorage.removeItem('gc_ceremony_seen_'+year+'-'+pad(monthNum));
    if(typeof showMonthEndCeremony === 'function') showMonthEndCeremony();
    return 'stubbed to '+stubISO;
  };
}

// check for unlocked capsules on app load
setTimeout(function(){
  if(typeof _checkCapsuleNotifications === 'function') _checkCapsuleNotifications();
}, 500);
