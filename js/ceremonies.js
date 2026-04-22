// ═══ MILESTONES — fifths of the year ═══════════════
const MILESTONES = [7, 100, 200, 250, 300];
const MILESTONES_SET = new Set(MILESTONES);

// ═══ BIRTHSTONES — one gem per birth month, lights the birthday knot ═══
// halo: outer-glow rgb, core: inner-glow rgb, dot: center-dot hex
const BIRTHSTONES = {
  '01': {name:'garnet',     halo:'185,60,80',    core:'220,90,110',   dot:'#d95674'},
  '02': {name:'amethyst',   halo:'140,110,200',  core:'170,140,220',  dot:'#a684da'},
  '03': {name:'aquamarine', halo:'130,200,220',  core:'170,225,240',  dot:'#a0dcea'},
  '04': {name:'diamond',    halo:'255,255,255',  core:'255,255,255',  dot:'#ffffff'},
  '05': {name:'emerald',    halo:'70,180,120',   core:'110,210,150',  dot:'#50c288'},
  '06': {name:'pearl',      halo:'245,230,220',  core:'255,250,245',  dot:'#fff5ea'},
  '07': {name:'ruby',       halo:'200,40,60',    core:'230,80,90',    dot:'#dc4860'},
  '08': {name:'peridot',    halo:'160,200,70',   core:'200,230,110',  dot:'#bce070'},
  '09': {name:'sapphire',   halo:'60,100,200',   core:'100,140,220',  dot:'#5478dc'},
  '10': {name:'opal',       halo:'220,180,220',  core:'250,210,230',  dot:'#f0b4d2'},
  '11': {name:'topaz',      halo:'220,160,60',   core:'250,200,100',  dot:'#e6a840'},
  '12': {name:'turquoise',  halo:'80,180,190',   core:'120,210,215',  dot:'#50c0c8'}
};
function _getBirthstone(){
  try{
    var u = JSON.parse(localStorage.getItem('gc_user')||'{}');
    var mm = (u.birthday||'').split('-')[0] || '04';
    return BIRTHSTONES[mm] || BIRTHSTONES['04'];
  }catch(e){ return BIRTHSTONES['04']; }
}
function _getBirthMonth(){
  try{
    var u = JSON.parse(localStorage.getItem('gc_user')||'{}');
    return (u.birthday||'').split('-')[0] || '04';
  }catch(e){ return '04'; }
}

// ═══ BIRTHSTONE GIFT MESSAGES — what the stone offers you this year ═══
// Shown on the birthday ceremony that fires after the birthday entry is logged.
// "line" — the poetic gift. "meaning" — a second, quieter line beneath.
const BIRTHSTONE_GIFT = {
  '01': {line:'may the garnet steady you.',        meaning:'grounded. unhurried. here.'},
  '02': {line:'may the amethyst quiet the noise.', meaning:'clarity where there was clutter.'},
  '03': {line:'may the aquamarine hold your calm.',meaning:'like water that has been still a long time.'},
  '04': {line:'may the diamond mark this.',         meaning:'what you built is unbreakable now.'},
  '05': {line:'may the emerald keep you rooted.',   meaning:'growth that does not forget the ground.'},
  '06': {line:'may the pearl remember what held you.', meaning:'quiet layers. patient light.'},
  '07': {line:'may the ruby keep you burning.',     meaning:'the heat is not a warning. it is a sign of life.'},
  '08': {line:'may the peridot carry your light.',  meaning:'a small sun you can set down anywhere.'},
  '09': {line:'may the sapphire keep your truth.',  meaning:'what you know, even when no one is asking.'},
  '10': {line:'may the opal hold every color of this year.', meaning:'grief and joy side by side. both real.'},
  '11': {line:'may the topaz warm what\u2019s ahead.', meaning:'the year turns. you are already in it.'},
  '12': {line:'may the turquoise keep you whole.',  meaning:'held at the edges. unbroken.'}
};

