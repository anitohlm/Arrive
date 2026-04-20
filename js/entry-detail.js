// ═══ ENTRY DETAIL OVERLAY ══════════════════════════
(function(){
  // create the overlay element
  var overlay = document.createElement('div');
  overlay.className = 'entry-detail';
  overlay.id = 'entryDetail';
  overlay.innerHTML = '<div class="entry-detail-inner" id="entryDetailInner"></div>';
  document.body.appendChild(overlay);

  overlay.addEventListener('click', function(e){
    if(e.target === overlay) closeEntryDetail();
  });

  window.openEntryDetail = function(entry){
    var inner = $('entryDetailInner');
    var html = '';
    html += '<button class="ed-close" onclick="closeEntryDetail()">← back</button>';
    // header: emotion icon + name
    html += '<div class="ed-header">';
    if(entry.emo) html += '<img class="ed-emo-icon" src="assets/logogchain.svg" alt="'+entry.emo+'">';
    html += '<div><div class="ed-emo-name">'+(entry.emo||'')+'</div>';
    html += '<div class="ed-day">DAY '+String(entry.day).padStart(3,'0')+' \u00B7 '+(entry.date||'').toUpperCase()+'</div>';
    html += '</div></div>';
    html += '<div class="ed-rule"></div>';
    // full entry text
    html += '<div class="ed-entry">\u201C'+entry.text+'\u201D</div>';
    // AI insight
    if(entry.ai){
      html += '<div class="ed-rule"></div>';
      html += '<div class="ed-ai">'+entry.ai+'</div>';
    }
    // photos — render actual thumbnails if data present, else legacy badge
    var photos = Array.isArray(entry.photos) ? entry.photos : [];
    if(photos.length > 0){
      html += '<div class="ed-rule"></div>';
      html += '<div class="ed-photos-grid">';
      photos.forEach(function(p){
        if(p && p.dataUrl){
          html += '<img class="ed-photo" src="'+p.dataUrl+'" alt="">';
        }
      });
      html += '</div>';
    } else if(entry.hasPhotos){
      html += '<div class="ed-rule"></div>';
      html += '<div class="ed-photos"><div class="ed-badge">photos attached</div></div>';
    }
    // voice — inline audio player if data present, else legacy badge
    if(entry.voice && entry.voice.dataUrl){
      html += '<div class="ed-voice-player"><audio controls src="'+entry.voice.dataUrl+'"></audio></div>';
    } else if(entry.hasVoice){
      html += '<div class="ed-voice"><div class="ed-badge">voice memo attached</div></div>';
    }
    // badges
    html += '<div class="ed-badges">';
    if(entry.emo) html += '<span class="ed-badge">'+entry.emo+'</span>';
    if(entry.intent) html += '<span class="ed-badge">'+entry.intent+'</span>';
    html += '<span class="ed-badge">day '+entry.day+'</span>';
    html += '</div>';
    inner.innerHTML = html;
    overlay.classList.add('open');
  };

  window.closeEntryDetail = function(){
    overlay.classList.remove('open');
  };
})();