// ═══ VISUAL EMPHASIS — 4 evenly-spaced brighter knots on the ring (20/40/60/80%)
// Decoupled from MILESTONES so the ceremony logic stays on 7/100/200/250/300 but
// the closed-ring visual reads symmetrically. Today's knot is emphasized separately.
const VISUAL_EMPHASIS_DAYS = [73, 146, 219, 292];
const VISUAL_EMPHASIS_SET = new Set(VISUAL_EMPHASIS_DAYS);
const MS_WHISPERS = {
  7:   'seven mornings. something is beginning.',
  100: 'a hundred. quiet and unbroken.',
  200: 'two hundred mornings. you kept the promise.',
  250: 'past the midpoint. the necklace knows.',
  300: 'three hundred. the circle is almost whole.',
};
const MS_INSIGHTS = {
  7:   'Seven mornings in a row. Most people never make it this far. Not because they don\'t want to \u2014 because wanting isn\'t the same as returning. You returned.',
  100: 'One hundred mornings. Think about what else you did a hundred times this year. Almost nothing. This is the exception. You made it one.',
  200: 'Two hundred days of choosing this over choosing nothing. That is not discipline. That is identity. You are someone who comes back.',
  250: 'Two hundred and fifty. The necklace is more than two-thirds complete. What you built here cannot be taken back \u2014 even if you stop, these mornings already happened.',
  300: 'Three hundred mornings. Sixty-five to go. You are close enough now that the end is not abstract. The circle has almost found itself.',
};

function runMilestone(day, onDone){
  $('msNumber').textContent = day;
  $('msDays').textContent = 'mornings';
  $('msWhisper').textContent = MS_WHISPERS[day] || `day ${day}`;
  $('msNumber').classList.remove('vis');
  $('msDays').classList.remove('vis');
  $('msWhisper').classList.remove('vis');
  // msAgent removed
  $('msInsight').classList.remove('vis');
  $('msTap').classList.remove('vis');
  $('msInsight').textContent = MS_INSIGHTS[day] || '';
  // transition to milestone from whatever screen we're on
  document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});
  $('s-milestone').classList.add('active');

  const cv = $('msCanvas');
  const ctx = cv.getContext('2d');
  const dpr = Math.min(devicePixelRatio||1, 2);
  let W, H, cx, cy;
  function resize(){
    W=innerWidth;H=innerHeight;cx=W/2;cy=H*0.35;
    cv.width=W*dpr;cv.height=H*dpr;
    cv.style.width=W+'px';cv.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();

  // Cap the ring radius on wide viewports so the ring stays phone-proportioned.
  // On iPad Air the default (min(W,H)*0.34 ≈ 280px) grows the ring large enough
  // that the ms-bottom text block (anchored at top:58%) renders inside it,
  // overlapping the circle outline. A ~220px max keeps the text below the ring.
  const RING_R = Math.min(Math.min(W,H) * 0.34, 220);
  const STRANDS = 4;
  const TWIST_FREQ = 0.08;
  const TWIST_AMP = 4;
  let frame = 0;
  let phase = 'gather';
  let phaseTime = 0;
  let gatherProgress = 0;
  let particles = [];
  let running = true;
  let rotation = 0;

  function spawnRingParticles(count){
    for(let i=0;i<count;i++){
      const angle = Math.random()*Math.PI*2;
      const dist = RING_R + (Math.random()-0.5)*60;
      particles.push({
        x:cx+Math.cos(angle)*dist, y:cy+Math.sin(angle)*dist,
        vx:(Math.random()-.5)*.6, vy:(Math.random()-.5)*.6,
        life:1, decay:1/(100+Math.random()*100),
        size:1+Math.random()*2.5,
        color:['#e6b658','#fff5cc','#fffdf5','#c9943a'][Math.floor(Math.random()*4)]
      });
    }
  }

  function drawRing(progress, glowIntensity){
    const arcEnd = progress * Math.PI * 2;
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(rotation);
    if(glowIntensity > 0){
      // outer warm haze
      const g0 = ctx.createRadialGradient(0,0,RING_R*0.3, 0,0,RING_R*2.2);
      g0.addColorStop(0, `rgba(230,182,88,${0.12*glowIntensity})`);
      g0.addColorStop(0.4, `rgba(201,148,58,${0.08*glowIntensity})`);
      g0.addColorStop(1, 'rgba(201,148,58,0)');
      ctx.fillStyle=g0;
      ctx.beginPath();ctx.arc(0,0,RING_R*2.2,0,Math.PI*2);ctx.fill();
      // inner white-hot glow
      const g1 = ctx.createRadialGradient(0,0,RING_R*0.8, 0,0,RING_R*1.3);
      g1.addColorStop(0, `rgba(255,255,255,${0.06*glowIntensity})`);
      g1.addColorStop(0.5, `rgba(230,182,88,${0.15*glowIntensity})`);
      g1.addColorStop(1, 'rgba(201,148,58,0)');
      ctx.fillStyle=g1;
      ctx.beginPath();ctx.arc(0,0,RING_R*1.3,0,Math.PI*2);ctx.fill();
    }
    // strands — thicker, more luminous on dark
    for(let s=0;s<STRANDS;s++){
      const sPhase = (s/STRANDS)*Math.PI*2;
      const isHighlight = s===0 || s===2;
      ctx.beginPath();
      const steps = Math.floor(arcEnd / (Math.PI*2) * 120);
      for(let i=0;i<=steps;i++){
        const a = (i/120)*Math.PI*2 - Math.PI/2;
        const twist = Math.sin(i*TWIST_FREQ + sPhase + frame*0.02)*TWIST_AMP;
        const r = RING_R + twist;
        const x = Math.cos(a)*r;
        const y = Math.sin(a)*r;
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.strokeStyle = isHighlight ? '#e6b658' : '#c9943a';
      ctx.globalAlpha = isHighlight ? 1 : 0.65;
      ctx.lineWidth = isHighlight ? 2.5 : 1.8;
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(230,182,88,0.4)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowColor = 'transparent';ctx.shadowBlur = 0;
    }
    ctx.beginPath();
    const hSteps = Math.floor(arcEnd / (Math.PI*2) * 120);
    for(let i=0;i<=hSteps;i++){
      const a = (i/120)*Math.PI*2 - Math.PI/2;
      const r = RING_R - TWIST_AMP*0.5;
      const x = Math.cos(a)*r;
      const y = Math.sin(a)*r;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.strokeStyle='#fff5dd';ctx.globalAlpha=0.2;ctx.lineWidth=0.8;ctx.stroke();
    ctx.globalAlpha=1;
    ctx.restore();
  }

  function drawParticles(){
    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i];
      p.x+=p.vx;p.y+=p.vy;p.life-=p.decay;
      if(p.life<=0){particles.splice(i,1);continue}
      ctx.fillStyle=p.color;ctx.globalAlpha=p.life*0.8;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill();
      if(p.size>1.8&&p.life>0.3){
        const sz=p.size*p.life;
        ctx.strokeStyle=p.color;ctx.lineWidth=0.4;
        ctx.beginPath();ctx.moveTo(p.x-sz,p.y);ctx.lineTo(p.x+sz,p.y);
        ctx.moveTo(p.x,p.y-sz);ctx.lineTo(p.x,p.y+sz);ctx.stroke();
      }
    }
    ctx.globalAlpha=1;
  }

  function tick(){
    if(!running) return;
    frame++;phaseTime+=1/60;
    ctx.clearRect(0,0,W,H);
    // dark background
    ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--canvas-bg').trim()||'#0e0b07';ctx.fillRect(0,0,W,H);

    if(phase==='gather'){
      gatherProgress = Math.min(1, phaseTime/1.2); // 1.2s to form the circle — fast trace
      const ease = 1-Math.pow(1-gatherProgress,3);
      drawRing(ease, ease*0.5);
      drawParticles();
      if(frame%3===0) spawnRingParticles(2);
      if(gatherProgress>=1){phase='blaze';phaseTime=0;spawnRingParticles(60)}
    }
    else if(phase==='blaze'){
      const blazeIntensity = phaseTime < 1 ? Math.min(1,phaseTime/0.5) : 1;
      rotation += 0.0005;
      drawRing(1, blazeIntensity);
      drawParticles();
      if(frame%4===0) spawnRingParticles(2);
      // timed reveal sequence (no agent label — the insight speaks for itself)
      if(phaseTime>0.8) $('msNumber').classList.add('vis');
      if(phaseTime>1.2) $('msDays').classList.add('vis');
      if(phaseTime>2.0) $('msWhisper').classList.add('vis');
      if(phaseTime>3.0) $('msInsight').classList.add('vis');
      if(phaseTime>5.5){phase='rest';phaseTime=0;$('msTap').classList.add('vis')}
    }
    else if(phase==='rest'){
      rotation += 0.0005;
      const pulse = 0.7+0.3*Math.sin(phaseTime*1.5);
      drawRing(1, pulse);
      drawParticles();
      if(frame%10===0) spawnRingParticles(1);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // tap to dismiss and continue to the normal slither
  const dismiss = ()=>{
    if(phase!=='rest') return;
    running = false;
    $('s-milestone').removeEventListener('click', dismiss);
    $('msNumber').classList.remove('vis');
    $('msDays').classList.remove('vis');
    $('msWhisper').classList.remove('vis');
    // msAgent removed
    $('msInsight').classList.remove('vis');
    $('msTap').classList.remove('vis');
    setTimeout(()=> onDone(), 400);
  };
  $('s-milestone').addEventListener('click', dismiss);
}

// ═══ BIRTHDAY CEREMONY ════════════════════════════════
// Fires after the birthday entry is logged + lands on the chain. A brief,
// private gift: the birthstone lights the screen, the gift line fades in,
// a quieter meaning follows, tap to continue. One fire per birthday year
// (guarded by gc_birthday_ceremony_seen_YYYY).
function runBirthdayCeremony(onDone){
  var bs   = _getBirthstone();
  var mm   = _getBirthMonth();
  var gift = BIRTHSTONE_GIFT[mm] || BIRTHSTONE_GIFT['04'];
  var age  = (birthYear > 0) ? (new Date().getFullYear() - birthYear) : null;

  var overlay = document.createElement('div');
  overlay.id = 'birthdayCeremonyOverlay';
  overlay.style.cssText = [
    'position:fixed','inset:0','z-index:220',
    'background:rgba(7,5,3,0)','transition:background 1200ms ease',
    'display:flex','flex-direction:column','align-items:center','justify-content:flex-start',
    'padding:max(48px,env(safe-area-inset-top)) 28px max(32px,env(safe-area-inset-bottom))',
    'gap:0','cursor:default','overflow:hidden','box-sizing:border-box'
  ].join(';');

  // ── age line (top) ──
  var ageLine = document.createElement('p');
  ageLine.style.cssText = 'font-family:"DM Mono",monospace;font-size:10px;letter-spacing:0.2em;color:rgba(201,148,58,0.5);text-transform:lowercase;margin:0;opacity:0;transition:opacity 900ms ease;text-align:center';
  ageLine.textContent = (age!==null) ? ('the chain marks '+age+' years of you') : 'the chain marks another year of you';
  overlay.appendChild(ageLine);

  // ── spacer before ring ──
  var s1 = document.createElement('div'); s1.style.cssText='flex:0 0 28px'; overlay.appendChild(s1);

  // ── canvas: ring trace + stone glow ──
  var cv = document.createElement('canvas');
  var dpr = Math.min(window.devicePixelRatio||1, 2);
  var SIZE = 300;
  cv.style.cssText = 'display:block;width:'+SIZE+'px;height:'+SIZE+'px;pointer-events:none;flex-shrink:0';
  cv.width = SIZE*dpr; cv.height = SIZE*dpr;
  var ctx = cv.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  overlay.appendChild(cv);

  // ── spacer after ring ──
  var s2 = document.createElement('div'); s2.style.cssText='flex:0 0 20px'; overlay.appendChild(s2);

  // ── stone name ──
  var stoneName = document.createElement('p');
  stoneName.style.cssText = 'font-family:"Fraunces",serif;font-style:italic;font-weight:300;font-size:40px;color:rgba('+bs.core+',0.95);letter-spacing:-0.01em;margin:0;opacity:0;transition:opacity 1000ms ease;text-align:center;line-height:1';
  stoneName.textContent = bs.name;
  overlay.appendChild(stoneName);

  var rule = document.createElement('div');
  rule.style.cssText = 'width:44px;height:1px;background:linear-gradient(90deg,transparent,rgba('+bs.halo+',0.75),transparent);opacity:0;transition:opacity 700ms ease;margin:14px 0';
  overlay.appendChild(rule);

  var giftLine = document.createElement('p');
  giftLine.style.cssText = 'font-family:"Fraunces",serif;font-style:italic;font-weight:300;font-size:20px;color:rgba(245,237,224,0.88);line-height:1.5;max-width:320px;margin:0;opacity:0;transition:opacity 1100ms ease;text-align:center';
  giftLine.textContent = gift.line;
  overlay.appendChild(giftLine);

  var meaning = document.createElement('p');
  meaning.style.cssText = 'font-family:"Fraunces",serif;font-style:italic;font-weight:300;font-size:14px;color:rgba(245,237,224,0.5);line-height:1.65;max-width:300px;margin:10px 0 0;opacity:0;transition:opacity 1000ms ease;text-align:center';
  meaning.textContent = gift.meaning;
  overlay.appendChild(meaning);

  // ── push tap-hint to the bottom ──
  var spacer = document.createElement('div');
  spacer.style.cssText = 'flex:1 1 auto';
  overlay.appendChild(spacer);

  var tapHint = document.createElement('p');
  tapHint.style.cssText = 'font-family:"DM Mono",monospace;font-size:9px;letter-spacing:0.22em;color:rgba(201,148,58,0.4);text-transform:lowercase;margin:0;opacity:0;transition:opacity 600ms ease;text-align:center';
  tapHint.textContent = 'tap to continue';
  overlay.appendChild(tapHint);

  document.body.appendChild(overlay);

  // ── animation ──
  var cx = SIZE/2, cy = SIZE/2, R = 112;
  var start = performance.now();
  var running = true;
  function tick(now){
    if(!running) return;
    var t = (now - start) / 1000;
    ctx.clearRect(0,0,SIZE,SIZE);

    // ring trace — 1.2s from -π/2 clockwise
    var ringP = Math.max(0, Math.min(1, t / 1.2));
    if(ringP > 0){
      var sa = -Math.PI/2;
      var ea = sa + ringP * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, R, sa, ea);
      ctx.strokeStyle = 'rgba('+bs.halo+',0.55)';
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      ctx.stroke();
      // soft underglow
      ctx.beginPath();
      ctx.arc(cx, cy, R, sa, ea);
      ctx.strokeStyle = 'rgba('+bs.core+',0.15)';
      ctx.lineWidth = 8;
      ctx.stroke();
    }

    // stone reveal at center — fades in after t=0.8
    var stoneP = Math.max(0, Math.min(1, (t - 0.8) / 0.8));
    if(stoneP > 0){
      var pulse = 1 + 0.08 * Math.sin(t * Math.PI * 0.9);
      // outer halo
      var h = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80*pulse);
      h.addColorStop(0, 'rgba('+bs.halo+','+(0.35*stoneP)+')');
      h.addColorStop(0.5, 'rgba('+bs.core+','+(0.18*stoneP)+')');
      h.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = h;
      ctx.beginPath(); ctx.arc(cx, cy, 80*pulse, 0, Math.PI*2); ctx.fill();
      // core glow
      var c = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22*pulse);
      c.addColorStop(0, 'rgba('+bs.core+','+(0.9*stoneP)+')');
      c.addColorStop(1, 'rgba('+bs.core+',0)');
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(cx, cy, 22*pulse, 0, Math.PI*2); ctx.fill();
      // 4 star rays
      ctx.strokeStyle = 'rgba(255,255,255,'+(0.55*stoneP)+')';
      ctx.lineWidth = 1.1;
      var rl = 30*pulse;
      ctx.beginPath(); ctx.moveTo(cx-rl,cy); ctx.lineTo(cx+rl,cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,cy-rl); ctx.lineTo(cx,cy+rl); ctx.stroke();
      // the stone (solid dot)
      ctx.fillStyle = bs.dot;
      ctx.globalAlpha = stoneP;
      ctx.beginPath(); ctx.arc(cx, cy, 8.5*pulse, 0, Math.PI*2); ctx.fill();
      // white highlight
      ctx.fillStyle = 'rgba(255,255,255,'+(0.85*stoneP)+')';
      ctx.beginPath(); ctx.arc(cx-2.2, cy-2.2, 2.4*pulse, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // lift veil
  requestAnimationFrame(function(){
    overlay.style.background = 'rgba(7,5,3,0.96)';
  });
  // stagger text
  setTimeout(function(){ ageLine.style.opacity = '1'; }, 1500);
  setTimeout(function(){ stoneName.style.opacity = '1'; }, 2200);
  setTimeout(function(){ rule.style.opacity = '1'; }, 2700);
  setTimeout(function(){ giftLine.style.opacity = '1'; }, 3000);
  setTimeout(function(){ meaning.style.opacity = '1'; }, 3800);
  setTimeout(function(){ tapHint.style.opacity = '1'; overlay.style.cursor = 'pointer'; }, 5200);

  function dismiss(){
    if(!running) return;
    overlay.removeEventListener('click', dismiss);
    // fade the text + ring + overlay background — but keep the stone visible so
    // it can fly to its permanent home on the chain.
    ageLine.style.opacity = stoneName.style.opacity = rule.style.opacity =
      giftLine.style.opacity = meaning.style.opacity = tapHint.style.opacity = '0';
    overlay.style.transition = 'background 800ms ease';
    overlay.style.background = 'rgba(7,5,3,0)';

    // ── lift the stone into its own DOM element and fly it to the birthday knot ──
    var cvRect = cv.getBoundingClientRect();
    var startX = cvRect.left + cvRect.width/2;
    var startY = cvRect.top  + cvRect.height/2;

    var flyer = document.createElement('div');
    flyer.style.cssText = [
      'position:fixed',
      'left:'+(startX-18)+'px','top:'+(startY-18)+'px',
      'width:36px','height:36px','border-radius:50%',
      'pointer-events:none','z-index:240',
      'background:radial-gradient(circle at 50% 50%, rgba('+bs.core+',0.95) 0%, rgba('+bs.halo+',0.45) 45%, rgba('+bs.halo+',0) 75%)',
      'box-shadow:0 0 30px 4px rgba('+bs.halo+',0.45)',
      'transition:left 1500ms cubic-bezier(.4,.2,.2,1), top 1500ms cubic-bezier(.4,.2,.2,1), transform 1500ms cubic-bezier(.4,.2,.2,1), opacity 600ms ease 1200ms',
      'transform:scale(1)','opacity:1'
    ].join(';');
    // a white center dot so it reads as a cut gem in flight
    var core = document.createElement('div');
    core.style.cssText = 'position:absolute;left:50%;top:50%;width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.95);transform:translate(-50%,-50%);box-shadow:0 0 6px 2px rgba(255,255,255,0.5)';
    flyer.appendChild(core);
    document.body.appendChild(flyer);

    // ring fade as stone lifts off — fade on the canvas separately
    cv.style.transition = 'opacity 500ms ease';
    cv.style.opacity = '0';

    // compute target: today's knot on the chain (the entry that was just logged —
    // which on a birthday IS the birthday knot). Using today's position means
    // the gem settles onto whatever knot is currently pulsing.
    setTimeout(function(){
      var targetPt = null;
      try{
        // Prefer the live today-knot position (already in canvas-local coords).
        if(typeof window._getTodayKnotPos === 'function'){
          var tpt = window._getTodayKnotPos();
          var splashCanvas = document.querySelector('#s-splash canvas');
          if(tpt && splashCanvas){
            var rect = splashCanvas.getBoundingClientRect();
            targetPt = { x: rect.left + tpt.x, y: rect.top + tpt.y };
          }
        }
        // Fallback: derive today's day number from start date and look it up.
        if(!targetPt && typeof window._getKnotPosForDay === 'function'){
          var sd = new Date(localStorage.getItem('gc_start_date') || new Date());
          var today = new Date();
          var diffMs = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                     - new Date(sd.getFullYear(), sd.getMonth(), sd.getDate());
          var dayNumber = Math.round(diffMs / 86400000) + 1;
          targetPt = window._getKnotPosForDay(dayNumber);
        }
      }catch(e){}
      if(!targetPt){
        // last-resort fallback: splash-screen center
        var sp = document.getElementById('s-splash');
        if(sp){
          var r = sp.getBoundingClientRect();
          targetPt = { x: r.left + r.width/2, y: r.top + r.height*0.72 };
        } else {
          targetPt = { x: startX, y: startY };
        }
      }
      // start the tween
      flyer.style.left = (targetPt.x - 18) + 'px';
      flyer.style.top  = (targetPt.y - 18) + 'px';
      flyer.style.transform = 'scale(0.5)';
      flyer.style.opacity = '0.1';
    }, 150);

    // remove overlay once the background has faded
    setTimeout(function(){
      if(overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 900);

    // clean up the flyer and finalise
    setTimeout(function(){
      running = false;
      if(flyer.parentNode) flyer.parentNode.removeChild(flyer);
      if(typeof onDone === 'function') onDone();
    }, 2000);
  }
  overlay.addEventListener('click', dismiss);
  // auto-dismiss after 12s if the user lingers
  setTimeout(function(){ if(running) dismiss(); }, 12000);
}

// runPostSequence removed — slither animation replaced by flyKnotToChain
// ═══════════════════════════════════════════════════════
// GOLDEN THREAD CHAIN — canvas rendering system
// ═══════════════════════════════════════════════════════