// ── golden thread chain — FULL YEAR static path with ghost knots ──
/*START_KNOT_INIT*/
try{ void function(){
  var cv=document.getElementById('splashCanvas');
  if(!cv) return;
  const ctx=cv.getContext('2d');
  let W,H,frame=0,time=0;
  var todayFillTime=hasLogged?99:-1; // -1=ghost, 0+=filling, 99=already filled on reload
  var circleCloseProgress = -1; // -1=inactive, 0→1=animating
  var _startYear = gcStartDate ? new Date(gcStartDate).getFullYear() : new Date().getFullYear();
  const TOTAL_DAYS = (_startYear%4===0&&(_startYear%100!==0||_startYear%400===0)) ? 366 : 365;

  // ── KNOT SVG IMAGE ──
  var KNOT_IMG=new Image();
  KNOT_IMG.src='assets/logogchain.svg';

  // ── NECKLACE GEOMETRY (circle, not serpentine) ──
  var NECKLACE_R, NECKLACE_CX, NECKLACE_CY;
  var allKnotPositions=[]; // pre-computed positions for all 365 days

  function resize(){
    var dpr = Math.min(window.devicePixelRatio||1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    // necklace centered, slightly above vertical center to account for nav + status
    NECKLACE_CX = W * 0.5;
    NECKLACE_CY = H * 0.42;
    NECKLACE_R  = Math.min(W, H) * 0.36;
    placeAllKnotsOnCircle();
  }

  // Day 1 starts at the bottom (6 o'clock); chain grows clockwise; Day 365 completes the shape
  function dayToAngle(dayNumber){
    var fraction = (dayNumber - 1) / 364;
    return (Math.PI / 2) + (fraction * Math.PI * 2);
  }

  // Pendant-drop silhouette.
  // Top stays fully round (pendant hoop). Bottom half narrows horizontally AND
  // extends vertically past the original circle, forming a long elegant drop.
  // cy ∈ [-1, 1], where -1 is top and +1 is bottom of the base circle.
  // Returns {widthFactor, heightFactor} to apply to the raw circle coordinates.
  function _teardropDeform(cy){
    if (cy <= 0) {
      // top half: plain circle
      return { wf: 1.0, hf: 1.0 };
    }
    var t = cy; // 0 at equator, 1 at base of the circle
    // horizontal taper — stays wide, then curls to the point
    var wf = 1 - 0.88 * Math.pow(t, 2.1);
    // vertical stretch — pushes the tip further down past the circle boundary
    var hf = 1 + 0.45 * Math.pow(t, 1.3);
    return { wf: wf, hf: hf };
  }

  // All points on the "necklace" path go through this helper so the braid,
  // the thread, the ghost outline, and the knot positions all follow the
  // same teardrop silhouette. radiusOffset lets the braid layers sit slightly
  // inside/outside the main path.
  function _deformedPoint(angle, radiusOffset){
    radiusOffset = radiusOffset || 0;
    var cx = Math.cos(angle);
    var cy = Math.sin(angle);
    var d = _teardropDeform(cy);
    var r = NECKLACE_R + radiusOffset;
    return {
      x: NECKLACE_CX + r * cx * d.wf,
      y: NECKLACE_CY + r * cy * d.hf
    };
  }

  function angleToPoint(angle){
    return _deformedPoint(angle, 0);
  }

  function placeAllKnotsOnCircle(){
    allKnotPositions = [];
    for(var d = 0; d < TOTAL_DAYS; d++){
      allKnotPositions.push(angleToPoint(dayToAngle(d + 1)));
    }
    window._allKnotPositions = allKnotPositions;
  }

  // ── SPARKLE PARTICLES ──
  const particles=[];
  const PARTICLE_COUNT=20;
  const sparkColors=['#e6b658','#fff5cc','#fffdf5','rgba(255,255,255,0.8)'];

  // ── SPARKLE RAIN — continuous downward fall across the whole canvas ──
  var rainParticles = [];
  var RAIN_POOL = 30;
  var rainSparkColors = ['#e6b658','#fff8e0','#fffdf5',
    'rgba(255,255,255,0.75)','#c9943a','rgba(230,182,88,0.6)'];

  function spawnRainParticle(){
    rainParticles.push({
      x: Math.random() * W,
      y: -8 - Math.random() * H * 0.4,
      vx: (Math.random()-0.5) * 0.28,
      vy: 0.3 + Math.random() * 0.55,
      life: 1,
      decay: 1 / (160 + Math.random()*200),
      size: 0.5 + Math.random() * 1.5,
      color: rainSparkColors[Math.floor(Math.random()*rainSparkColors.length)],
      twinkle: Math.random()*Math.PI*2
    });
  }

  function updateRainParticles(){
    while(rainParticles.length < RAIN_POOL) spawnRainParticle();
    for(var ri = rainParticles.length-1; ri >= 0; ri--){
      var rp = rainParticles[ri];
      rp.x += rp.vx; rp.y += rp.vy;
      rp.life -= rp.decay; rp.twinkle += 0.07;
      if(rp.y > H+12 || rp.life <= 0){
        rainParticles.splice(ri,1); continue;
      }
      var twink = 0.5 + 0.5*Math.sin(rp.twinkle);
      var alpha = rp.life * 0.6 * twink;
      ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = rp.color;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.size*Math.max(0.3,rp.life), 0, Math.PI*2);
      ctx.fill();
      if(rp.size > 1.1 && twink > 0.72){
        var sl = rp.size * 1.2;
        ctx.strokeStyle = rp.color; ctx.lineWidth = 0.3; ctx.globalAlpha = alpha*0.5;
        ctx.beginPath(); ctx.moveTo(rp.x-sl,rp.y); ctx.lineTo(rp.x+sl,rp.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rp.x,rp.y-sl); ctx.lineTo(rp.x,rp.y+sl); ctx.stroke();
      }
      ctx.restore();
    }
  }

  // pre-scatter rain so it doesn't all arrive at once
  for(var _ri=0; _ri<RAIN_POOL; _ri++){
    spawnRainParticle();
    rainParticles[rainParticles.length-1].y = -Math.random()*H;
  }
  function spawnParticle(cx,cy){
    const a = Math.random()*Math.PI*2;
    const dist = 3 + Math.random()*10;
    const speed = 0.015 + Math.random()*0.025;
    particles.push({
      x: cx + Math.cos(a)*dist,
      y: cy + Math.sin(a)*dist,
      vx: (Math.random()-0.5)*0.04,
      vy: -(speed),
      life: 1,
      maxLife: 12 + Math.random()*8,
      size: 0.3 + Math.random()*0.4,
      color: sparkColors[Math.floor(Math.random()*sparkColors.length)]
    });
  }
  function updateParticles(cx,cy){
    while(particles.length < PARTICLE_COUNT)
      spawnParticle(cx,cy);
    for(let i = particles.length-1; i >= 0; i--){
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.998;
      p.vy *= 0.998;
      p.life -= 1/(p.maxLife*60);
      if(p.life <= 0){
        particles.splice(i,1);
        spawnParticle(cx,cy);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.life * 0.18;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y,
        p.size * Math.max(0.1, p.life),
        0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ── GHOST OUTLINE — faint dashed full teardrop outline, always visible ──
  function drawGhostCircle(){
    ctx.save();
    ctx.beginPath();
    var steps = 180;
    for(var s = 0; s <= steps; s++){
      var a = (s / steps) * Math.PI * 2;
      var p = _deformedPoint(a, 0);
      if(s === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = 'rgba(201,148,58,0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 7]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // ── TEARDROP CLOSE — Day 365 only: fills the remaining gap from today back to Day 1 ──
  function drawCircleComplete(progress){
    var calDay = gcStartDate ? getDayNumber(todayISO()) : 1;
    var startAngle = dayToAngle(calDay);
    var endAngle   = Math.PI / 2 + Math.PI * 2; // back to Day 1
    var span = (endAngle - startAngle) * progress;
    ctx.save();
    // inner thin line
    ctx.beginPath();
    var steps = Math.max(20, Math.floor(span / (Math.PI * 2) * 180));
    for(var s = 0; s <= steps; s++){
      var a = startAngle + (s / steps) * span;
      var p = _deformedPoint(a, 0);
      if(s === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = 'rgba(201,148,58,' + (0.35 * progress) + ')';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    // wide glow along the same path
    ctx.beginPath();
    for(var s2 = 0; s2 <= steps; s2++){
      var a2 = startAngle + (s2 / steps) * span;
      var p2 = _deformedPoint(a2, 0);
      if(s2 === 0) ctx.moveTo(p2.x, p2.y);
      else ctx.lineTo(p2.x, p2.y);
    }
    ctx.strokeStyle = 'rgba(230,182,88,' + (0.15 * progress) + ')';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  // ── NECKLACE THREAD — braided path from Day 1 (clasp) to today along teardrop ──
  function drawNecklaceThread(displayDay){
    if(displayDay < 2) return;
    var startAngle = Math.PI / 2;
    var endAngle = dayToAngle(displayDay);
    var threadSteps = Math.max(displayDay * 4, 200);

    // ambient glow under the thread
    ctx.save();
    ctx.beginPath();
    for(var gs = 0; gs <= threadSteps; gs++){
      var ga = startAngle + (gs / threadSteps) * (endAngle - startAngle);
      var gp = _deformedPoint(ga, 0);
      if(gs === 0) ctx.moveTo(gp.x, gp.y);
      else ctx.lineTo(gp.x, gp.y);
    }
    ctx.strokeStyle = 'rgba(201,148,58,0.07)';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    // 3 braid layers — radial offsets, applied via _deformedPoint so offsets
    // bend along the teardrop silhouette, not straight radial from the center.
    var braids = [
      { offset: -1.5, color: '#e6b658', alpha: 0.5,  width: 0.8 },
      { offset:  0,   color: '#c9943a', alpha: 1.0,  width: 1.5 },
      { offset:  1.5, color: '#a07830', alpha: 0.4,  width: 0.8 }
    ];
    braids.forEach(function(b){
      var steps = threadSteps;
      ctx.save();
      ctx.beginPath();
      for(var s = 0; s <= steps; s++){
        var t = s / steps;
        var angle = startAngle + t * (endAngle - startAngle);
        var bp = _deformedPoint(angle, b.offset);
        if(s === 0) ctx.moveTo(bp.x, bp.y);
        else ctx.lineTo(bp.x, bp.y);
      }
      ctx.globalAlpha = b.alpha;
      ctx.strokeStyle = b.color;
      ctx.lineWidth = b.width;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    });
  }

  // ── CLASP — always the logo knot with soft glow + dashed waiting ring ──
  // The clasp is structural: it closes the necklace. It does not change.
  function drawClasp(){
    var claspAngle = Math.PI / 2;
    var pt = angleToPoint(claspAngle);
    var sz = 32;
    var g = ctx.createRadialGradient(pt.x,pt.y,0,pt.x,pt.y,sz*1.5);
    g.addColorStop(0, 'rgba(230,182,88,0.18)');
    g.addColorStop(1, 'rgba(201,148,58,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(pt.x,pt.y,sz*1.5,0,Math.PI*2);
    ctx.fill();
    ctx.save();
    ctx.strokeStyle = 'rgba(201,148,58,0.18)';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([2,4]);
    ctx.beginPath();
    ctx.arc(pt.x,pt.y,22,0,Math.PI*2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    if(KNOT_IMG.complete && KNOT_IMG.naturalWidth){
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.shadowColor = 'rgba(201,148,58,0.4)';
      ctx.shadowBlur = 10;
      ctx.drawImage(KNOT_IMG, pt.x-sz/2, pt.y-sz/2, sz, sz);
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }

  // ── PENDANT — chosen monthly rose, hangs below the clasp on a thin thread ──
  // Rendered only after the year-end choice (gc_pendant_year_YYYY is set).
  // Cached across frames because everything but rotation is stable.
  var _pendantCacheSig = null;
  var _pendantCacheChoice = null;
  var _pendantCacheKp = null;
  window._invalidatePendantCache = function(){ _pendantCacheSig = null; };

  function drawPendant(){
    var yearKey = 'gc_pendant_year_'
      + new Date(gcStartDate || todayISO()).getFullYear();
    var saved = null;
    try{ saved = localStorage.getItem(yearKey); }catch(e){}
    if(!saved) return;

    var sig = yearKey + ':' + saved;
    var choice, kp;

    if(_pendantCacheSig === sig && _pendantCacheChoice && _pendantCacheKp){
      choice = _pendantCacheChoice;
      kp     = _pendantCacheKp;
    } else {
      choice = {};
      try{ choice = JSON.parse(saved); }catch(e){ return; }

      // ── use blended params if available, fall back to dominant ──
      var allEntries = [];
      try{ allEntries = JSON.parse(localStorage.getItem('gc_entries')||'[]'); }catch(e){}
      var monthEntries = allEntries.filter(function(e){
        return e.dateISO && e.dateISO.slice(0,7) === choice.monthISO;
      });

      if(typeof _blendKnotParams === 'function' && monthEntries.length > 0){
        var bl = _blendKnotParams(monthEntries, choice.monthIdx||0);
        kp = bl.full;
      } else {
        var emoCounts = {};
        monthEntries.forEach(function(e){
          if(e.emo) emoCounts[e.emo] = (emoCounts[e.emo]||0) + 1;
        });
        var dominant = Object.keys(emoCounts)
          .sort(function(a,b){ return emoCounts[b]-emoCounts[a]; })[0] || 'calm';
        kp = (KNOT_PARAMS && KNOT_PARAMS[dominant])
          || KNOT_FALLBACK
          || {petals:5,sharp:0.3,round:0.7,strokeW:1.4,twist:0.25,color:'#c9943a'};
      }

      _pendantCacheSig    = sig;
      _pendantCacheChoice = choice;
      _pendantCacheKp     = kp;
    }

    // ── geometry — pendant hangs below clasp ──
    var claspPt  = angleToPoint(Math.PI / 2);
    var pendantCx = claspPt.x;
    var pendantCy = claspPt.y + 56;

    var rgb = (function(h){
      h = h.replace('#','');
      return [parseInt(h.slice(0,2),16),
              parseInt(h.slice(2,4),16),
              parseInt(h.slice(4,6),16)];
    })(kp.color);
    var cStr = 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2];

    // ── thread ──
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(claspPt.x, claspPt.y + 16);
    ctx.lineTo(pendantCx,  pendantCy  - 28);
    ctx.strokeStyle = 'rgba(201,148,58,0.45)';
    ctx.lineWidth   = 1.0;
    ctx.stroke();
    ctx.restore();

    // ── glow halo ──
    var pulse = 1 + 0.055 * Math.sin(Date.now() / 1350 * Math.PI);
    var R = 26;
    var pgrd = ctx.createRadialGradient(
      pendantCx, pendantCy, 0,
      pendantCx, pendantCy, R * 2.2 * pulse
    );
    pgrd.addColorStop(0,   cStr + ',0.22)');
    pgrd.addColorStop(0.5, cStr + ',0.08)');
    pgrd.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = pgrd;
    ctx.beginPath();
    ctx.arc(pendantCx, pendantCy, R * 2.2 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // ── rose curve (3 layers, slow rotation) ──
    var seed     = (choice.monthIdx || 0) * 137.5;
    var rotation = Date.now() * 0.00003;
    ctx.save();
    for(var layer = 0; layer < 3; layer++){
      var layerR = R * (0.95 - layer * 0.15);
      var lAlpha = (1 - layer * 0.28) * 0.88;
      var STEPS  = 200;
      ctx.beginPath();
      for(var i = 0; i <= STEPS; i++){
        var t  = (i / STEPS) * Math.PI * 2;
        var k  = kp.petals % 2 === 0 ? kp.petals / 2 : kp.petals;
        var r1 = Math.abs(Math.cos(k * t + kp.twist * Math.PI));
        var r2 = Math.pow(r1, 1 - kp.round * 0.5 + kp.sharp * 0.3);
        var h  = 1 + kp.sharp * 0.15 * Math.cos((kp.petals * 2 + 1) * t + seed);
        var r  = layerR * r2 * h;
        var angle = t + layer * 0.04 + rotation;
        var x = pendantCx + r * Math.cos(angle);
        var y = pendantCy + r * Math.sin(angle);
        if(i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.globalAlpha = lAlpha * 0.09;
      ctx.fillStyle   = kp.color;
      ctx.fill();
      ctx.globalAlpha = lAlpha;
      ctx.strokeStyle = kp.color;
      ctx.lineWidth   = kp.strokeW * (1 - layer * 0.2) * 0.55;
      ctx.lineCap     = 'round';
      ctx.stroke();
    }
    ctx.restore();

    // ── diamond spark — crowns the center of the rose ──

    // outer bloom
    var sparkR = 6.5 * pulse;
    var bloom = ctx.createRadialGradient(
      pendantCx, pendantCy, 0,
      pendantCx, pendantCy, sparkR * 3.5
    );
    bloom.addColorStop(0,   cStr + ',0.35)');
    bloom.addColorStop(0.4, 'rgba(255,252,230,0.15)');
    bloom.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(pendantCx, pendantCy, sparkR * 3.5, 0, Math.PI * 2);
    ctx.fill();

    // bright core
    var sg = ctx.createRadialGradient(
      pendantCx, pendantCy, 0,
      pendantCx, pendantCy, sparkR * 2
    );
    sg.addColorStop(0,   'rgba(255,255,255,1.0)');
    sg.addColorStop(0.2, 'rgba(255,252,230,0.95)');
    sg.addColorStop(0.5, 'rgba(230,182,88,0.7)');
    sg.addColorStop(1,   'rgba(201,148,58,0)');
    ctx.globalAlpha = 0.95;
    ctx.fillStyle   = sg;
    ctx.beginPath();
    ctx.arc(pendantCx, pendantCy, sparkR, 0, Math.PI * 2);
    ctx.fill();

    // 4 long rays
    var rl = 16 * pulse;
    ctx.strokeStyle = 'rgba(255,255,255,0.70)';
    ctx.lineWidth   = 0.85;
    ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.moveTo(pendantCx-rl,pendantCy); ctx.lineTo(pendantCx+rl,pendantCy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pendantCx,pendantCy-rl); ctx.lineTo(pendantCx,pendantCy+rl); ctx.stroke();

    // 4 diagonal rays (shorter)
    var rd = 10 * pulse;
    ctx.strokeStyle = 'rgba(255,255,255,0.30)';
    ctx.lineWidth   = 0.5;
    ctx.globalAlpha = 0.45;
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function(d){
      ctx.beginPath();
      ctx.moveTo(pendantCx + d[0]*rd*0.7, pendantCy + d[1]*rd*0.7);
      ctx.lineTo(pendantCx - d[0]*rd*0.7, pendantCy - d[1]*rd*0.7);
      ctx.stroke();
    });

    // solid white center dot
    ctx.globalAlpha = 1;
    ctx.fillStyle   = 'rgba(255,255,255,0.98)';
    ctx.beginPath();
    ctx.arc(pendantCx, pendantCy, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ── SMALL KNOT — regular logged days on the necklace, fades with age ──
  function drawSmallKnot(x, y, dayNumber, totalDays){
    if(!KNOT_IMG.complete||!KNOT_IMG.naturalWidth) return;
    var age = totalDays - dayNumber;
    var alpha = Math.max(0.25, 0.85 - age*0.015);
    var sz = 14;
    ctx.save();
    ctx.globalAlpha = alpha;
    var g = ctx.createRadialGradient(x,y,0,x,y,sz);
    g.addColorStop(0, 'rgba(230,182,88,0.12)');
    g.addColorStop(1, 'rgba(201,148,58,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x,y,sz,0,Math.PI*2);
    ctx.fill();
    ctx.drawImage(KNOT_IMG,x-sz/2,y-sz/2,sz,sz);
    ctx.restore();
  }

  // ── DRAW KNOTS ──
  // missed day knot — faded, no glow, broken chain link
  function drawMissedKnot(x,y){
    if(!KNOT_IMG.complete||!KNOT_IMG.naturalWidth) return;
    ctx.save();
    ctx.globalAlpha=0.15;
    ctx.drawImage(KNOT_IMG,x-10,y-10,20,20);
    ctx.restore();
  }

  function drawFilledKnot(x,y,dayNumber){
    if(!KNOT_IMG.complete||!KNOT_IMG.naturalWidth) return;
    // Symmetry rule: every past knot on the chain renders identically.
    // Milestones (7/100/200/250/300) still fire the ceremony screen, but
    // once placed on the braided thread they are indistinguishable from
    // any other held morning. Only today and birthdays differ visually.
    var isBdayKnot=gcBirthdayKnotsSet.has(dayNumber);
    var sz = isBdayKnot ? 36 : 20;
    var isMilestone = false; // intentionally suppressed for chain symmetry
    ctx.save();
    ctx.globalAlpha=0.85;
    // birthday knot — glow tinted by the user's birthstone (gem of their birth month)
    if(isBdayKnot&&!isMilestone){
      var bs = _getBirthstone();
      // outer halo — birthstone hue
      var bg1=ctx.createRadialGradient(x,y,0,x,y,sz*1.4);
      bg1.addColorStop(0,'rgba('+bs.halo+',0.32)');
      bg1.addColorStop(0.4,'rgba('+bs.halo+',0.14)');
      bg1.addColorStop(1,'rgba(201,148,58,0)');
      ctx.fillStyle=bg1;
      ctx.beginPath();ctx.arc(x,y,sz*1.4,0,Math.PI*2);ctx.fill();
      // inner core — brighter birthstone tint
      var bg2=ctx.createRadialGradient(x,y,0,x,y,sz*0.5);
      bg2.addColorStop(0,'rgba('+bs.core+',0.45)');
      bg2.addColorStop(1,'rgba('+bs.core+',0)');
      ctx.fillStyle=bg2;
      ctx.beginPath();ctx.arc(x,y,sz*0.5,0,Math.PI*2);ctx.fill();
      // the knot itself with a birthstone-coloured shadow so the gold tints slightly
      ctx.shadowColor='rgba('+bs.core+',0.55)';ctx.shadowBlur=12;
      ctx.drawImage(KNOT_IMG,x-sz/2,y-sz/2,sz,sz);
      ctx.shadowColor='transparent';ctx.shadowBlur=0;
      // star sparkle — 4 rays in birthstone hue
      ctx.strokeStyle='rgba('+bs.core+',0.50)';ctx.lineWidth=0.9;
      var rl=sz*0.6;
      ctx.beginPath();ctx.moveTo(x-rl,y);ctx.lineTo(x+rl,y);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x,y-rl);ctx.lineTo(x,y+rl);ctx.stroke();
      // the stone at the center — birthstone solid dot with tiny white highlight
      ctx.fillStyle=bs.dot;
      ctx.beginPath();ctx.arc(x,y,3.2,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.85)';
      ctx.beginPath();ctx.arc(x-1,y-1,0.9,0,Math.PI*2);ctx.fill();
      ctx.restore();
      return; // skip normal rendering — birthday knot already drawn
    }
    if(isMilestone){
      // diamond-white glow for milestones — multiple layers
      // outer warm halo
      const g1=ctx.createRadialGradient(x,y,0,x,y,sz*1.5);
      g1.addColorStop(0,'rgba(255,255,255,0.25)');
      g1.addColorStop(0.3,'rgba(230,220,255,0.15)');
      g1.addColorStop(0.6,'rgba(201,148,58,0.08)');
      g1.addColorStop(1,'rgba(201,148,58,0)');
      ctx.fillStyle=g1;
      ctx.beginPath();ctx.arc(x,y,sz*1.5,0,Math.PI*2);ctx.fill();
      // inner white-hot core
      const g2=ctx.createRadialGradient(x,y,0,x,y,sz*.5);
      g2.addColorStop(0,'rgba(255,255,255,0.5)');
      g2.addColorStop(1,'rgba(255,250,240,0)');
      ctx.fillStyle=g2;
      ctx.beginPath();ctx.arc(x,y,sz*.5,0,Math.PI*2);ctx.fill();
      // draw knot with bright white shadow
      ctx.shadowColor='rgba(255,255,255,0.6)';ctx.shadowBlur=14;
      ctx.drawImage(KNOT_IMG,x-sz/2,y-sz/2,sz,sz);
      ctx.shadowColor='transparent';ctx.shadowBlur=0;
      // wash gold → diamond white: overlay the knot again with 'lighter' blend
      ctx.globalCompositeOperation='lighter';
      ctx.globalAlpha=0.5;
      ctx.drawImage(KNOT_IMG,x-sz/2,y-sz/2,sz,sz);
      ctx.globalAlpha=0.3;
      ctx.drawImage(KNOT_IMG,x-sz/2,y-sz/2,sz,sz);
      ctx.globalCompositeOperation='source-over';
      ctx.globalAlpha=0.85;
      // diamond sparkle — 4 tiny light rays
      ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=0.8;
      var rl=sz*0.5;
      ctx.beginPath();ctx.moveTo(x-rl,y);ctx.lineTo(x+rl,y);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x,y-rl);ctx.lineTo(x,y+rl);ctx.stroke();
      // (milestone number label removed — the knot itself is the signal)
    } else {
      // regular filled knot — warm gold glow
      const g=ctx.createRadialGradient(x,y,0,x,y,sz*.8);
      g.addColorStop(0,'rgba(230,182,88,0.15)');
      g.addColorStop(1,'rgba(201,148,58,0)');
      ctx.fillStyle=g;
      ctx.beginPath();ctx.arc(x,y,sz*.8,0,Math.PI*2);ctx.fill();
      ctx.drawImage(KNOT_IMG,x-sz/2,y-sz/2,sz,sz);
    }
    ctx.restore();
  }

  function drawTodayKnot(x,y,t){
    if(!KNOT_IMG.complete||!KNOT_IMG.naturalWidth) return;
    const pulse=1.0+0.15*Math.sin(t*(Math.PI*2/3));
    const sz=40*pulse;
    ctx.save();
    // outer glow rings — birthday uses white-gold, normal uses warm amber
    var glowColor=isBirthday?'rgba(255,255,255,':'rgba(230,182,88,';
    var glowFade=isBirthday?'rgba(255,245,221,0)':'rgba(201,148,58,0)';
    var glowAlphas=isBirthday?[0.12,0.22,0.35]:[0.08,0.18,0.30];
    [{r:48,a:glowAlphas[0]},{r:34,a:glowAlphas[1]},{r:24,a:glowAlphas[2]}].forEach(function(g){
      const gr=ctx.createRadialGradient(x,y,0,x,y,g.r*pulse);
      gr.addColorStop(0,glowColor+g.a+')');
      gr.addColorStop(1,glowFade);
      ctx.fillStyle=gr;
      ctx.beginPath();ctx.arc(x,y,g.r*pulse,0,Math.PI*2);ctx.fill();
    });
    // the knot
    ctx.shadowColor=isBirthday?'rgba(255,245,221,0.6)':'rgba(201,148,58,0.5)';
    ctx.shadowBlur=isBirthday?16:12;
    ctx.drawImage(KNOT_IMG,x-sz/2,y-sz/2,sz,sz);
    ctx.shadowColor='transparent';ctx.shadowBlur=0;
    // blue-white alive spark — larger on birthday
    ctx.fillStyle='rgba(220,240,255,0.9)';
    var sparkR=isBirthday?5:3;
    ctx.beginPath();ctx.arc(x,y,sparkR*pulse,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  resize();
  window.addEventListener('resize',resize);

  // ── MAIN LOOP ──
  function tick(){
    frame++;time+=1/60;
    if(!W||!H){resize();requestAnimationFrame(tick);return}
    ctx.clearRect(0,0,W,H);

    const streak=dayNum;

    if(!hasLogged){
      // ── NOT LOGGED: single large Sacred Knot centered, inviting tap ──
      const cx=W*.5, cy=H*.42;
      const pulse=1.0+0.08*Math.sin(time*(Math.PI*2/4));
      const sz=90*pulse;
      // warm radial glow
      [{r:120,a:0.05},{r:80,a:0.12},{r:50,a:0.22}].forEach(function(g){
        const gr=ctx.createRadialGradient(cx,cy,0,cx,cy,g.r*pulse);
        gr.addColorStop(0,'rgba(230,182,88,'+g.a+')');
        gr.addColorStop(1,'rgba(201,148,58,0)');
        ctx.fillStyle=gr;
        ctx.beginPath();ctx.arc(cx,cy,g.r*pulse,0,Math.PI*2);ctx.fill();
      });
      // the Sacred Knot
      if(KNOT_IMG.complete&&KNOT_IMG.naturalWidth>0){
        ctx.save();
        ctx.shadowColor='rgba(201,148,58,0.4)';ctx.shadowBlur=16;
        ctx.drawImage(KNOT_IMG,cx-sz/2,cy-sz/2,sz,sz);
        ctx.restore();
      }
      // sparkles around it
      updateParticles(cx,cy);
    } else {
      // ── LOGGED: necklace formation ──
      var calendarDay = gcStartDate ? getDayNumber(todayISO()) : 1;
      var displayDay = Math.max(1, calendarDay);

      // 0. sparkle rain — behind everything
      updateRainParticles();

      // 1. ghost circle — full outline, always visible
      drawGhostCircle();

      // 2. braided thread arc from bottom (Day 1) to today
      drawNecklaceThread(displayDay);

      // 2b. circle-close animation — Day 365 only
      if(circleCloseProgress >= 0 && circleCloseProgress < 1){
        circleCloseProgress = Math.min(1, circleCloseProgress + 0.008);
        drawCircleComplete(circleCloseProgress);
      }

      // 3. clasp at bottom — always rendered (structural, unchanged)
      drawClasp();

      // 4. pendant — chosen monthly rose hanging below clasp (only after year-end choice)
      drawPendant();

      // 5. year label at center — spans the actual 365-day window, so a chain
      // that started Apr 25 2025 reads "2025 — 2026", not just "2025".
      ctx.save();
      ctx.font = '400 12px "DM Mono",monospace';
      ctx.fillStyle = 'rgba(201,148,58,0.35)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing && (ctx.letterSpacing = '0.18em');
      (function(){
        var _sd = new Date(gcStartDate||todayISO());
        var _sy = _sd.getFullYear();
        var _ed = new Date(_sd); _ed.setDate(_ed.getDate() + 364);
        var _ey = _ed.getFullYear();
        var _lbl = (_sy === _ey) ? String(_sy) : (_sy + ' \u2014 ' + _ey);
        ctx.fillText(_lbl, NECKLACE_CX, NECKLACE_CY);
      })();
      ctx.restore();

      // 6. all knots around the arc
      for(var d = 0; d < displayDay; d++){
        var pt = allKnotPositions[d];
        if(!pt) continue;
        var dayNumber = d + 1;
        // skip clasp position — drawClasp() handles Day 1
        if(dayNumber === 1) continue;

        var logged = isDayLogged(dayNumber);
        // Chain symmetry rule: no visual emphasis on specific days — every past
        // morning looks the same. Birthdays are the only exception.
        var isBdayDay = gcBirthdayKnotsSet.has(dayNumber);
        var isToday = dayNumber === displayDay;

        if(isToday){
          if(todayFillTime<0){
            drawSmallKnot(pt.x, pt.y, dayNumber, displayDay);
          } else {
            todayFillTime += 1/60;
            var fillProgress = Math.min(1, todayFillTime/1.2);
            if(fillProgress < 1){
              ctx.save();
              ctx.globalAlpha = fillProgress;
              var burstSz = 40*(0.5 + fillProgress*0.5 + 0.15*Math.sin(fillProgress*Math.PI));
              var fg = ctx.createRadialGradient(pt.x,pt.y,0,pt.x,pt.y,60*fillProgress);
              fg.addColorStop(0, 'rgba(255,255,255,'+(0.4*(1-fillProgress))+')');
              fg.addColorStop(1, 'rgba(230,182,88,0)');
              ctx.fillStyle = fg;
              ctx.beginPath();
              ctx.arc(pt.x,pt.y,60*fillProgress,0,Math.PI*2);
              ctx.fill();
              if(KNOT_IMG.complete && KNOT_IMG.naturalWidth>0){
                ctx.drawImage(KNOT_IMG, pt.x-burstSz/2, pt.y-burstSz/2, burstSz, burstSz);
              }
              ctx.restore();
            } else {
              drawTodayKnot(pt.x, pt.y, time);
            }
            updateParticles(pt.x, pt.y);
          }
        } else if(logged){
          if(isBdayDay){
            drawFilledKnot(pt.x, pt.y, dayNumber);
          } else {
            drawSmallKnot(pt.x, pt.y, dayNumber, displayDay);
          }
        } else {
          drawMissedKnot(pt.x, pt.y);
        }
      }
    }

    // 7. capsule glow indicators
    if(typeof getCapsules === 'function' && allKnotPositions.length){
      var _caps = getCapsules();
      var _todayStr = (typeof _todayISO === 'function') ? _todayISO() : '';
      var _todayEmo = (typeof _todayLoggedEmo === 'function' ? _todayLoggedEmo() : null) || '';
      _caps.forEach(function(c){
        if(c.opened_at) return;
        var dayN = getDayNumber(c.unlock_date);
        var pos = allKnotPositions[dayN - 1];
        if(!pos) return;
        var dateReady = c.unlock_date <= _todayStr;
        var moodReady = !c.mood_trigger || c.mood_trigger === _todayEmo;
        var isReady = dateReady && moodReady;
        ctx.save();
        if(isReady){
          var pulse = 0.7 + 0.3 * Math.sin(time * Math.PI * 2 / 1.8);
          var gr = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 28 * pulse);
          gr.addColorStop(0, 'rgba(201,148,58,0.65)');
          gr.addColorStop(1, 'rgba(201,148,58,0)');
          ctx.fillStyle = gr;
          ctx.beginPath(); ctx.arc(pos.x, pos.y, 28 * pulse, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(201,148,58,0.9)';
          ctx.beginPath(); ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2); ctx.fill();
        } else {
          var gr2 = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 18);
          gr2.addColorStop(0, 'rgba(201,148,58,0.18)');
          gr2.addColorStop(1, 'rgba(201,148,58,0)');
          ctx.fillStyle = gr2;
          ctx.beginPath(); ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(201,148,58,0.4)';
          ctx.beginPath(); ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      });
    }

    requestAnimationFrame(tick);
  }

  KNOT_IMG.onload=function(){requestAnimationFrame(tick)};
  if(KNOT_IMG.complete) requestAnimationFrame(tick);

  // tap handler — pendant tap opens the chosen month's preview; elsewhere shows the "already arrived" whisper
  cv.addEventListener('click', function(e){
    if(!hasLogged) return;
    var rect = cv.getBoundingClientRect();
    var tapX = e.clientX - rect.left;
    var tapY = e.clientY - rect.top;
    // pendant tap (hangs ~40px below the clasp at Day 1's bottom position)
    if(NECKLACE_CX !== undefined && NECKLACE_R !== undefined){
      var claspPt = angleToPoint(Math.PI/2);
      var pendantCx = claspPt.x;
      var pendantCy = claspPt.y + 40;
      var dist = Math.sqrt(Math.pow(tapX - pendantCx, 2) + Math.pow(tapY - pendantCy, 2));
      if(dist < 20){
        var yearKey = 'gc_pendant_year_' + new Date(gcStartDate||todayISO()).getFullYear();
        var saved = null;
        try{ saved = localStorage.getItem(yearKey); }catch(err){}
        if(saved){
          try{
            var choice = JSON.parse(saved);
            var allEntries = JSON.parse(localStorage.getItem('gc_entries')||'[]');
            var monthEntries = allEntries.filter(function(x){
              return x.dateISO && x.dateISO.slice(0,7) === choice.monthISO;
            });
            if(typeof openMonthDetail === 'function'){
              openMonthDetail(choice.monthIdx, monthEntries);
            }
          }catch(err){}
        }
        return;
      }
    }
    // capsule glow tap detection
    if(typeof getCapsules === 'function' && allKnotPositions.length){
      var _tapCaps = getCapsules();
      var _tapTodayStr = (typeof _todayISO === 'function') ? _todayISO() : '';
      var _tapTodayEmo = (typeof _todayLoggedEmo === 'function' ? _todayLoggedEmo() : null) || '';
      for(var _ci = 0; _ci < _tapCaps.length; _ci++){
        var _tc = _tapCaps[_ci];
        if(_tc.opened_at) continue;
        var _tcDayN = getDayNumber(_tc.unlock_date);
        var _tcPos = allKnotPositions[_tcDayN - 1];
        if(!_tcPos) continue;
        var _tcDist = Math.sqrt(Math.pow(tapX - _tcPos.x, 2) + Math.pow(tapY - _tcPos.y, 2));
        if(_tcDist < 24){
          var _tcDateReady = _tc.unlock_date <= _tapTodayStr;
          var _tcMoodReady = !_tc.mood_trigger || _tc.mood_trigger === _tapTodayEmo;
          var _tcTooltipText;
          if(_tcDateReady && _tcMoodReady){
            _tcTooltipText = 'ready to open';
          } else if(_tcDateReady && !_tcMoodReady){
            _tcTooltipText = 'waiting for a ' + _tc.mood_trigger + ' day';
          } else {
            _tcTooltipText = 'opens ' + _tc.unlock_date;
          }
          if(typeof _showCapsuleGlowTooltip === 'function'){
            _showCapsuleGlowTooltip(_tcTooltipText, e.clientX, e.clientY);
          }
          return;
        }
      }
    }
    // "already arrived" whisper for taps elsewhere
    var w=document.createElement('div');
    w.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:99;pointer-events:none';
    w.innerHTML='<span style="font-family:Fraunces,serif;font-style:italic;font-size:14px;color:rgba(201,148,58,0.8);opacity:0;transition:opacity 400ms">you have already arrived today</span>';
    document.body.appendChild(w);
    requestAnimationFrame(function(){w.firstChild.style.opacity='1'});
    setTimeout(function(){w.firstChild.style.opacity='0'},1600);
    setTimeout(function(){w.remove()},2200);
  });

  // expose for post-submit state update
  window._splashShowChain = function(){
    hasLogged = true;
    todayFillTime = 0;
    placeAllKnotsOnCircle();
  };
  // expose circle-close trigger for flyKnotToChain
  window._startCircleClose = function(){
    circleCloseProgress = 0;
  };
  // expose today's knot position for the fly animation
  window._getTodayKnotPos = function(){
    // dayNum was already incremented, so display day = dayNum-1, index = dayNum-2
    var idx = dayNum - 2;
    if(idx >= 0 && idx < allKnotPositions.length){
      return allKnotPositions[idx];
    }
    return allKnotPositions[0] || null;
  };
  // expose an arbitrary day's knot position (1-indexed) + the chain canvas,
  // so the birthday ceremony can fly the stone to its permanent knot.
  window._getKnotPosForDay = function(dayNumber){
    var idx = dayNumber - 1;
    if(idx < 0 || idx >= allKnotPositions.length) return null;
    var pt = allKnotPositions[idx];
    if(!pt) return null;
    var rect = canvas.getBoundingClientRect();
    return { x: rect.left + pt.x, y: rect.top + pt.y };
  };
}();
}catch(e){window.__KNOT_ERR=e.message+'\n'+e.stack}
/*END_KNOT_INIT*/

