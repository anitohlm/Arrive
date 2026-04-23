// ═══ PORTRAIT — two-tab redesign ═════════════════
// parametric rose-curve knot generator — each emotion has its own shape
const KNOT_PARAMS = {
  tender:      {petals:6, sharp:0.2, round:0.85, strokeW:1.2, twist:0.3,  color:'#c2627a', glow:'rgba(194,98,122,0.25)'},
  calm:        {petals:5, sharp:0.3, round:0.7,  strokeW:1.4, twist:0.25, color:'#4a7c59', glow:'rgba(74,124,89,0.25)'},
  alive:       {petals:8, sharp:0.9, round:0.2,  strokeW:1.0, twist:0.6,  color:'#c9783a', glow:'rgba(201,120,58,0.35)'},
  grateful:    {petals:6, sharp:0.5, round:0.55, strokeW:1.5, twist:0.4,  color:'#c9943a', glow:'rgba(201,148,58,0.3)'},
  hard:        {petals:4, sharp:0.8, round:0.15, strokeW:2.2, twist:0.15, color:'#4a607a', glow:'rgba(74,96,122,0.25)'},
  heavy:       {petals:4, sharp:0.7, round:0.1,  strokeW:2.5, twist:0.1,  color:'#6b5a7a', glow:'rgba(107,90,122,0.25)'},
  hopeful:     {petals:7, sharp:0.45,round:0.65, strokeW:1.3, twist:0.45, color:'#5a9a78', glow:'rgba(90,154,120,0.3)'},
  overwhelmed: {petals:5, sharp:0.75,round:0.2,  strokeW:1.8, twist:0.55, color:'#3a5a7a', glow:'rgba(58,90,122,0.25)'},
  numb:        {petals:4, sharp:0.2, round:0.6,  strokeW:0.8, twist:0.1,  color:'#8a8a8a', glow:'rgba(138,138,138,0.15)'},
  moved:       {petals:7, sharp:0.55,round:0.6,  strokeW:1.3, twist:0.5,  color:'#b46482', glow:'rgba(180,100,130,0.3)'},
  light:       {petals:8, sharp:0.35,round:0.75, strokeW:0.9, twist:0.5,  color:'#c9a832', glow:'rgba(201,168,50,0.25)'},
  searching:   {petals:5, sharp:0.6, round:0.4,  strokeW:1.2, twist:0.7,  color:'#647aa0', glow:'rgba(100,122,160,0.25)'},
  sad:         {petals:5, sharp:0.3, round:0.55, strokeW:1.6, twist:0.2,  color:'#506e96', glow:'rgba(80,110,150,0.25)'},
  restless:    {petals:6, sharp:0.7, round:0.3,  strokeW:1.1, twist:0.65, color:'#b4823c', glow:'rgba(180,130,60,0.3)'},
  anxious:     {petals:7, sharp:0.65,round:0.35, strokeW:1.0, twist:0.6,  color:'#a078aa', glow:'rgba(160,120,170,0.25)'},
  quiet:       {petals:5, sharp:0.25,round:0.7,  strokeW:1.0, twist:0.2,  color:'#7a8a9a', glow:'rgba(122,138,154,0.2)'},
  foggy:       {petals:5, sharp:0.2, round:0.6,  strokeW:0.9, twist:0.15, color:'#8a96a2', glow:'rgba(138,150,162,0.2)'},
  // New emotions — 2026-04-18
  passionate:  {petals:9, sharp:0.85,round:0.25, strokeW:1.3, twist:0.55, color:'#d94a4a', glow:'rgba(217,74,74,0.35)'},
  nervous:     {petals:7, sharp:0.55,round:0.45, strokeW:1.0, twist:0.5,  color:'#b89a5a', glow:'rgba(184,154,90,0.25)'},
  livid:       {petals:6, sharp:0.9, round:0.15, strokeW:2.0, twist:0.7,  color:'#a83832', glow:'rgba(168,56,50,0.35)'},
  lonely:      {petals:4, sharp:0.4, round:0.5,  strokeW:1.4, twist:0.2,  color:'#5a6888', glow:'rgba(90,104,136,0.25)'},
  ashamed:     {petals:5, sharp:0.5, round:0.4,  strokeW:1.2, twist:0.35, color:'#7a4a5a', glow:'rgba(122,74,90,0.25)'},
  // Third wave — 2026-04-18
  certain:     {petals:5, sharp:0.5, round:0.5,  strokeW:1.4, twist:0.2,  color:'#a08860', glow:'rgba(160,136,96,0.25)'},
  content:     {petals:6, sharp:0.3, round:0.7,  strokeW:1.2, twist:0.25, color:'#a0b888', glow:'rgba(160,184,136,0.25)'},
  focused:     {petals:4, sharp:0.7, round:0.3,  strokeW:1.5, twist:0.1,  color:'#5880a0', glow:'rgba(88,128,160,0.25)'},
  inspired:    {petals:9, sharp:0.8, round:0.4,  strokeW:1.2, twist:0.55, color:'#e09848', glow:'rgba(224,152,72,0.35)'},
  lost:        {petals:5, sharp:0.35,round:0.5,  strokeW:0.9, twist:0.4,  color:'#7a7e88', glow:'rgba(122,126,136,0.22)'},
  relaxed:     {petals:6, sharp:0.2, round:0.85, strokeW:1.1, twist:0.2,  color:'#9ec8a0', glow:'rgba(158,200,160,0.25)'},
  vulnerable:  {petals:5, sharp:0.3, round:0.75, strokeW:0.9, twist:0.3,  color:'#dba4b2', glow:'rgba(219,164,178,0.3)'},
  yearning:    {petals:6, sharp:0.5, round:0.6,  strokeW:1.1, twist:0.55, color:'#987ba6', glow:'rgba(152,123,166,0.25)'},
  betrayed:    {petals:5, sharp:0.8, round:0.2,  strokeW:2.0, twist:0.3,  color:'#8a3840', glow:'rgba(138,56,64,0.35)'},
  bored:       {petals:4, sharp:0.2, round:0.6,  strokeW:0.8, twist:0.1,  color:'#8e8878', glow:'rgba(142,136,120,0.18)'},
  insecure:    {petals:5, sharp:0.5, round:0.4,  strokeW:1.1, twist:0.45, color:'#a08a90', glow:'rgba(160,138,144,0.25)'},
  upset:       {petals:6, sharp:0.75,round:0.25, strokeW:1.6, twist:0.5,  color:'#b07040', glow:'rgba(176,112,64,0.3)'},
  // Fourth wave — 2026-04-21 (filling gaps the demo seed list exposed)
  exhausted:   {petals:4, sharp:0.2, round:0.55, strokeW:1.8, twist:0.1,  color:'#786e82', glow:'rgba(120,110,130,0.25)'},
  frustrated:  {petals:5, sharp:0.75,round:0.25, strokeW:1.5, twist:0.5,  color:'#b4503c', glow:'rgba(180,80,60,0.3)'},
};
const KNOT_FALLBACK = KNOT_PARAMS.calm;

// Shared "real-first" filter: if ANY user-authored entry exists in a pool,
// demo-tagged entries are ignored for dominant-emotion calculations. Keeps
// seeded demo data from outvoting what the user actually wrote.
function _realFirst(entries){
  var all = entries || [];
  var real = all.filter(function(e){ return !e.demo; });
  return real.length > 0 ? real : all;
}

// pure geometry — draws rose curve at (cx,cy) with radius R on any context.
// weighted blend of up to top-4 emotions by entry count — used by all three knot renderers
//
// PRIORITY RULE: when BOTH demo-tagged and real (user-authored) entries
// exist in the pool, only real entries shape the pendant. This keeps
// demo seeding from polluting the visual — the pendant you see reflects
// what YOU wrote, not the random seeds. Demo entries still render as
// knots on the chain and as dots in the constellation; they just don't
// vote on the pendant's color or petal-shape.
function _blendKnotParams(entries, monthIndex){
  var pool = _realFirst(entries);

  var emoCounts = {};
  pool.forEach(function(e){
    if(e.emo) emoCounts[e.emo] = (emoCounts[e.emo]||0) + 1;
  });

  var keys = Object.keys(emoCounts);
  if(keys.length === 0) return { p: KNOT_FALLBACK, dominant: 'calm', full: KNOT_FALLBACK, mid: KNOT_FALLBACK, dom: KNOT_FALLBACK };

  var total = keys.reduce(function(s,k){ return s + emoCounts[k]; }, 0);

  // sort by count descending — cap at top 4 to avoid over-dilution
  keys.sort(function(a,b){ return emoCounts[b]-emoCounts[a]; });
  var top = keys.slice(0, 4);

  // re-normalise weights among top-4 only
  var topTotal = top.reduce(function(s,k){ return s + emoCounts[k]; }, 0);

  var blended = { petals:0, sharp:0, round:0, strokeW:0, twist:0 };
  var colorR=0, colorG=0, colorB=0;

  top.forEach(function(emo){
    var w = emoCounts[emo] / topTotal;
    var p = KNOT_PARAMS[emo] || KNOT_FALLBACK;
    blended.petals  += p.petals  * w;
    blended.sharp   += p.sharp   * w;
    blended.round   += p.round   * w;
    blended.strokeW += p.strokeW * w;
    blended.twist   += p.twist   * w;

    var hex = p.color.replace('#','');
    colorR += parseInt(hex.slice(0,2),16) * w;
    colorG += parseInt(hex.slice(2,4),16) * w;
    colorB += parseInt(hex.slice(4,6),16) * w;
  });

  blended.petals = Math.round(blended.petals);
  if(blended.petals < 2) blended.petals = 2;

  var r=Math.round(colorR), g=Math.round(colorG), b=Math.round(colorB);
  blended.color = '#' +
    r.toString(16).padStart(2,'0') +
    g.toString(16).padStart(2,'0') +
    b.toString(16).padStart(2,'0');
  blended.glow = 'rgba('+r+','+g+','+b+',0.25)';
  blended.seed = (monthIndex||0) * 137.5;

  // top-2 blend for the middle layer; color blended from #1 + #2 emotion colors
  var p0 = KNOT_PARAMS[top[0]] || KNOT_FALLBACK;
  var p1 = KNOT_PARAMS[top[1]||top[0]] || KNOT_FALLBACK;
  var top2Total = (emoCounts[top[0]]||0) + (emoCounts[top[1]||top[0]]||0);
  var w0 = emoCounts[top[0]] / top2Total;
  var w1 = (emoCounts[top[1]||top[0]]||0) / top2Total;
  var h0 = p0.color.replace('#',''), h1 = p1.color.replace('#','');
  var mR = Math.round(parseInt(h0.slice(0,2),16)*w0 + parseInt(h1.slice(0,2),16)*w1);
  var mG = Math.round(parseInt(h0.slice(2,4),16)*w0 + parseInt(h1.slice(2,4),16)*w1);
  var mB = Math.round(parseInt(h0.slice(4,6),16)*w0 + parseInt(h1.slice(4,6),16)*w1);
  var midColor = '#'+mR.toString(16).padStart(2,'0')+mG.toString(16).padStart(2,'0')+mB.toString(16).padStart(2,'0');
  var mid = {
    petals:  Math.round(p0.petals*w0 + p1.petals*w1),
    sharp:   p0.sharp*w0  + p1.sharp*w1,
    round:   p0.round*w0  + p1.round*w1,
    strokeW: p0.strokeW*w0+ p1.strokeW*w1,
    twist:   p0.twist*w0  + p1.twist*w1,
    color:   midColor,
    glow:    'rgba('+mR+','+mG+','+mB+',0.25)',
    seed:    blended.seed,
  };
  if(mid.petals < 2) mid.petals = 2;

  var dom = KNOT_PARAMS[top[0]] || KNOT_FALLBACK;

  // expose the count + sorted keys so downstream renderers can assign
  // per-layer emotion colors (e.g. outer=top-4 blend, mid=#2, inner=#3)
  blended._emoCounts = emoCounts;
  blended._topEmos = top.slice();

  return {
    full:     blended,
    mid:      mid,
    dom:      dom,
    dominant: top[0],
  };
}

// used by both in-DOM canvases (via drawKnotOnCanvas) and offscreen share canvases.
function _drawKnotGeometry(ctx, cx, cy, R, entries, monthIndex){
  var blend = _blendKnotParams(entries, monthIndex);
  var sizeBoost = R < 60 ? (60 / R) : 1;

  ctx.save();

  // glow using blended color
  var grd = ctx.createRadialGradient(cx,cy,0,cx,cy,R*1.6);
  grd.addColorStop(0, blend.full.glow);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx,cy,R*1.6,0,Math.PI*2);
  ctx.fill();

  // 3-layer rose-curve — each layer uses a different blend depth.
  // Per-layer emotion colors: outer = top-4 blend, mid = #2 emotion pure,
  // inner = #3 emotion pure (fall back up when fewer emotions exist).
  var _topEmos = blend.full._topEmos || [];
  function _emoColor(emo){ return (KNOT_PARAMS[emo]||KNOT_FALLBACK).color; }
  var layerColors = [
    blend.full.color,
    _topEmos[1] ? _emoColor(_topEmos[1]) : blend.mid.color,
    _topEmos[2] ? _emoColor(_topEmos[2]) : (_topEmos[1] ? _emoColor(_topEmos[1]) : blend.dom.color)
  ];
  var layers = [
    { params: blend.full, rMult: 0.95, alpha: 1.00, layerOff: 0.00,       color: layerColors[0] },
    { params: blend.mid,  rMult: 0.80, alpha: 0.75, layerOff: Math.PI/12, color: layerColors[1] },
    { params: blend.dom,  rMult: 0.65, alpha: 0.55, layerOff: Math.PI/6,  color: layerColors[2] },
  ];

  layers.forEach(function(L){
    var p = L.params;
    var layerR = R * L.rMult;
    var steps = 600;
    ctx.beginPath();
    for(var i=0; i<=steps; i++){
      var t = (i/steps)*Math.PI*2;
      var k = p.petals%2===0 ? p.petals/2 : p.petals;
      var r1 = Math.abs(Math.cos(k*t + p.twist*Math.PI));
      var r2 = Math.pow(r1, 1 - p.round*0.5 + p.sharp*0.3);
      var h  = 1 + p.sharp*0.15*Math.cos((p.petals*2+1)*t + (p.seed||blend.full.seed));
      var r  = layerR * r2 * h;
      var angle = t + L.layerOff;
      var x = cx + r*Math.cos(angle);
      var y = cy + r*Math.sin(angle);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
    var lc = L.color || p.color;
    ctx.globalAlpha = L.alpha * 0.08;
    ctx.fillStyle = lc;
    ctx.fill();
    ctx.globalAlpha = L.alpha;
    ctx.strokeStyle = lc;
    ctx.lineWidth = p.strokeW*(1-L.layerOff*2)*sizeBoost;
    ctx.lineCap = 'round';
    ctx.stroke();
  });

  // Static center diamond (non-pulsing — this function is also used for
  // year-grid tiles where 12 pulsing diamonds would be visually noisy).
  // Derive glowRgb locally from the outer-blend color.
  var _ch = blend.full.color.replace('#','');
  var _glowRgb = parseInt(_ch.slice(0,2),16)+','+parseInt(_ch.slice(2,4),16)+','+parseInt(_ch.slice(4,6),16);
  var _dR = Math.max(2.2, R * 0.055);

  // bloom
  var _dBloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, _dR * 6);
  _dBloom.addColorStop(0,   'rgba('+_glowRgb+',0.15)');
  _dBloom.addColorStop(0.45,'rgba('+_glowRgb+',0.05)');
  _dBloom.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.globalAlpha = 1;
  ctx.fillStyle = _dBloom;
  ctx.beginPath();
  ctx.arc(cx, cy, _dR * 6, 0, Math.PI*2);
  ctx.fill();

  // mid glow
  var _dMid = ctx.createRadialGradient(cx, cy, 0, cx, cy, _dR * 2.8);
  _dMid.addColorStop(0,   'rgba(255,252,230,0.45)');
  _dMid.addColorStop(0.5, 'rgba(230,182,88,0.20)');
  _dMid.addColorStop(1,   'rgba(201,148,58,0)');
  ctx.fillStyle = _dMid;
  ctx.beginPath();
  ctx.arc(cx, cy, _dR * 2.8, 0, Math.PI*2);
  ctx.fill();

  // white core
  var _dCore = ctx.createRadialGradient(cx, cy, 0, cx, cy, _dR * 1.2);
  _dCore.addColorStop(0,    'rgba(255,255,255,1.0)');
  _dCore.addColorStop(0.45, 'rgba(255,252,230,0.85)');
  _dCore.addColorStop(0.8,  'rgba(230,182,88,0.4)');
  _dCore.addColorStop(1,    'rgba(201,148,58,0)');
  ctx.fillStyle = _dCore;
  ctx.beginPath();
  ctx.arc(cx, cy, _dR, 0, Math.PI*2);
  ctx.fill();

  // 4 primary cross rays
  var _rl = _dR * 4.0;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.lineWidth = Math.max(0.5, sizeBoost * 0.8);
  ctx.globalAlpha = 0.75;
  ctx.beginPath(); ctx.moveTo(cx-_rl,cy); ctx.lineTo(cx+_rl,cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx,cy-_rl); ctx.lineTo(cx,cy+_rl); ctx.stroke();
  ctx.restore();

  // 4 diagonal rays — softer, shorter
  var _rd = _rl * 0.55;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = Math.max(0.4, sizeBoost * 0.5);
  ctx.globalAlpha = 0.45;
  [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function(d){
    ctx.beginPath();
    ctx.moveTo(cx + d[0]*_rd, cy + d[1]*_rd);
    ctx.lineTo(cx - d[0]*_rd, cy - d[1]*_rd);
    ctx.stroke();
  });
  ctx.restore();

  // tiny solid white center dot
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(255,255,255,1.0)';
  ctx.beginPath();
  ctx.arc(cx, cy, _dR * 0.26, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
}

// in-DOM canvas wrapper — auto-sizes to CSS dimensions with dpr handling
function drawKnotOnCanvas(canvas, entries, monthIndex){
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio||1, 2);
  var W = canvas.offsetWidth || canvas.width;
  var H = canvas.offsetHeight || canvas.height;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  var cx = W/2, cy = H/2;
  var R = Math.min(W,H) * 0.38;
  _drawKnotGeometry(ctx, cx, cy, R, entries, monthIndex);
}

// continuous slow rotation loop — runs after the weave, or on any re-entry
// preserves rotation state on canvas._lastRotation so pause/resume is seamless
function startKnotRotation(canvas, entries, monthIndex){
  if(canvas._rotationRunning) return;
  canvas._sparkleRunning = false; // rose rotation and sparkle-forming are mutually exclusive
  canvas._rotationRunning = true;

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio||1, 2);
  var W = canvas.offsetWidth || canvas.width / dpr;
  var H = canvas.offsetHeight || canvas.height / dpr;

  // ensure the transform is dpr-scaled in case the canvas was never set up
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // resolve blended emotion params
  var blend = _blendKnotParams(entries, monthIndex);

  var cx = W/2, cy = H/2;
  var R = Math.min(W,H) * 0.38;
  var sizeBoost = R < 60 ? (60 / R) : 1;
  var STEPS = 600;

  // rotation state — pick up from where we left off (pause/resume-safe)
  var rotation = canvas._lastRotation || 0;
  // ~0.0003 rad per 60fps frame → one full turn every ~5.8 minutes
  var SPEED = 0.0003;
  // throttle to 30fps by skipping alternate RAF callbacks
  var frameCount = 0;

  // Option A layering — layers interlaced through rotation, alphas raised so
  // mid and dom colors breathe through the outer silhouette.
  //
  // layerColors — three DISTINCT emotion colors per layer so the knot
  // reads as a real emotional chord (same pattern the monthly ceremony uses).
  // outer = top-4 blend color, middle = #2 emotion, inner = #3 emotion (falls
  // back up the chain when fewer than 3 emotions exist in the month).
  var _topEmos = Object.keys(blend.full._emoCounts||{}).sort(function(a,b){
    return (blend.full._emoCounts[b]||0) - (blend.full._emoCounts[a]||0);
  });
  function _emoColor(emo){ return (KNOT_PARAMS[emo]||KNOT_FALLBACK).color; }
  var layerColors = [
    blend.full.color,
    _topEmos[1] ? _emoColor(_topEmos[1]) : blend.mid.color,
    _topEmos[2] ? _emoColor(_topEmos[2]) : (_topEmos[1] ? _emoColor(_topEmos[1]) : blend.dom.color)
  ];

  // glowRgb for the center diamond bloom — derived from the outer-blend color
  var _ch = blend.full.color.replace('#','');
  var glowRgb = parseInt(_ch.slice(0,2),16)+','+parseInt(_ch.slice(2,4),16)+','+parseInt(_ch.slice(4,6),16);

  var rotLayers = [
    { params: blend.full, rMult: 0.95, alpha: 1.00, layerOff: 0.00,       color: layerColors[0] },
    { params: blend.mid,  rMult: 0.80, alpha: 0.75, layerOff: Math.PI/12, color: layerColors[1] },
    { params: blend.dom,  rMult: 0.65, alpha: 0.55, layerOff: Math.PI/6,  color: layerColors[2] },
  ];

  function drawFrame(){
    if(!canvas._rotationRunning) return;
    frameCount++;
    // skip odd frames to halve draw rate; advance rotation + schedule next
    if(frameCount % 2 !== 0){
      rotation += SPEED;
      canvas._lastRotation = rotation;
      requestAnimationFrame(drawFrame);
      return;
    }

    ctx.clearRect(0, 0, W, H);

    // glow halo — static, full opacity
    var grd = ctx.createRadialGradient(cx,cy,0,cx,cy,R*1.6);
    grd.addColorStop(0, blend.full.glow);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx,cy,R*1.6,0,Math.PI*2);
    ctx.fill();

    // 3 layers with rotation applied — each uses its blend depth
    rotLayers.forEach(function(L){
      var p = L.params;
      var layerR = R * L.rMult;

      ctx.beginPath();
      for(var i=0; i<=STEPS; i++){
        var t = (i/STEPS) * Math.PI * 2;
        var k = p.petals%2===0 ? p.petals/2 : p.petals;
        var r1 = Math.abs(Math.cos(k*t + p.twist*Math.PI));
        var r2 = Math.pow(r1, 1 - p.round*0.5 + p.sharp*0.3);
        var harmonic = 1 + p.sharp*0.15 * Math.cos((p.petals*2+1)*t + (p.seed||blend.full.seed));
        var r = layerR * r2 * harmonic;
        var angle = t + L.layerOff + rotation;
        var x = cx + r*Math.cos(angle);
        var y = cy + r*Math.sin(angle);
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.closePath();

      var layerIdx = rotLayers.indexOf(L);
      var strokeMult = layerIdx === 0 ? 1.15
                    : layerIdx === 1 ? 0.90
                    : 0.55;
      // Use the layer's explicit color (outer=blend, mid=top-2 blend, inner=dom/#3)
      // so all three emotion identities breathe through the composite.
      var lc = L.color || p.color;
      ctx.globalAlpha = L.alpha * 0.04;
      ctx.fillStyle = lc;
      ctx.fill();
      ctx.globalAlpha = L.alpha;
      ctx.strokeStyle = lc;
      ctx.lineWidth = p.strokeW * strokeMult * sizeBoost;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });

    // ── center diamond (compact version of the monthly-ceremony centerpiece)
    // 8-point star (4 primary rays + 4 diagonal shorter) + white core.
    // Gentle 2s heartbeat pulse, no drifting particles (those are reserved
    // for the ceremony itself to avoid visual noise on the portrait tab).
    var _dt = Date.now();
    var _beat = 1 + 0.10 * Math.sin(_dt / 1000 * Math.PI);
    var _dR = Math.max(2.5, R * 0.055) * _beat;

    // outer bloom
    var _dBloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, _dR * 6);
    _dBloom.addColorStop(0,   'rgba('+glowRgb+',0.16)');
    _dBloom.addColorStop(0.4, 'rgba('+glowRgb+',0.06)');
    _dBloom.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = _dBloom;
    ctx.beginPath();
    ctx.arc(cx, cy, _dR * 6, 0, Math.PI*2);
    ctx.fill();

    // mid glow
    var _dMid = ctx.createRadialGradient(cx, cy, 0, cx, cy, _dR * 3);
    _dMid.addColorStop(0,   'rgba(255,252,230,0.50)');
    _dMid.addColorStop(0.45,'rgba(230,182,88,0.25)');
    _dMid.addColorStop(1,   'rgba(201,148,58,0)');
    ctx.fillStyle = _dMid;
    ctx.beginPath();
    ctx.arc(cx, cy, _dR * 3, 0, Math.PI*2);
    ctx.fill();

    // white core
    var _dCore = ctx.createRadialGradient(cx, cy, 0, cx, cy, _dR * 1.3);
    _dCore.addColorStop(0,    'rgba(255,255,255,1.0)');
    _dCore.addColorStop(0.4,  'rgba(255,252,230,0.9)');
    _dCore.addColorStop(0.75, 'rgba(230,182,88,0.45)');
    _dCore.addColorStop(1,    'rgba(201,148,58,0)');
    ctx.fillStyle = _dCore;
    ctx.beginPath();
    ctx.arc(cx, cy, _dR, 0, Math.PI*2);
    ctx.fill();

    // 4 primary cross rays
    var _rl = _dR * 4.2 * _beat;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.70)';
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(cx-_rl,cy); ctx.lineTo(cx+_rl,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy-_rl); ctx.lineTo(cx,cy+_rl); ctx.stroke();
    ctx.restore();

    // 4 diagonal rays — softer, shorter
    var _rd = _rl * 0.55;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.30)';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.45;
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function(d){
      ctx.beginPath();
      ctx.moveTo(cx + d[0]*_rd, cy + d[1]*_rd);
      ctx.lineTo(cx - d[0]*_rd, cy - d[1]*_rd);
      ctx.stroke();
    });
    ctx.restore();

    // tiny solid white center dot
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(255,255,255,1.0)';
    ctx.beginPath();
    ctx.arc(cx, cy, _dR * 0.26, 0, Math.PI*2);
    ctx.fill();

    rotation += SPEED;
    canvas._lastRotation = rotation;
    requestAnimationFrame(drawFrame);
  }

  requestAnimationFrame(drawFrame);
}

// first-view weave animation — draws each layer progressively with a glowing tip
// optional onComplete fires after the weave hands off to the rotation loop
function drawKnotAnimated(canvas, entries, monthIndex, onComplete){
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio||1, 2);
  var W = canvas.offsetWidth || canvas.width;
  var H = canvas.offsetHeight || canvas.height;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);

  var cx=W/2, cy=H/2;
  var R=Math.min(W,H)*0.28;

  // resolve blended params from entries
  var bl = (typeof _blendKnotParams==='function')
    ? _blendKnotParams(entries, monthIndex)
    : {full:KNOT_FALLBACK, mid:KNOT_FALLBACK, dom:KNOT_FALLBACK};
  var p   = bl.full;
  var color = p.color;
  var rgb = (function(h){
    h=h.replace('#','');
    return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];
  })(color);
  var colorStr='rgba('+rgb[0]+','+rgb[1]+','+rgb[2];

  // 7 Seed of Life circle centers: center + 6 outer
  var circleCenters=[{x:cx,y:cy}];
  for(var i=0;i<6;i++){
    var a=(i/6)*Math.PI*2-Math.PI/2;
    circleCenters.push({
      x:cx+R*Math.cos(a),
      y:cy+R*Math.sin(a)
    });
  }

  // particle pool
  var particles=[];
  function spawnBurst(count,ox,oy,speed,life,sMin,sMax){
    for(var i=0;i<count;i++){
      var angle=Math.random()*Math.PI*2;
      var spd=speed*(0.4+Math.random()*0.6);
      var colors=['#e6b658','#fff5cc','#fffdf5','rgba(255,255,255,0.9)',color];
      particles.push({
        x:ox+Math.cos(angle)*R*0.15*Math.random(),
        y:oy+Math.sin(angle)*R*0.15*Math.random(),
        vx:Math.cos(angle)*spd, vy:Math.sin(angle)*spd,
        life:1, decay:1/(life*60),
        size:sMin+Math.random()*(sMax-sMin),
        color:colors[Math.floor(Math.random()*colors.length)]
      });
    }
  }

  // timeline (ms)
  var T={
    circleEnd:  1800,
    roseStart:  1600,
    roseEnd:    3400,
    fadeStart:  3200,
    fadeEnd:    4400,
    burstAt:    4400,
    burstEnd:   5000,
    settleEnd:  7000
  };
  var TOTAL = T.settleEnd;
  var burstFired = false;
  var startTime = null;

  function easeOut(t){return 1-Math.pow(1-t,3);}
  function prog(t,a,b){return Math.max(0,Math.min((t-a)/(b-a),1));}

  function tick(ts){
    if(!startTime) startTime=ts;
    var t=Math.min(ts-startTime, TOTAL);
    ctx.clearRect(0,0,W,H);

    // glow
    var glowA = t<T.fadeStart ? prog(t,0,800)*0.25
              : t<T.burstAt  ? 0.25
              : t<T.burstEnd ? 0.25+prog(t,T.burstAt,T.burstEnd)*0.55
              : 0.80-prog(t,T.burstEnd,T.settleEnd)*0.55;
    var grd=ctx.createRadialGradient(cx,cy,0,cx,cy,R*2.6);
    grd.addColorStop(0,colorStr+','+(glowA*1.4)+')');
    grd.addColorStop(0.4,colorStr+','+glowA+')');
    grd.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grd;
    ctx.beginPath();ctx.arc(cx,cy,R*2.6,0,Math.PI*2);ctx.fill();

    // circles
    var circleAlpha = t<T.fadeStart ? 1
      : t<T.burstAt ? 1-easeOut(prog(t,T.fadeStart,T.burstAt))
      : 0;
    if(circleAlpha>0.005){
      var stagger=T.circleEnd/7;
      for(var ci=0;ci<7;ci++){
        var cStart=ci*stagger*0.65;
        var cEnd=cStart+stagger*1.8;
        var cp=easeOut(prog(t,cStart,cEnd));
        if(cp<=0.002) continue;
        var c=circleCenters[ci];
        ctx.beginPath();
        ctx.arc(c.x,c.y,R,-Math.PI/2,-Math.PI/2+cp*Math.PI*2);
        ctx.strokeStyle=color;
        ctx.globalAlpha=circleAlpha*(ci===0?0.4:0.62);
        ctx.lineWidth=p.strokeW*(ci===0?0.7:0.85);
        ctx.lineCap='round';
        ctx.stroke();
        ctx.globalAlpha=1;
      }
    }

    // rose curve
    if(t>T.roseStart){
      var roseP=easeOut(prog(t,T.roseStart,T.roseEnd));
      var roseExtra=t>T.burstAt?easeOut(prog(t,T.burstAt,T.burstEnd))*0.4:0;
      var roseSettle=t>T.burstEnd?prog(t,T.burstEnd,T.settleEnd):0;
      var roseAlpha=Math.min(1,roseP*(0.8+roseExtra)*(1-roseSettle*0.15)+roseSettle*0.85);
      var steps=Math.floor(roseP*600);

      // outer layer
      ctx.beginPath();
      for(var i=0;i<=steps;i++){
        var tv=(i/600)*Math.PI*2;
        var k=p.petals%2===0?p.petals/2:p.petals;
        var r1=Math.abs(Math.cos(k*tv+p.twist*Math.PI));
        var r2=Math.pow(r1,1-p.round*0.5+p.sharp*0.3);
        var hh=1+p.sharp*0.15*Math.cos((p.petals*2+1)*tv+(p.seed||0));
        var rv=R*1.05*r2*hh;
        var x=cx+rv*Math.cos(tv),y=cy+rv*Math.sin(tv);
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.strokeStyle=color;
      ctx.globalAlpha=roseAlpha;
      ctx.lineWidth=p.strokeW*(1+roseExtra*0.6);
      ctx.lineCap='round';ctx.stroke();ctx.globalAlpha=1;

      // inner layer
      if(roseP>0.25){
        var innerP=easeOut(prog(roseP,0.25,1));
        var innerSteps=Math.floor(innerP*600);
        ctx.beginPath();
        for(var i=0;i<=innerSteps;i++){
          var tv=(i/600)*Math.PI*2;
          var k=p.petals%2===0?p.petals/2:p.petals;
          var r1=Math.abs(Math.cos(k*tv+p.twist*Math.PI));
          var r2=Math.pow(r1,1-p.round*0.5+p.sharp*0.3);
          var rv=R*0.78*r2;
          var x=cx+rv*Math.cos(tv+0.05),y=cy+rv*Math.sin(tv+0.05);
          if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        ctx.strokeStyle=color;ctx.globalAlpha=roseAlpha*0.42;
        ctx.lineWidth=p.strokeW*0.65;ctx.stroke();ctx.globalAlpha=1;
      }

      // glowing trace tip
      if(roseP<0.98&&t<T.fadeEnd){
        var tipT=(steps/600)*Math.PI*2;
        var k=p.petals%2===0?p.petals/2:p.petals;
        var r1=Math.abs(Math.cos(k*tipT+p.twist*Math.PI));
        var r2=Math.pow(r1,1-p.round*0.5+p.sharp*0.3);
        var tipR=R*1.05*r2;
        var tipX=cx+tipR*Math.cos(tipT),tipY=cy+tipR*Math.sin(tipT);
        var tg=ctx.createRadialGradient(tipX,tipY,0,tipX,tipY,R*0.22);
        tg.addColorStop(0,'rgba(255,255,255,0.95)');
        tg.addColorStop(0.25,'rgba(230,182,88,0.8)');
        tg.addColorStop(1,'rgba(201,148,58,0)');
        ctx.globalAlpha=roseP*0.95;ctx.fillStyle=tg;
        ctx.beginPath();ctx.arc(tipX,tipY,R*0.14,0,Math.PI*2);ctx.fill();
        ctx.globalAlpha=1;
      }
    }

    // burst
    if(t>=T.burstAt&&!burstFired){
      burstFired=true;
      spawnBurst(80,cx,cy,R*0.022,2.8,1.0,3.0);
      circleCenters.forEach(function(c){
        spawnBurst(18,c.x,c.y,R*0.016,2.2,0.5,1.8);
      });
      spawnBurst(25,cx,cy,R*0.008,4.5,1.5,4.0);
    }

    // burst flash
    if(t>T.burstAt&&t<T.burstAt+220){
      var flashP=1-prog(t,T.burstAt,T.burstAt+220);
      ctx.fillStyle='rgba(255,245,220,'+(flashP*0.22)+')';
      ctx.fillRect(0,0,W,H);
    }

    // particles
    for(var pi=particles.length-1;pi>=0;pi--){
      var pk=particles[pi];
      pk.x+=pk.vx;pk.y+=pk.vy;
      pk.vx*=0.975;pk.vy*=0.975;
      pk.life-=pk.decay;
      if(pk.life<=0){particles.splice(pi,1);continue;}
      var pa=pk.life*(pk.life>0.5?1:pk.life*2);
      ctx.save();
      ctx.globalAlpha=pa*0.85;
      ctx.fillStyle=pk.color;
      ctx.beginPath();
      ctx.arc(pk.x,pk.y,pk.size*Math.max(0.2,pk.life),0,Math.PI*2);
      ctx.fill();
      if(pk.size>1.8&&pk.life>0.3){
        var sl=pk.size*pk.life*1.2;
        ctx.strokeStyle=pk.color;ctx.lineWidth=0.4;
        ctx.beginPath();ctx.moveTo(pk.x-sl,pk.y);ctx.lineTo(pk.x+sl,pk.y);ctx.stroke();
        ctx.beginPath();ctx.moveTo(pk.x,pk.y-sl);ctx.lineTo(pk.x,pk.y+sl);ctx.stroke();
      }
      ctx.restore();
    }

    // settling spark
    if(t>T.burstEnd){
      var sparkP=easeOut(prog(t,T.burstEnd,T.burstEnd+800));
      var sparkPulse=1+0.08*Math.sin(t/600*Math.PI);
      var sg=ctx.createRadialGradient(cx,cy,0,cx,cy,R*0.15*sparkPulse);
      sg.addColorStop(0,'rgba(255,255,255,0.95)');
      sg.addColorStop(0.35,'rgba(230,182,88,0.85)');
      sg.addColorStop(1,'rgba(201,148,58,0)');
      ctx.globalAlpha=sparkP*0.9;ctx.fillStyle=sg;
      ctx.beginPath();ctx.arc(cx,cy,R*0.13*sparkPulse,0,Math.PI*2);ctx.fill();
      var rl=R*0.24*sparkP;
      ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=0.7;
      ctx.globalAlpha=sparkP*0.75;
      ctx.beginPath();ctx.moveTo(cx-rl,cy);ctx.lineTo(cx+rl,cy);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx,cy-rl);ctx.lineTo(cx,cy+rl);ctx.stroke();
      ctx.globalAlpha=1;
    }

    if(t<TOTAL){
      requestAnimationFrame(tick);
    } else {
      // hand off to rotation loop
      if(typeof startKnotRotation==='function'){
        startKnotRotation(canvas,entries,monthIndex);
      }
      if(typeof onComplete==='function') onComplete();
    }
  }

  requestAnimationFrame(tick);
}

// ── end-of-month ceremony: full-screen weave + rotation + release ──
function showMonthEndCeremony(){
  // ── GUARDS ──
  var currentMonth = new Date().toISOString().slice(0,7);
  if(localStorage.getItem('gc_ceremony_seen_'+currentMonth)) return;
  if(document.getElementById('monthEndOverlay')) return;

  // Self-sufficient AI prefetch — if no caller prefetched, fire now so
  // the reflection text is ready by the time the ceremony's monthly
  // reflection slot tries to consume window._monthlyReflectionPrefetch.
  // Callers that DO prefetch (real-flow submit, demo month-end button)
  // see their promise preserved because prefetchMonthlyReflection is
  // idempotent — it overwrites with the latest request.
  if(!window._monthlyReflectionPrefetch && typeof prefetchMonthlyReflection === 'function'){
    prefetchMonthlyReflection();
  }
  // gc_ceremony_seen is written in beginDismissal, not here —
  // so a crash or backgrounded app doesn't permanently block the ceremony

  // ── SETUP ──
  var now = new Date();
  var monthName = now.toLocaleDateString('en-US',{month:'long'}).toLowerCase();
  var daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  var DAY_WORDS = ['','one','two','three','four','five','six','seven','eight','nine','ten',
    'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty',
    'twenty-one','twenty-two','twenty-three','twenty-four','twenty-five','twenty-six','twenty-seven',
    'twenty-eight','twenty-nine','thirty','thirty-one'];
  var morningsWord = (DAY_WORDS[daysInMonth]||String(daysInMonth))+' mornings';

  var entries = JSON.parse(localStorage.getItem('gc_entries')||'[]');
  var monthEntries = entries.filter(function(e){ return getEntryMonthKey(e) === currentMonth; });
  if(monthEntries.length === 0) return;
  var monthIndex = now.getMonth();

  // real-first: if the user has any authored entries this month, those
  // alone determine dominant emotion / word / message. Demo seeds don't
  // drown out a single real entry.
  var _poolForDom = _realFirst(monthEntries);
  var emoCounts = {};
  _poolForDom.forEach(function(e){ if(e.emo) emoCounts[e.emo] = (emoCounts[e.emo]||0) + 1; });
  var dominant = Object.keys(emoCounts).sort(function(a,b){return emoCounts[b]-emoCounts[a]})[0] || 'calm';
  var monthWord = PORTRAIT_WORDS[dominant] || dominant;
  var monthMsg = PORTRAIT_MESSAGES[dominant] || 'you were here. the chain remembers.';

  // use blended params so color reflects ALL emotions, not just dominant
  // keep the full `blend` around so each rendering layer can use its own
  // layer-specific color (full / mid / dom) — gives three emotions per knot
  var blend = null;
  var p;
  if(typeof _blendKnotParams === 'function' && monthEntries.length > 0){
    blend = _blendKnotParams(monthEntries, monthIndex);
    p = blend.full;
  } else {
    p = KNOT_PARAMS[dominant] || KNOT_FALLBACK;
  }
  // per-layer colors: outer = blended, middle = dominant, inner = dominant
  // (matches the grid tile look)
  var layerColors = blend
    ? [blend.full.color, blend.mid.color, blend.dom.color]
    : [p.color, p.color, p.color];

  // derive glowRgb from blended color (hex → rgb)
  var _ch = p.color.replace('#','');
  var _cr = parseInt(_ch.slice(0,2),16);
  var _cg = parseInt(_ch.slice(2,4),16);
  var _cb = parseInt(_ch.slice(4,6),16);
  var glowRgb = _cr+','+_cg+','+_cb;
  var glowBaseA = 0.25;

  // ── BUILD OVERLAY + ELEMENTS (all opacity:0 initially) ──
  var overlay = document.createElement('div');
  overlay.id = 'monthEndOverlay';
  overlay.style.cssText = [
    'position:fixed','inset:0','z-index:180',
    'background:rgba(7,5,3,0)','transition:background 1200ms ease',
    'overflow:hidden','cursor:default'
  ].join(';');

  // threshold line — horizontal across vertical center
  var line = document.createElement('div');
  line.style.cssText = [
    'position:absolute','top:50%','left:32px','right:32px','height:1px',
    'background:linear-gradient(90deg,transparent 0%,rgba(201,148,58,0.6) 50%,transparent 100%)',
    'transform:scaleX(0)','transform-origin:center',
    'transition:transform 800ms ease',
    'opacity:1','pointer-events:none'
  ].join(';');

  // announcement block — flows inline as the first item in knotWrap so
  // the full stack (text + rose + word + rule + message) is centered
  // together as one group, rather than text pinned to top with dead
  // space between it and the rose.
  var announceWrap = document.createElement('div');
  announceWrap.style.cssText = [
    'display:flex','flex-direction:column','align-items:center','gap:10px',
    'margin-bottom:8px',
    'pointer-events:none','transition:transform 3000ms ease, opacity 3000ms ease'
  ].join(';');

  var announce1 = document.createElement('p');
  announce1.textContent = 'the chain has woven';
  announce1.style.cssText = [
    'font-family:"Fraunces",serif','font-style:italic','font-weight:300',
    'font-size:13px','color:rgba(201,148,58,0.55)',
    'text-align:center','margin:0',
    'opacity:0','transition:opacity 800ms ease'
  ].join(';');

  var monthNameEl = document.createElement('p');
  monthNameEl.textContent = monthName;
  monthNameEl.style.cssText = [
    'font-family:"Fraunces",serif','font-style:italic','font-weight:300',
    'font-size:42px','color:rgba(230,182,88,0.9)',
    'letter-spacing:-0.02em','text-align:center','margin:0',
    'opacity:0','transition:opacity 1000ms ease'
  ].join(';');

  var morningsEl = document.createElement('p');
  morningsEl.textContent = morningsWord;
  morningsEl.style.cssText = [
    'font-family:"Fraunces",serif','font-style:italic','font-weight:300',
    'font-size:14px','color:rgba(245,237,224,0.35)',
    'text-align:center','margin:0',
    'opacity:0','transition:opacity 600ms ease'
  ].join(';');
  announceWrap.appendChild(announce1);
  announceWrap.appendChild(monthNameEl);
  announceWrap.appendChild(morningsEl);

  // whole stack — announcement + rose + word + rule + message — centered
  // as one group. No absolute-positioned announcement anymore.
  var knotWrap = document.createElement('div');
  knotWrap.style.cssText = [
    'position:absolute','inset:0',
    'display:flex','flex-direction:column','align-items:center','justify-content:center',
    'gap:14px','padding:32px','pointer-events:none'
  ].join(';');

  // rose sized fluidly to viewport — scales continuously across every
  // device from tiny phones (360px) through iPad Pro (1366px) and desktop.
  // 42% of the shortest viewport dimension, clamped 160-360px.
  var dpr = Math.min(window.devicePixelRatio||1, 2);
  var _vwShort = Math.min(window.innerWidth, window.innerHeight);
  var _cvsSize = Math.round(Math.max(160, Math.min(360, _vwShort * 0.42)));
  var knotCanvas = document.createElement('canvas');
  knotCanvas.style.cssText = [
    'width:'+_cvsSize+'px','height:'+_cvsSize+'px',
    'opacity:0','transition:opacity 600ms ease',
    'mix-blend-mode:screen'
  ].join(';');
  knotCanvas.width = _cvsSize * dpr;
  knotCanvas.height = _cvsSize * dpr;

  var wordEl = document.createElement('p');
  wordEl.textContent = monthWord;
  wordEl.style.cssText = [
    'font-family:"Fraunces",serif','font-style:italic','font-weight:300',
    'font-size:28px','color:var(--gold)',
    'letter-spacing:-0.02em','text-align:center','margin:0',
    'opacity:0','transition:opacity 900ms ease'
  ].join(';');

  var rule = document.createElement('div');
  rule.style.cssText = [
    'width:40px','height:1px',
    'background:linear-gradient(90deg,transparent,#c9943a,transparent)',
    'opacity:0','transition:opacity 400ms ease'
  ].join(';');

  // Paragraph-style witness (3–5 sentences). Initial floor shows the
  // hardcoded single-line PORTRAIT_MESSAGES; when the AI paragraph lands,
  // it replaces the content with per-sentence blocks on a stagger (same
  // treatment as the year-end Page 6 narrative).
  var msgEl = document.createElement('div');
  msgEl.setAttribute('data-month-reflection','1');
  msgEl.style.cssText = [
    'font-family:"Fraunces",serif','font-style:italic','font-weight:300',
    'font-size:14px','color:rgba(245,237,224,0.65)',
    'line-height:1.75','text-align:center','margin:0','max-width:360px',
    'opacity:0','transition:opacity 800ms ease'
  ].join(';');
  msgEl.innerHTML = '<p style="margin:0">' + monthMsg + '</p>';

  // ── Live AI monthly reflection — prefers a prefetched promise if one
  // was kicked off 3.2s earlier (see prefetchMonthlyReflection). Otherwise
  // fires fresh here. Either way, applies the result to msgEl when it lands.
  (function(){
    var _topEmos = Object.keys(emoCounts)
      .sort(function(a,b){ return emoCounts[b]-emoCounts[a]; })
      .slice(0,4);
    var _monthName = now.toLocaleDateString('en-US',{month:'long'}).toLowerCase();
    var _promise = window._monthlyReflectionPrefetch;
    window._monthlyReflectionPrefetch = null;
    if(!_promise){
      var _uName = '';
      try { _uName = (JSON.parse(localStorage.getItem('gc_user')||'{}').name || '').trim(); } catch(e){}
      _promise = fetch(API_BASE + '/monthly-reflection', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          month_name: _monthName,
          mornings: monthEntries.length,
          dominant: dominant,
          month_word: monthWord,
          top_emotions: _topEmos,
          name: _uName
        })
      }).then(function(r){ return r.json(); })
        .then(function(data){ return (data && data.success && data.reflection) ? data.reflection : null; })
        .catch(function(){ return null; });
    }
    // Split paragraph into sentences, render each as its own <p> with
    // a subtle stagger-in — matches the year-end Page 6 treatment.
    function _renderMonthParagraph(text){
      // sentence splitter — keeps trailing punctuation, drops empties
      var parts = (text || '').match(/[^.!?]+[.!?]+(?:["\u201d]?)(?:\s|$)/g) || [text];
      parts = parts.map(function(s){ return (s||'').trim(); }).filter(Boolean);
      // inject keyframes once
      if(!document.getElementById('_monthReflectionKeyframes')){
        var style = document.createElement('style');
        style.id = '_monthReflectionKeyframes';
        style.textContent = '@keyframes _mrIn { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }';
        document.head.appendChild(style);
      }
      var html = parts.map(function(s, i){
        var sizeRem = i === 0 ? 15.5 : 14;
        var opacity = i === 0 ? 0.9 : 0.75;
        var delay = 80 + i * 200;
        return '<p style="'
          + 'font-family:Fraunces,serif;font-style:italic;font-weight:300;'
          + 'font-size:' + sizeRem + 'px;line-height:1.75;letter-spacing:0.005em;'
          + 'color:rgba(245,237,224,' + opacity + ');'
          + 'text-align:center;margin:0 0 10px;'
          + 'opacity:0;transform:translateY(5px);'
          + 'animation:_mrIn 580ms ' + delay + 'ms cubic-bezier(.2,.7,.25,1) forwards;'
          + '">' + s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</p>';
      }).join('');
      msgEl.innerHTML = html;
    }
    _promise.then(function(reflection){
        if(!reflection) return;
        if(!msgEl.parentNode) return;
        var wasVisible = getComputedStyle(msgEl).opacity !== '0';
        if(wasVisible){
          msgEl.style.transition = 'opacity 500ms ease';
          msgEl.style.opacity = '0';
          setTimeout(function(){
            if(!msgEl.parentNode) return;
            _renderMonthParagraph(reflection);
            msgEl.style.opacity = '1';
          }, 520);
        } else {
          _renderMonthParagraph(reflection);
        }
      });
  })();

  knotWrap.appendChild(announceWrap);   // 'the chain has woven / april / thirty mornings'
  knotWrap.appendChild(knotCanvas);
  knotWrap.appendChild(wordEl);
  knotWrap.appendChild(rule);
  knotWrap.appendChild(msgEl);

  // in-page swipe hint — sits below msgEl inside page 1, fades in at t=14500
  var swipeHintInPage = document.createElement('p');
  swipeHintInPage.textContent = 'swipe to see your month →';
  swipeHintInPage.style.cssText = [
    'font-family:"DM Mono",monospace','font-size:9px',
    'color:rgba(201,148,58,0.2)','letter-spacing:0.1em',
    'text-align:center','margin:14px 0 0',
    'opacity:0','transition:opacity 1200ms ease',
    'pointer-events:none'
  ].join(';');
  knotWrap.appendChild(swipeHintInPage);

  // pages container — 6 pages, each 100vw wide, slides horizontally
  var pagesContainer = document.createElement('div');
  pagesContainer.id = 'mePages';
  pagesContainer.style.cssText = [
    'position:absolute','inset:0','display:flex',
    'width:600vw','height:100%',
    'transition:transform 400ms cubic-bezier(0.25,0.1,0.25,1)',
    'will-change:transform'
  ].join(';');

  function mkPage(){
    var pg = document.createElement('div');
    pg.style.cssText = [
      'width:100vw','height:100%',
      'flex-shrink:0','position:relative','overflow:hidden'
    ].join(';');
    return pg;
  }
  var pages = [mkPage(), mkPage(), mkPage(), mkPage(), mkPage(), mkPage()];
  // page 0 holds the existing beats 2-5 elements.
  // announceWrap is now injected as the first child of knotWrap in the
  // child-insertion block below (so the full stack centers as one group).
  pages[0].appendChild(knotWrap);
  pages.forEach(function(pg){ pagesContainer.appendChild(pg); });

  // dot indicators at bottom
  var dots = [];
  var dotsWrap = document.createElement('div');
  dotsWrap.style.cssText = [
    'position:absolute',
    'bottom:calc(max(48px,env(safe-area-inset-bottom)) + 48px)',
    'left:50%','transform:translateX(-50%)',
    'display:flex','gap:10px',
    'opacity:0','transition:opacity 800ms ease',
    'z-index:3'
  ].join(';');
  for(var di = 0; di < 6; di++){
    var dot = document.createElement('div');
    dot.dataset.page = String(di);
    dot.style.cssText = [
      'width:6px','height:6px','border-radius:50%',
      'background:'+(di===0 ? 'rgba(201,148,58,0.9)' : 'rgba(201,148,58,0.3)'),
      'transition:background 300ms ease, transform 200ms ease',
      'transform:'+(di===0 ? 'scale(1.3)' : 'scale(1)'),
      'cursor:pointer'
    ].join(';');
    dotsWrap.appendChild(dot);
    dots.push(dot);
  }

  overlay.appendChild(line);
  overlay.appendChild(pagesContainer);
  overlay.appendChild(dotsWrap);
  document.body.appendChild(overlay);

  // ── STATE SHARED ACROSS PHASES ──
  var particles = [];
  var phase = 'idle'; // 'idle' | 'weave' | 'rotate' | 'contract' | 'done'
  var phaseStartTs = null;
  var rotation = 0;
  var rotSpeed = 0.0008;
  var currentScale = 1;
  var rafId = null;
  var weaveComplete = false;
  var rotationLoopActive = true; // gates tick() rescheduling (paused when on page 2+)

  // ── REDUCED MOTION FALLBACK ──
  var reducedMotion = false;
  try{ reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}

  if(reducedMotion){
    // minimal sequence: veil, static knot + text, simple carry-forward button
    overlay.style.transition = 'background 300ms ease';
    requestAnimationFrame(function(){ overlay.style.background = 'rgba(7,5,3,0.92)'; });
    announce1.style.transition = monthNameEl.style.transition = morningsEl.style.transition = 'opacity 200ms ease';
    knotCanvas.style.transition = wordEl.style.transition = rule.style.transition = msgEl.style.transition = 'opacity 200ms ease';
    // add a simple bottom carry-forward button (reduced motion skips swipe UI entirely)
    var rmBtn = document.createElement('button');
    rmBtn.textContent = 'carry it forward';
    rmBtn.style.cssText = [
      'position:absolute','bottom:max(48px,env(safe-area-inset-bottom))',
      'left:50%','transform:translateX(-50%)',
      'padding:14px 28px','background:rgba(201,148,58,0.08)',
      'border:1px solid var(--gold)','border-radius:14px',
      'color:var(--gold)','font-family:"Fraunces",serif','font-style:italic','font-size:14px',
      'cursor:pointer','opacity:0','transition:opacity 200ms ease','z-index:4'
    ].join(';');
    overlay.appendChild(rmBtn);
    rmBtn.addEventListener('click', function(){
      overlay.style.transition = 'opacity 400ms ease';
      overlay.style.opacity = '0';
      setTimeout(function(){
        if(overlay.parentNode) overlay.remove();
        if(typeof populatePortrait === 'function'){ try{ populatePortrait(); }catch(e){} }
      }, 400);
    });
    requestAnimationFrame(function(){
      drawKnotOnCanvas(knotCanvas, monthEntries, monthIndex);
      announce1.style.opacity = '1';
      monthNameEl.style.opacity = '1';
      morningsEl.style.opacity = '1';
      knotCanvas.style.opacity = '1';
      wordEl.style.opacity = '1';
      rule.style.opacity = '1';
      msgEl.style.opacity = '1';
    });
    setTimeout(function(){ rmBtn.style.opacity = '1'; }, 3000);
    return;
  }

  // ── BEAT 2 — VEIL + THRESHOLD LINE ──
  requestAnimationFrame(function(){ overlay.style.background = 'rgba(7,5,3,0.92)'; });
  setTimeout(function(){ line.style.transform = 'scaleX(1)'; }, 200);
  setTimeout(function(){
    line.style.transition = 'opacity 400ms ease';
    line.style.opacity = '0';
  }, 1000);

  // ── BEAT 3 — ANNOUNCEMENT ──
  setTimeout(function(){ announce1.style.opacity = '1'; }, 1500);
  setTimeout(function(){ monthNameEl.style.opacity = '1'; }, 2100);
  setTimeout(function(){ morningsEl.style.opacity = '1'; }, 3100);

  // ── BEAT 4 — DRIFT (announcement lifts up to make room for the knot; keeps its full presence) ──
  setTimeout(function(){
    announceWrap.style.transform = 'translateY(-90px)';
    // opacity stays at 1 — per-element opacities from beat 3 remain: announce1 0.55, monthName 0.9, mornings 0.35
  }, 4000);

  // ── BEAT 4 cont — WEAVE ──
  // custom timings per spec: L0 dur 1800, L1 start 600 dur 1400, L2 start 1100 dur 1000
  // (max end = 2100ms; we pad to 3500ms before moving to bloom at t=8000)
  var weaveCtx = knotCanvas.getContext('2d');
  weaveCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  function clearCanvas(){
    weaveCtx.clearRect(0,0,W_CVS,H_CVS);
  }
  var W_CVS = 220, H_CVS = 220;
  var cx = W_CVS/2, cy = H_CVS/2;
  var R = Math.min(W_CVS, H_CVS) * 0.38;
  var seed = monthIndex * 137.5;
  // Seed of Life needs its own smaller radius so
  // the full geometry fits inside the canvas.
  // Each outer circle center is seedR from canvas
  // center, drawn with radius seedR — so outermost
  // point is 2*seedR from center. With padding:
  // 2*seedR <= W_CVS/2 * 0.88 → seedR <= 48px
  var seedR = Math.min(W_CVS, H_CVS) * 0.215;

  // 7 Seed of Life circle centers for the seed phase
  var seedCircles = [{x:cx, y:cy}];
  for(var _si=0; _si<6; _si++){
    var _sa = (_si/6)*Math.PI*2 - Math.PI/2;
    seedCircles.push({
      x: cx + seedR*Math.cos(_sa),
      y: cy + seedR*Math.sin(_sa)
    });
  }

  // burst particles for seed phase
  var seedParticles = [];
  var seedBurstFired = false;

  function spawnSeedBurst(count, ox, oy, spd, life, sMin, sMax){
    for(var _i=0; _i<count; _i++){
      var _a = Math.random()*Math.PI*2;
      var _s = spd*(0.4+Math.random()*0.6);
      var _cols = ['#e6b658','#fff5cc','#fffdf5',
                   'rgba(255,255,255,0.9)', p.color];
      seedParticles.push({
        x: ox + Math.cos(_a)*R*0.12*Math.random(),
        y: oy + Math.sin(_a)*R*0.12*Math.random(),
        vx: Math.cos(_a)*_s, vy: Math.sin(_a)*_s,
        life: 1, decay: 1/(life*60),
        size: sMin + Math.random()*(sMax-sMin),
        color: _cols[Math.floor(Math.random()*_cols.length)]
      });
    }
  }

  function drawSeedParticles(){
    for(var _pi=seedParticles.length-1; _pi>=0; _pi--){
      var _pk = seedParticles[_pi];
      _pk.x += _pk.vx; _pk.y += _pk.vy;
      _pk.vx *= 0.975; _pk.vy *= 0.975;
      _pk.life -= _pk.decay;
      if(_pk.life <= 0){ seedParticles.splice(_pi,1); continue; }
      var _pa = _pk.life*(_pk.life>0.5?1:_pk.life*2);
      weaveCtx.save();
      weaveCtx.globalAlpha = _pa*0.85;
      weaveCtx.fillStyle = _pk.color;
      weaveCtx.beginPath();
      weaveCtx.arc(_pk.x,_pk.y,_pk.size*Math.max(0.2,_pk.life),0,Math.PI*2);
      weaveCtx.fill();
      if(_pk.size>1.5 && _pk.life>0.3){
        var _sl=_pk.size*_pk.life*1.1;
        weaveCtx.strokeStyle=_pk.color; weaveCtx.lineWidth=0.4;
        weaveCtx.beginPath(); weaveCtx.moveTo(_pk.x-_sl,_pk.y); weaveCtx.lineTo(_pk.x+_sl,_pk.y); weaveCtx.stroke();
        weaveCtx.beginPath(); weaveCtx.moveTo(_pk.x,_pk.y-_sl); weaveCtx.lineTo(_pk.x,_pk.y+_sl); weaveCtx.stroke();
      }
      weaveCtx.restore();
    }
  }

  // seed phase timeline (ms from seed phase start)
  // 0    – 1800: circles draw in staggered
  // 1600 – 3400: rose begins tracing (overlap with circles still visible)
  // 3200 – 4400: circles fade out
  // 4400:        BURST fires
  // 4400 – 5000: burst particles scatter
  // 5000 – 6200: rose settles with spark
  // 6200:        transitions to existing 'weave' phase
  var SEED_TOTAL = 6200;
  var SEED_T = {
    circleEnd:  1800,
    roseStart:  1600,
    roseEnd:    3200,
    fadeStart:  3200,
    fadeEnd:    4400,
    burstAt:    4400,
    burstEnd:   5000,
    settleEnd:  6200
  };

  var sizeBoost = R < 60 ? (60/R) : 1;
  var STEPS = 600;

  // precompute layer points
  function buildLayer(layerIndex){
    var layerR = R * (1.05 - layerIndex*0.15);
    var pts = [];
    for(var i = 0; i <= STEPS; i++){
      var t = (i/STEPS) * Math.PI * 2;
      var k = p.petals%2===0 ? p.petals/2 : p.petals;
      var r1 = Math.abs(Math.cos(k*t + p.twist*Math.PI));
      var r2 = Math.pow(r1, 1 - p.round*0.5 + p.sharp*0.3);
      var harmonic = 1 + p.sharp*0.15 * Math.cos((p.petals*2+1)*t + seed);
      var r = layerR * r2 * harmonic;
      // Option A interlace offsets: 0, π/12, π/6 — petals weave through each other's gaps
      var angle = t + [0, Math.PI/12, Math.PI/6][layerIndex];
      pts.push({x: cx + r*Math.cos(angle), y: cy + r*Math.sin(angle)});
    }
    return pts;
  }
  var layerPts = [buildLayer(0), buildLayer(1), buildLayer(2)];
  var layerCfg = [
    { start:    0, duration: 1800, alpha: 1.00 },
    { start:  600, duration: 1400, alpha: 0.75 },
    { start: 1100, duration: 1000, alpha: 0.55 }
  ];
  var WEAVE_DURATION = 2100; // max end across layers
  var WEAVE_HOLD = 1400; // pad so total time to bloom = 3500ms

  function easeInOut(t){ return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; }

  function drawKnotWithScale(scale){
    clearCanvas();
    // glow
    var grd = weaveCtx.createRadialGradient(cx,cy,0,cx,cy,R*1.6);
    grd.addColorStop(0, 'rgba('+glowRgb+','+glowBaseA+')');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    weaveCtx.fillStyle = grd;
    weaveCtx.fillRect(0,0,W_CVS,H_CVS);
    // scaled knot
    weaveCtx.save();
    weaveCtx.translate(cx, cy);
    weaveCtx.scale(scale, scale);
    weaveCtx.translate(-cx, -cy);
    // all 3 layers — each uses its own layer color (outer/mid/dom)
    for(var layer = 0; layer < 3; layer++){
      var pts = layerPts[layer];
      var alpha = [1.00, 0.75, 0.55][layer];
      var lcolor = layerColors[layer];
      weaveCtx.beginPath();
      for(var i = 0; i <= STEPS; i++){
        var pt = pts[i];
        var dx = pt.x - cx, dy = pt.y - cy;
        var r = Math.sqrt(dx*dx + dy*dy);
        var ang = Math.atan2(dy, dx) + rotation;
        var x = cx + r*Math.cos(ang);
        var y = cy + r*Math.sin(ang);
        if(i===0) weaveCtx.moveTo(x,y); else weaveCtx.lineTo(x,y);
      }
      weaveCtx.closePath();
      weaveCtx.globalAlpha = alpha*0.04;
      weaveCtx.fillStyle = lcolor;
      weaveCtx.fill();
      weaveCtx.globalAlpha = alpha;
      weaveCtx.strokeStyle = lcolor;
      // outer layer thickest, inner thinnest
      var _sm = layer === 0 ? 1.15 : layer === 1 ? 0.90 : 0.55;
      weaveCtx.lineWidth = p.strokeW * _sm * sizeBoost;
      weaveCtx.lineCap = 'round';
      weaveCtx.lineJoin = 'round';
      weaveCtx.stroke();
    }
    weaveCtx.globalAlpha = 1;
    weaveCtx.restore();
  }

  // diamond sparkle pool — tiny canvas particles
  // that drift from the diamond center
  var diamondSparks = [];
  var _lastSpawnT = 0;

  function spawnDiamondSpark(nowT){
    var angle = Math.random()*Math.PI*2;
    var dist  = 2 + Math.random()*3;
    diamondSparks.push({
      x:  cx + Math.cos(angle)*dist,
      y:  cy + Math.sin(angle)*dist,
      vx: Math.cos(angle)*0.28 + (Math.random()-0.5)*0.35,
      vy: Math.sin(angle)*0.28 + (Math.random()-0.5)*0.35 - 0.12,
      life:  1,
      decay: 0.010 + Math.random()*0.016,
      size:  0.4 + Math.random()*1.1,
      color: Math.random()<0.55
        ? 'rgba(255,255,255,0.95)'
        : Math.random()<0.5 ? '#e6b658' : '#fff5cc'
    });
  }

  function drawDiamondSparks(){
    for(var _di=diamondSparks.length-1;_di>=0;_di--){
      var _ds=diamondSparks[_di];
      _ds.x+=_ds.vx; _ds.y+=_ds.vy;
      _ds.vy-=0.003;
      _ds.life-=_ds.decay;
      if(_ds.life<=0){diamondSparks.splice(_di,1);continue;}
      var _da=_ds.life*(_ds.life>0.4?1:_ds.life/0.4);
      weaveCtx.save();
      weaveCtx.globalAlpha=_da*0.9;
      weaveCtx.fillStyle=_ds.color;
      weaveCtx.beginPath();
      weaveCtx.arc(_ds.x,_ds.y,
        _ds.size*Math.max(0.2,_ds.life),0,Math.PI*2);
      weaveCtx.fill();
      if(_ds.size>0.85 && _ds.life>0.45){
        var _dsl=_ds.size*_ds.life*1.6;
        weaveCtx.strokeStyle=_ds.color;
        weaveCtx.lineWidth=0.3;
        weaveCtx.globalAlpha=_da*0.45;
        weaveCtx.beginPath();
        weaveCtx.moveTo(_ds.x-_dsl,_ds.y);
        weaveCtx.lineTo(_ds.x+_dsl,_ds.y);
        weaveCtx.stroke();
        weaveCtx.beginPath();
        weaveCtx.moveTo(_ds.x,_ds.y-_dsl);
        weaveCtx.lineTo(_ds.x,_ds.y+_dsl);
        weaveCtx.stroke();
      }
      weaveCtx.restore();
    }
  }

  function drawSpark(scaleMultiplier, nowT){
    var baseR = Math.max(3, R*0.065)
      * (scaleMultiplier || 1);

    // heartbeat — 2s period slow pulse
    var _bt = nowT || 0;
    var beat    = 1 + 0.18*Math.sin(_bt/1000*Math.PI);
    var shimmer = 1 + 0.06*Math.sin(_bt/280*Math.PI);
    var pulse   = beat * shimmer * (scaleMultiplier || 1);
    var r       = baseR * pulse;

    // spawn sparkle particles proportional to beat intensity
    var beatStrength = (beat - 1) / 0.18;
    if(_bt - _lastSpawnT > 60){
      if(Math.random() < 0.18 + beatStrength*0.28){
        spawnDiamondSpark(_bt);
      }
      _lastSpawnT = _bt;
    }

    // draw drifting diamond sparks first (behind diamond)
    drawDiamondSparks();

    // outer bloom — large soft gold glow
    var bloom = weaveCtx.createRadialGradient(
      cx,cy,0, cx,cy, r*7*pulse);
    bloom.addColorStop(0,   'rgba('+glowRgb+',0.20)');
    bloom.addColorStop(0.3, 'rgba('+glowRgb+',0.08)');
    bloom.addColorStop(0.7, 'rgba('+glowRgb+',0.02)');
    bloom.addColorStop(1,   'rgba(0,0,0,0)');
    weaveCtx.fillStyle = bloom;
    weaveCtx.fillRect(
      cx-r*8, cy-r*8, r*16, r*16);

    // mid glow
    var mid = weaveCtx.createRadialGradient(
      cx,cy,0, cx,cy, r*3.5);
    mid.addColorStop(0,   'rgba(255,252,230,0.55)');
    mid.addColorStop(0.4, 'rgba(230,182,88,0.30)');
    mid.addColorStop(1,   'rgba(201,148,58,0)');
    weaveCtx.globalAlpha = 1;
    weaveCtx.fillStyle = mid;
    weaveCtx.beginPath();
    weaveCtx.arc(cx,cy,r*3.5,0,Math.PI*2);
    weaveCtx.fill();

    // white core
    var core = weaveCtx.createRadialGradient(
      cx,cy,0, cx,cy, r*1.4);
    core.addColorStop(0,    'rgba(255,255,255,1.0)');
    core.addColorStop(0.35, 'rgba(255,252,230,0.95)');
    core.addColorStop(0.7,  'rgba(230,182,88,0.6)');
    core.addColorStop(1,    'rgba(201,148,58,0)');
    weaveCtx.fillStyle = core;
    weaveCtx.beginPath();
    weaveCtx.arc(cx,cy,r,0,Math.PI*2);
    weaveCtx.fill();

    // 4 long rays — primary diamond cross
    var rl = r * 4.5 * pulse;
    weaveCtx.save();
    weaveCtx.strokeStyle = 'rgba(255,255,255,0.75)';
    weaveCtx.lineWidth = 0.9;
    weaveCtx.globalAlpha = 0.85;
    weaveCtx.beginPath();
    weaveCtx.moveTo(cx-rl,cy); weaveCtx.lineTo(cx+rl,cy);
    weaveCtx.stroke();
    weaveCtx.beginPath();
    weaveCtx.moveTo(cx,cy-rl); weaveCtx.lineTo(cx,cy+rl);
    weaveCtx.stroke();
    weaveCtx.restore();

    // 4 diagonal rays — shorter, softer
    var rd = rl * 0.55;
    weaveCtx.save();
    weaveCtx.strokeStyle = 'rgba(255,255,255,0.32)';
    weaveCtx.lineWidth = 0.55;
    weaveCtx.globalAlpha = 0.48;
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function(d){
      weaveCtx.beginPath();
      weaveCtx.moveTo(cx+d[0]*rd, cy+d[1]*rd);
      weaveCtx.lineTo(cx-d[0]*rd, cy-d[1]*rd);
      weaveCtx.stroke();
    });
    weaveCtx.restore();

    // solid white center dot
    weaveCtx.globalAlpha = 1;
    weaveCtx.fillStyle = 'rgba(255,255,255,1.0)';
    weaveCtx.beginPath();
    weaveCtx.arc(cx,cy,r*0.28,0,Math.PI*2);
    weaveCtx.fill();

    weaveCtx.globalAlpha = 1;
  }

  function tick(ts){
    if(phase === 'done') return;
    // safety: if the overlay has been removed from DOM, kill the loop to avoid leaks
    if(!overlay.parentNode){ rotationLoopActive = false; phase = 'done'; return; }
    if(!phaseStartTs) phaseStartTs = ts;
    var elapsed = ts - phaseStartTs;

    if(phase === 'seed'){
    var _t = Math.min(elapsed, SEED_TOTAL);

    clearCanvas();
    weaveCtx.globalCompositeOperation = 'source-over';
    weaveCtx.globalAlpha = 1;

    // glow
    var _glowA = _t < SEED_T.fadeStart ? (_t/800)*0.25
      : _t < SEED_T.burstAt ? 0.25
      : _t < SEED_T.burstEnd ? 0.25 + ((_t-SEED_T.burstAt)/(SEED_T.burstEnd-SEED_T.burstAt))*0.55
      : 0.80 - ((_t-SEED_T.burstEnd)/(SEED_T.settleEnd-SEED_T.burstEnd))*0.55;
    _glowA = Math.max(0, Math.min(1, _glowA));
    var _grd = weaveCtx.createRadialGradient(cx,cy,0,cx,cy,R*1.4);
    _grd.addColorStop(0,   'rgba('+glowRgb+','+(_glowA*1.2)+')');
    _grd.addColorStop(0.5, 'rgba('+glowRgb+','+(_glowA*0.4)+')');
    _grd.addColorStop(1,   'rgba(0,0,0,0)');
    weaveCtx.fillStyle = _grd;
    weaveCtx.beginPath(); weaveCtx.arc(cx,cy,R*1.4,0,Math.PI*2); weaveCtx.fill();

    // circles draw in + fade out
    var _circleAlpha = _t < SEED_T.fadeStart ? 1
      : _t < SEED_T.burstAt
        ? 1 - Math.pow((_t-SEED_T.fadeStart)/(SEED_T.burstAt-SEED_T.fadeStart), 3)
      : 0;
    if(_circleAlpha > 0.005){
      var _stagger = SEED_T.circleEnd / 7;
      for(var _ci=0; _ci<7; _ci++){
        var _cStart = _ci*_stagger*0.65;
        var _cEnd   = _cStart + _stagger*1.8;
        var _cp = Math.max(0, Math.min((_t-_cStart)/(_cEnd-_cStart), 1));
        _cp = 1 - Math.pow(1-_cp, 3); // easeOut
        if(_cp <= 0.002) continue;
        var _cc = seedCircles[_ci];
        weaveCtx.beginPath();
        weaveCtx.arc(_cc.x,_cc.y,seedR,-Math.PI/2,-Math.PI/2+_cp*Math.PI*2);
        weaveCtx.strokeStyle = p.color;
        weaveCtx.globalAlpha = _circleAlpha * (_ci===0 ? 0.4 : 0.62);
        weaveCtx.lineWidth = 1.2;
        weaveCtx.lineCap = 'round';
        weaveCtx.stroke();
        weaveCtx.globalAlpha = 1;
      }
    }

    // rose curve traces in
    if(_t > SEED_T.roseStart){
      var _roseP = Math.min((_t-SEED_T.roseStart)/(SEED_T.roseEnd-SEED_T.roseStart),1);
      _roseP = 1 - Math.pow(1-_roseP, 3);
      var _roseExtra = _t > SEED_T.burstAt
        ? ((_t-SEED_T.burstAt)/(SEED_T.burstEnd-SEED_T.burstAt))*0.4 : 0;
      var _roseSettle = _t > SEED_T.burstEnd
        ? (_t-SEED_T.burstEnd)/(SEED_T.settleEnd-SEED_T.burstEnd) : 0;
      var _roseAlpha = Math.min(1,
        _roseP*(0.8+_roseExtra)*(1-_roseSettle*0.15)+_roseSettle*0.85);
      var _steps = Math.floor(_roseP*STEPS);

      // outer layer
      weaveCtx.beginPath();
      for(var _i=0; _i<=_steps; _i++){
        var _tv = (_i/STEPS)*Math.PI*2;
        var _k  = p.petals%2===0 ? p.petals/2 : p.petals;
        var _r1 = Math.abs(Math.cos(_k*_tv+p.twist*Math.PI));
        var _r2 = Math.pow(_r1, 1-p.round*0.5+p.sharp*0.3);
        var _hh = 1+p.sharp*0.15*Math.cos((p.petals*2+1)*_tv+seed);
        var _rv = R*1.05*_r2*_hh;
        var _x  = cx+_rv*Math.cos(_tv), _y=cy+_rv*Math.sin(_tv);
        if(_i===0) weaveCtx.moveTo(_x,_y); else weaveCtx.lineTo(_x,_y);
      }
      weaveCtx.strokeStyle = p.color;
      weaveCtx.globalAlpha = _roseAlpha;
      weaveCtx.lineWidth = p.strokeW*(1+_roseExtra*0.5)*sizeBoost;
      weaveCtx.lineCap = 'round'; weaveCtx.stroke(); weaveCtx.globalAlpha=1;

      // glowing trace tip
      if(_roseP < 0.98 && _t < SEED_T.fadeEnd){
        var _tipT = (_steps/STEPS)*Math.PI*2;
        var _k2 = p.petals%2===0?p.petals/2:p.petals;
        var _tr1 = Math.abs(Math.cos(_k2*_tipT+p.twist*Math.PI));
        var _tr2 = Math.pow(_tr1,1-p.round*0.5+p.sharp*0.3);
        var _tipR = R*1.05*_tr2;
        var _tipX = cx+_tipR*Math.cos(_tipT), _tipY=cy+_tipR*Math.sin(_tipT);
        var _tg = weaveCtx.createRadialGradient(_tipX,_tipY,0,_tipX,_tipY,R*0.22);
        _tg.addColorStop(0,'rgba(255,255,255,0.95)');
        _tg.addColorStop(0.25,'rgba(230,182,88,0.8)');
        _tg.addColorStop(1,'rgba(201,148,58,0)');
        weaveCtx.globalAlpha=_roseP*0.9; weaveCtx.fillStyle=_tg;
        weaveCtx.beginPath(); weaveCtx.arc(_tipX,_tipY,R*0.14,0,Math.PI*2); weaveCtx.fill();
        weaveCtx.globalAlpha=1;
      }
    }

    // burst fire
    if(_t >= SEED_T.burstAt && !seedBurstFired){
      seedBurstFired = true;
      spawnSeedBurst(80, cx, cy, seedR*0.04,  2.8, 1.0, 3.0);
      seedCircles.forEach(function(_c){
        spawnSeedBurst(18, _c.x, _c.y, seedR*0.03, 2.2, 0.5, 1.8);
      });
      spawnSeedBurst(25, cx, cy, seedR*0.015, 4.5, 1.5, 4.0);
      // wake up evaporating DOM particles
      // during the burst so they overlap with
      // the canvas burst particles
      if(!particleSpawnActive){
        particleSpawnActive = true;
        restartParticleSpawnLoop();
      }
    }
    // burst flash
    if(_t > SEED_T.burstAt && _t < SEED_T.burstAt+220){
      var _fp = 1-((_t-SEED_T.burstAt)/220);
      weaveCtx.fillStyle='rgba(255,245,220,'+(_fp*0.2)+')';
      weaveCtx.fillRect(0,0,W_CVS,H_CVS);
    }

    // draw particles
    drawSeedParticles();

    // settling spark after burst
    if(_t > SEED_T.burstEnd){
      var _sp = Math.min((_t-SEED_T.burstEnd)/800, 1);
      _sp = 1-Math.pow(1-_sp,3);
      var _pulse = 1+0.08*Math.sin(_t/600*Math.PI);
      var _sg = weaveCtx.createRadialGradient(cx,cy,0,cx,cy,R*0.15*_pulse);
      _sg.addColorStop(0,'rgba(255,255,255,0.95)');
      _sg.addColorStop(0.35,'rgba(230,182,88,0.85)');
      _sg.addColorStop(1,'rgba(201,148,58,0)');
      weaveCtx.globalAlpha=_sp*0.9; weaveCtx.fillStyle=_sg;
      weaveCtx.beginPath(); weaveCtx.arc(cx,cy,R*0.13*_pulse,0,Math.PI*2); weaveCtx.fill();
      var _rl=R*0.24*_sp;
      weaveCtx.strokeStyle='rgba(255,255,255,0.5)'; weaveCtx.lineWidth=0.7;
      weaveCtx.globalAlpha=_sp*0.75;
      weaveCtx.beginPath(); weaveCtx.moveTo(cx-_rl,cy); weaveCtx.lineTo(cx+_rl,cy); weaveCtx.stroke();
      weaveCtx.beginPath(); weaveCtx.moveTo(cx,cy-_rl); weaveCtx.lineTo(cx,cy+_rl); weaveCtx.stroke();
      weaveCtx.globalAlpha=1;
    }

    // resolve the complete rose into the three-layer colored knot during settle
    // this avoids the hard jump when phase switches from 'seed' to 'rotate'
    if(_t > SEED_T.burstEnd){
      var _settleProg = Math.min(1,
        (_t-SEED_T.burstEnd)/(SEED_T.settleEnd-SEED_T.burstEnd));
      // ease-in-out so the cross-fade feels gentle
      var _eP = _settleProg < 0.5
        ? 2*_settleProg*_settleProg
        : -1 + (4 - 2*_settleProg)*_settleProg;

      // target alphas / stroke-widths for each layer (match rotate-phase values)
      var _targetAlphas  = [1.00, 0.75, 0.55];
      var _targetStrokes = [1.15, 0.90, 0.55];
      // rose (single-color outer) alpha decays as layers fade in
      var _roseA = (1 - _eP) * 0.9;

      // outer rose hold (the single-color rose we just animated) — fades out
      if(_roseA > 0.01){
        weaveCtx.globalAlpha = _roseA;
        weaveCtx.strokeStyle = p.color;
        weaveCtx.lineWidth = p.strokeW * sizeBoost;
        weaveCtx.lineCap = 'round';
        var _hpts = layerPts[0];
        weaveCtx.beginPath();
        for(var _hi=0; _hi<=STEPS; _hi++){
          var _hpt = _hpts[_hi];
          if(_hi===0) weaveCtx.moveTo(_hpt.x, _hpt.y);
          else weaveCtx.lineTo(_hpt.x, _hpt.y);
        }
        weaveCtx.stroke();
      }

      // three target layers — fade in as the rose fades out
      var _layerColorsSeed = (typeof layerColors !== 'undefined' && layerColors)
        ? layerColors
        : [p.color, p.color, p.color];
      for(var _li=0; _li<3; _li++){
        var _lp = layerPts[_li];
        var _la = _targetAlphas[_li] * _eP;
        if(_la < 0.01) continue;
        weaveCtx.globalAlpha = _la;
        weaveCtx.strokeStyle = _layerColorsSeed[_li];
        weaveCtx.lineWidth = p.strokeW * _targetStrokes[_li] * sizeBoost;
        weaveCtx.lineCap = 'round';
        weaveCtx.lineJoin = 'round';
        weaveCtx.beginPath();
        for(var _lj=0; _lj<=STEPS; _lj++){
          var _lpt = _lp[_lj];
          if(_lj===0) weaveCtx.moveTo(_lpt.x, _lpt.y);
          else weaveCtx.lineTo(_lpt.x, _lpt.y);
        }
        weaveCtx.stroke();
      }
      weaveCtx.globalAlpha = 1;
    }

    // skip weave redraw — rose is already drawn
    // go straight to rotate so it continues seamlessly
    if(_t >= SEED_TOTAL){
      phase = 'rotate';
      phaseStartTs = null;
      rotation = 0;
      rotSpeed = 0.0003;
      weaveComplete = true;
      // start evaporating particles as knot settles
      particleSpawnActive = true;
      restartParticleSpawnLoop();
    }
  } // end phase === 'seed'

    if(phase === 'weave'){
      clearCanvas();
      weaveCtx.globalCompositeOperation = 'source-over';
      weaveCtx.globalAlpha = 1;
      // pulsing background glow — peaks at each layer start
      var glowScale = 1;
      layerCfg.forEach(function(cfg){
        var pd = elapsed - cfg.start;
        if(pd >= 0 && pd <= 800){
          var s = 1 + 0.2 * Math.sin((pd/800) * Math.PI);
          if(s > glowScale) glowScale = s;
        }
      });
      var glowR = R * 1.1 * glowScale;
      var grd = weaveCtx.createRadialGradient(cx,cy,0,cx,cy,glowR);
      grd.addColorStop(0,   'rgba('+glowRgb+','+(glowBaseA * glowScale)+')');
      grd.addColorStop(0.6, 'rgba('+glowRgb+','+(glowBaseA * glowScale * 0.3)+')');
      grd.addColorStop(1,   'rgba(0,0,0,0)');
      weaveCtx.fillStyle = grd;
      weaveCtx.fillRect(0,0,W_CVS,H_CVS);

      // per-layer progressive stroke
      layerCfg.forEach(function(cfg, i){
        var ld = elapsed - cfg.start;
        if(ld <= 0) return;
        var rawP = Math.min(ld / cfg.duration, 1);
        var prog = easeInOut(rawP);
        var count = Math.floor(prog * STEPS);
        if(count < 2) return;
        var pts = layerPts[i];
        var lcolor = layerColors[i];
        // fill
        weaveCtx.beginPath();
        weaveCtx.moveTo(pts[0].x, pts[0].y);
        for(var j = 1; j < count; j++) weaveCtx.lineTo(pts[j].x, pts[j].y);
        weaveCtx.globalAlpha = cfg.alpha * 0.04 * rawP;
        weaveCtx.fillStyle = lcolor;
        weaveCtx.fill();
        // stroke
        weaveCtx.beginPath();
        weaveCtx.moveTo(pts[0].x, pts[0].y);
        for(var j2 = 1; j2 < count; j2++) weaveCtx.lineTo(pts[j2].x, pts[j2].y);
        weaveCtx.globalAlpha = cfg.alpha * rawP;
        weaveCtx.strokeStyle = lcolor;
        // outer thickest, inner thinnest
        var _sm2 = i === 0 ? 1.15 : i === 1 ? 0.90 : 0.55;
        weaveCtx.lineWidth = p.strokeW * _sm2 * sizeBoost;
        weaveCtx.lineCap = 'round';
        weaveCtx.lineJoin = 'round';
        weaveCtx.stroke();
        // tip dot (larger than portrait version)
        if(rawP < 1 && count > 0){
          var tip = pts[count-1];
          var tipA = (1 - rawP) * 0.95;
          var tipR = 10;
          var tg = weaveCtx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, tipR);
          tg.addColorStop(0, 'rgba(255,255,255,'+tipA+')');
          tg.addColorStop(0.4, 'rgba('+glowRgb+','+(tipA*0.7)+')');
          tg.addColorStop(1, 'rgba(0,0,0,0)');
          weaveCtx.globalAlpha = 1;
          weaveCtx.fillStyle = tg;
          weaveCtx.beginPath();
          weaveCtx.arc(tip.x, tip.y, tipR, 0, Math.PI*2);
          weaveCtx.fill();
        }
      });
      weaveCtx.globalAlpha = 1;

      if(elapsed >= WEAVE_DURATION + WEAVE_HOLD){
        weaveComplete = true;
        phase = 'rotate';
        phaseStartTs = ts;
      }
    } else if(phase === 'rotate'){
      // decelerate speed toward 0.0003
      if(rotSpeed > 0.0003) rotSpeed = Math.max(0.0003, rotSpeed - 0.000003);
      rotation += rotSpeed;
      drawKnotWithScale(1);
      // bloom spark within first 800ms of this phase
      var bloomScale = 1;
      if(!weaveComplete){
        if(elapsed < 300) bloomScale = 1 + (elapsed/300) * 1.5;        // 1 -> 2.5
        else if(elapsed < 800) bloomScale = 2.5 - ((elapsed-300)/500) * 1.5; // 2.5 -> 1
      }
      drawSpark(bloomScale, ts);
    } else if(phase === 'contract'){
      rotSpeed += 0.00005;
      rotation += rotSpeed;
      currentScale -= 0.04;
      if(currentScale <= 0){
        phase = 'done';
        clearCanvas();
        return; // ripple is handled by beginDismissal at the visible knot position
      }
      drawKnotWithScale(currentScale);
      drawSpark(currentScale, ts);
    }
    if(rotationLoopActive) rafId = requestAnimationFrame(tick);
  }

  // Beat 4 cont — start seed at t=4500
  setTimeout(function(){
    knotCanvas.style.opacity = '1';
    phase = 'seed';
    phaseStartTs = null;
    rafId = requestAnimationFrame(tick);
  }, 4500);

  // ── BEAT 5 — word, rule, message after weave completes (seed+weave = +6200ms) ──
  setTimeout(function(){ wordEl.style.opacity = '1'; }, 14400);
  setTimeout(function(){ rule.style.opacity   = '1'; }, 14900);
  setTimeout(function(){ msgEl.style.opacity  = '1'; }, 15200);

  // ── particle spawner (shared across beats 7 + swipe resume) ──
  function spawnParticle(){
    if(phase === 'contract' || phase === 'done') return;
    if(!particleSpawnActive) return;
    var rect = knotCanvas.getBoundingClientRect();
    var ang = Math.random() * Math.PI * 2;

    // spawn anywhere in the knot area, not just
    // the outer ring — some from center, some from edge
    var dist = 20 + Math.random() * 80;
    var startX = rect.left + rect.width/2
      + dist * Math.cos(ang);
    var startY = rect.top + rect.height/2
      + dist * Math.sin(ang);

    var size = 0.8 + Math.random() * 0.6;

    var color = Math.random() < 0.5
      ? 'rgba(230,182,88,0.5)'
      : 'rgba(255,255,255,0.3)';

    var life = 7000 + Math.random() * 5000;
    var framesEquiv = life / 16.6;

    // drift upward with slight horizontal wander
    var vx = (Math.random() - 0.5) * 0.1;
    var vy = -(0.04 + Math.random() * 0.06);
    var dxEnd = vx * framesEquiv;
    var dyEnd = vy * framesEquiv;

    var particle = document.createElement('div');
    particle.style.cssText = [
      'position:fixed',
      'width:'+size+'px',
      'height:'+size+'px',
      'background:'+color,
      'border-radius:50%',
      'left:'+(startX - size/2)+'px',
      'top:'+(startY - size/2)+'px',
      'pointer-events:none',
      'z-index:185',
      'opacity:0.4',
      'transform:translate(0,0)',
      'transition:'
        +'transform '+life+'ms ease-out, '
        +'opacity '+life+'ms ease-in'
    ].join(';');
    document.body.appendChild(particle);
    particles.push(particle);

    // delay the fade start slightly so particle
    // is visible at full brightness before evaporating
    setTimeout(function(){
      requestAnimationFrame(function(){
        particle.style.transform =
          'translate('+dxEnd+'px,'+dyEnd+'px)';
        particle.style.opacity = '0';
      });
    }, 120);

    setTimeout(function(){
      if(particle.parentNode) particle.remove();
      var idx = particles.indexOf(particle);
      if(idx >= 0) particles.splice(idx, 1);
    }, life + 250);
  }

  var particleSpawnActive = false;
  var particleTimers = [];
  function restartParticleSpawnLoop(){
    particleTimers.forEach(function(id){
      clearTimeout(id);
    });
    particleTimers = [];
    // 20 particles staggered over 3 seconds,
    // then the loop recurses to keep them coming
    var count = 20;
    var interval = 150;
    for(var i = 0; i < count; i++){
      (function(delay){
        particleTimers.push(setTimeout(function(){
          if(particleSpawnActive){
            spawnParticle();
            // every 4th particle spawn two at once
            // for occasional density bursts
            if(Math.random() < 0.25) spawnParticle();
          }
        }, delay));
      })(i * interval);
    }
    // recurse — keep spawning as long as active
    particleTimers.push(setTimeout(function(){
      if(particleSpawnActive) restartParticleSpawnLoop();
    }, count * interval + 200));
  }

  // ── mini-knot rotation loop for page 6 ──
  var miniKnotRotationActive = false;
  var miniKnotRotation = 0;
  function miniKnotTick(){
    if(!miniKnotRotationActive) return;
    if(!overlay.parentNode){ miniKnotRotationActive = false; return; }
    miniKnotRotation += 0.0004;
    var cv = document.getElementById('meMiniKnot');
    if(!cv){ if(miniKnotRotationActive) requestAnimationFrame(miniKnotTick); return; }
    var mctx = cv.getContext('2d');
    mctx.setTransform(dpr,0,0,dpr,0,0);
    mctx.clearRect(0,0,120,120);
    var mcx = 60, mcy = 60, mR = 120*0.38;
    var mSizeBoost = mR < 60 ? (60/mR) : 1;
    var mgrd = mctx.createRadialGradient(mcx,mcy,0,mcx,mcy,mR*1.6);
    mgrd.addColorStop(0,'rgba('+glowRgb+','+glowBaseA+')');
    mgrd.addColorStop(1,'rgba(0,0,0,0)');
    mctx.fillStyle = mgrd;
    mctx.beginPath(); mctx.arc(mcx,mcy,mR*1.6,0,Math.PI*2); mctx.fill();
    for(var layer=0; layer<3; layer++){
      var lR = mR*(0.95-layer*0.15);
      var alpha = 1 - layer*0.28;
      mctx.beginPath();
      for(var i=0; i<=360; i++){
        var t = (i/360)*Math.PI*2;
        var k = p.petals%2===0 ? p.petals/2 : p.petals;
        var r1 = Math.abs(Math.cos(k*t+p.twist*Math.PI));
        var r2 = Math.pow(r1,1-p.round*0.5+p.sharp*0.3);
        var harmonic = 1+p.sharp*0.15*Math.cos((p.petals*2+1)*t+seed);
        var r = lR * r2 * harmonic;
        var angle = t + layer*0.04 + miniKnotRotation;
        var x = mcx + r*Math.cos(angle);
        var y = mcy + r*Math.sin(angle);
        if(i===0) mctx.moveTo(x,y); else mctx.lineTo(x,y);
      }
      mctx.closePath();
      mctx.globalAlpha = alpha*0.1;
      mctx.fillStyle = p.color; mctx.fill();
      mctx.globalAlpha = alpha;
      mctx.strokeStyle = p.color;
      mctx.lineWidth = p.strokeW*(1-layer*0.2)*mSizeBoost;
      mctx.lineCap = 'round'; mctx.lineJoin = 'round';
      mctx.stroke();
    }
    mctx.globalAlpha = 1;
    if(miniKnotRotationActive) requestAnimationFrame(miniKnotTick);
  }

  // ── page content for pages 2-5 (populated at t=14000) ──
  function populateMidPages(){
    // PAGE 2 — what you carried
    (function(){
      var total = monthEntries.length;
      var top3 = Object.keys(emoCounts).sort(function(a,b){return emoCounts[b]-emoCounts[a]}).slice(0,3);
      var rows = top3.map(function(emo){
        var pct = Math.round((emoCounts[emo]/total)*100);
        return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(201,148,58,0.08);">'
          + '<span style="flex:1;font-family:Fraunces,serif;font-style:italic;font-size:15px;color:var(--text)">'+emo+'</span>'
          + '<span style="font-family:DM Mono,monospace;font-size:10px;color:var(--gold);opacity:0.75">'+pct+'%</span>'
          + '</div>';
      }).join('');
      pages[1].innerHTML = '<div style="padding:120px 48px;display:flex;flex-direction:column;height:100%;justify-content:center;max-width:400px;margin:0 auto;box-sizing:border-box">'
        + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.4;text-transform:uppercase;letter-spacing:0.18em;margin:0 0 24px;text-align:center">what you carried</p>'
        + '<p style="font-family:Fraunces,serif;font-weight:300;font-size:28px;color:var(--text);text-align:center;margin:0 0 32px;letter-spacing:-0.01em">'+total+' '+(total===1?'entry':'entries')+'</p>'
        + rows
        + '</div>';
    })();

    // PAGE 3 — a moment that held
    (function(){
      var longest = monthEntries.reduce(function(best, e){
        var len = (e.text||'').length;
        var bestLen = best ? (best.text||'').length : -1;
        return len > bestLen ? e : best;
      }, null);
      var text = longest ? (longest.text || '') : '';
      var dayLabel = longest && typeof longest.day === 'number' ? ('DAY '+String(longest.day).padStart(3,'0')) : '';
      var emoLabel = longest && longest.emo ? longest.emo : '';
      pages[2].innerHTML = '<div style="padding:120px 32px;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;max-width:400px;margin:0 auto;gap:18px;box-sizing:border-box">'
        + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.4;text-transform:uppercase;letter-spacing:0.18em;margin:0">a moment that held</p>'
        + (dayLabel ? '<p style="font-family:DM Mono,monospace;font-size:9px;color:var(--gold);opacity:0.55;letter-spacing:0.12em;margin:0">'+dayLabel+(emoLabel?'  ·  '+emoLabel:'')+'</p>' : '')
        + '<div style="width:24px;height:1px;background:rgba(201,148,58,0.35);margin:4px 0"></div>'
        + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:17px;color:rgba(245,237,224,0.85);line-height:1.7;text-align:center;margin:0">'+ (text ? text : '—')+'</p>'
        + '</div>';
    })();

    // PAGE 4 — days you arrived
    (function(){
      var arrivedCount = monthEntries.length;
      var arrivedWord = DAY_WORDS[arrivedCount] || String(arrivedCount);
      pages[3].innerHTML = '<div style="padding:120px 32px;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:14px;box-sizing:border-box">'
        + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.4;text-transform:uppercase;letter-spacing:0.18em;margin:0">days</p>'
        + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:64px;color:var(--gold);letter-spacing:-0.02em;margin:12px 0;text-align:center;line-height:1">'+arrivedWord+'</p>'
        + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:15px;color:rgba(245,237,224,0.5);text-align:center;margin:0">mornings you arrived</p>'
        + '<p style="font-family:DM Mono,monospace;font-size:9px;color:rgba(201,148,58,0.4);letter-spacing:0.08em;margin:28px 0 0">out of '+daysInMonth+'</p>'
        + '</div>';
    })();

    // PAGE 5 — the thread held
    (function(){
      var closingLines = {
        calm:'the quiet was real. you were in it.',
        tender:'soft and still here. that matters.',
        grateful:'you noticed. the chain remembers.',
        hard:'hard months count too. this one did.',
        heavy:'you carried what you could. that is enough.',
        overwhelmed:'small returns through the flood. you kept arriving.',
        alive:'you burned. the chain burned with you.',
        numb:'even the quiet ones are held.',
        hopeful:'something is still opening. stay close to it.',
        light:'you caught the brightness. it stays.',
        quiet:'a month of hush. you honored it.',
        foggy:'you kept walking through. that is how it clears.',
        restless:'restlessness pointed you somewhere. you followed.',
        searching:'searching is a kind of faith. you held it.',
        sad:'sadness got a witness this month. you gave it one.',
        frustrated:'you cared enough to be frustrated. that is love.',
        anxious:'small safe things, one at a time. you did them.',
        heartbroken:'the chain held what you could not carry alone.',
        disappointed:'what disappointed you mattered. that means something.',
        exhausted:'rest is also part of the practice. you earned it.',
        moved:'you let it move you. that is a kind of courage.',
        passionate:'you burned for something. the chain burned with you.',
        nervous:'you stayed close to the edge and kept arriving.',
        livid:'anger was honest this month. you told the truth.',
        lonely:'the chain kept you company. you were not alone.',
        ashamed:'you showed up when you wanted to hide. that counts.',
        certain:'you knew what you knew this month. that is not small.',
        content:'enough arrived. you let it be enough.',
        focused:'you kept the thread this month. that is a practice.',
        inspired:'something sparked. you tended it. it stays.',
        lost:'you walked without a map. arriving still counts.',
        relaxed:'ease visited. you let it stay.',
        vulnerable:'you were soft. the chain held that.',
        yearning:'a month of reaching. the chain is the evidence.',
        betrayed:'the break was real. you told the truth about it.',
        bored:'flat months count. you stayed.',
        insecure:'you doubted and showed up anyway.',
        upset:'upset is honest. you let it be.'
      };
      var closing = closingLines[dominant] || 'you arrived this month. the chain remembers.';
      pages[4].innerHTML = '<div style="padding:120px 36px;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:20px;max-width:400px;margin:0 auto;box-sizing:border-box">'
        + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.4;text-transform:uppercase;letter-spacing:0.18em;margin:0">the thread held</p>'
        + '<div style="width:40px;height:1px;background:linear-gradient(90deg,transparent,#c9943a,transparent);opacity:0.6"></div>'
        + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:18px;color:var(--gold);line-height:1.7;text-align:center;margin:0">'+closing+'</p>'
        + '</div>';
    })();

    // PAGE 6 — carry it forward
    (function(){
      pages[5].innerHTML = '';
      var wrap = document.createElement('div');
      wrap.style.cssText = 'padding:100px 32px calc(100px + env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:24px;max-width:400px;margin:0 auto;box-sizing:border-box';

      var mini = document.createElement('canvas');
      mini.id = 'meMiniKnot';
      mini.style.cssText = 'width:120px;height:120px;filter:drop-shadow(0 0 18px rgba('+glowRgb+','+(glowBaseA*1.5)+'))';
      mini.width = 120 * dpr;
      mini.height = 120 * dpr;
      wrap.appendChild(mini);

      var mLabel = document.createElement('p');
      mLabel.textContent = monthName.toUpperCase()+'  '+now.getFullYear();
      mLabel.style.cssText = 'font-family:"DM Mono",monospace;font-size:10px;color:var(--gold);opacity:0.55;letter-spacing:0.2em;margin:4px 0 0';
      wrap.appendChild(mLabel);

      var flex = document.createElement('div');
      flex.style.cssText = 'flex:1';
      wrap.appendChild(flex);

      var carryBtn = document.createElement('button');
      carryBtn.textContent = 'carry it forward';
      carryBtn.id = 'meCarryBtn';
      carryBtn.style.cssText = [
        'width:100%','max-width:280px','padding:16px',
        'background:rgba(201,148,58,0.08)',
        'border:1px solid var(--gold)','border-radius:14px',
        'color:var(--gold)',
        'font-family:"Fraunces",serif','font-style:italic','font-size:16px',
        'cursor:pointer','transition:all 200ms ease'
      ].join(';');
      carryBtn.addEventListener('click', beginDismissal);
      wrap.appendChild(carryBtn);

      pages[5].appendChild(wrap);
    })();
  }

  // ── swipe mechanics ──
  var currentPage = 0;
  var pgW = 0;
  var touchStartX = 0, touchStartY = 0;
  var touchActive = false;
  var touchDirection = null;

  function applyPageTransform(pageIndex, extraPx){
    var idx = Math.max(0, Math.min(5, pageIndex));
    var offset = -idx * (pgW || window.innerWidth);
    if(extraPx) offset += extraPx;
    pagesContainer.style.transform = 'translateX('+offset+'px)';
  }

  function setPage(idx){
    var prev = currentPage;
    currentPage = Math.max(0, Math.min(5, idx));
    pagesContainer.style.transition = 'transform 400ms cubic-bezier(0.25,0.1,0.25,1)';
    applyPageTransform(currentPage, 0);
    dots.forEach(function(d, i){
      d.style.background = i === currentPage ? 'rgba(201,148,58,0.9)' : 'rgba(201,148,58,0.3)';
      d.style.transform = i === currentPage ? 'scale(1.3)' : 'scale(1)';
    });
    // hide dots on the last page so they don't collide with the carry-forward button
    dotsWrap.style.transition = 'opacity 260ms ease';
    dotsWrap.style.opacity = currentPage === 5 ? '0' : '1';
    // enter/leave callbacks
    if(prev === 0 && currentPage !== 0){
      rotationLoopActive = false;
      particleSpawnActive = false;
    } else if(prev !== 0 && currentPage === 0){
      rotationLoopActive = true;
      rafId = requestAnimationFrame(tick);
      particleSpawnActive = true;
      restartParticleSpawnLoop();
    }
    if(prev === 5 && currentPage !== 5){
      miniKnotRotationActive = false;
    } else if(prev !== 5 && currentPage === 5){
      miniKnotRotationActive = true;
      requestAnimationFrame(miniKnotTick);
    }
  }

  function attachSwipe(){
    pagesContainer.addEventListener('touchstart', function(e){
      if(phase === 'contract' || phase === 'done') return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchActive = true;
      touchDirection = null;
      pgW = window.innerWidth;
      pagesContainer.style.transition = 'none';
    }, {passive: true});
    pagesContainer.addEventListener('touchmove', function(e){
      if(!touchActive) return;
      var dx = e.touches[0].clientX - touchStartX;
      var dy = e.touches[0].clientY - touchStartY;
      if(touchDirection === null){
        if(Math.abs(dx) > 8 || Math.abs(dy) > 8){
          touchDirection = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
        }
      }
      if(touchDirection === 'h'){
        var atEdge = (currentPage === 0 && dx > 0) || (currentPage === 5 && dx < 0);
        var clamped = atEdge ? dx * 0.3 : dx;
        applyPageTransform(currentPage, clamped);
      }
    }, {passive: true});
    pagesContainer.addEventListener('touchend', function(e){
      if(!touchActive) return;
      touchActive = false;
      if(touchDirection !== 'h'){ setPage(currentPage); return; }
      var dx = e.changedTouches[0].clientX - touchStartX;
      if(dx > 40 && currentPage > 0) setPage(currentPage - 1);
      else if(dx < -40 && currentPage < 5) setPage(currentPage + 1);
      else setPage(currentPage);
    });
    // mouse drag fallback (desktop + preview)
    var mouseDown = false, mouseStartX = 0;
    pagesContainer.addEventListener('mousedown', function(e){
      if(phase === 'contract' || phase === 'done') return;
      mouseDown = true;
      mouseStartX = e.clientX;
      pgW = window.innerWidth;
      pagesContainer.style.transition = 'none';
    });
    document.addEventListener('mousemove', function(e){
      if(!mouseDown) return;
      var dx = e.clientX - mouseStartX;
      var atEdge = (currentPage === 0 && dx > 0) || (currentPage === 5 && dx < 0);
      var clamped = atEdge ? dx * 0.3 : dx;
      applyPageTransform(currentPage, clamped);
    });
    document.addEventListener('mouseup', function(e){
      if(!mouseDown) return;
      mouseDown = false;
      var dx = e.clientX - mouseStartX;
      if(dx > 40 && currentPage > 0) setPage(currentPage - 1);
      else if(dx < -40 && currentPage < 5) setPage(currentPage + 1);
      else setPage(currentPage);
    });
    // dot taps
    dots.forEach(function(d, i){
      d.addEventListener('click', function(){ setPage(i); });
    });
  }

  // ── BEAT 8 — DISMISSAL (triggered by page-6 carry-forward button) ──
  function beginDismissal(){
    if(phase === 'contract' || phase === 'done') return;
    localStorage.setItem('gc_ceremony_seen_'+currentMonth, '1');
    localStorage.setItem('gc_portrait_seen_'+currentMonth, '1');

    particleSpawnActive = false;
    particles.forEach(function(pt){
      pt.style.transition = 'opacity 400ms ease';
      pt.style.opacity = '0';
      setTimeout(function(){ if(pt.parentNode) pt.remove(); }, 400);
    });
    particles = [];

    miniKnotRotationActive = false;

    wordEl.style.transition = rule.style.transition = msgEl.style.transition = 'opacity 600ms ease';
    wordEl.style.opacity = '0';
    rule.style.opacity = '0';
    msgEl.style.opacity = '0';

    announceWrap.style.transition = 'opacity 400ms ease';
    announceWrap.style.opacity = '0';
    swipeHintInPage.style.transition = 'opacity 400ms ease';
    swipeHintInPage.style.opacity = '0';

    dotsWrap.style.opacity = '0';

    // shrink the visible mini knot (page 6) via CSS
    var mini = document.getElementById('meMiniKnot');
    if(mini){
      mini.style.transition = 'transform 420ms ease, opacity 420ms ease';
      mini.style.transformOrigin = 'center';
      mini.style.transform = 'scale(0)';
      mini.style.opacity = '0';
    }
    // also fade the carry button so it doesn't linger
    var carryBtn = document.getElementById('meCarryBtn');
    if(carryBtn){
      carryBtn.style.transition = 'opacity 400ms ease';
      carryBtn.style.opacity = '0';
    }

    // kick off the ceremony-canvas contract phase (even though it's on page 1, offscreen)
    phase = 'contract';
    phaseStartTs = null;
    if(!rotationLoopActive){
      rotationLoopActive = true;
      rafId = requestAnimationFrame(tick);
    }

    // ripple from the visible knot position (mini if present, else ceremony knot)
    setTimeout(function(){
      var target = mini && mini.parentNode ? mini : knotCanvas;
      var rect = target.getBoundingClientRect();
      var ripple = document.createElement('div');
      ripple.style.cssText = [
        'position:fixed',
        'left:'+(rect.left+rect.width/2)+'px',
        'top:'+(rect.top+rect.height/2)+'px',
        'width:0','height:0','border-radius:50%',
        'border:1px solid rgba(201,148,58,0.7)',
        'transform:translate(-50%,-50%)','opacity:1',
        'transition:width 600ms ease, height 600ms ease, opacity 600ms ease',
        'pointer-events:none','z-index:186','box-sizing:border-box'
      ].join(';');
      document.body.appendChild(ripple);
      requestAnimationFrame(function(){
        ripple.style.width = '160px';
        ripple.style.height = '160px';
        ripple.style.opacity = '0';
      });
      setTimeout(function(){ if(ripple.parentNode) ripple.remove(); }, 650);
    }, 300);

    // lift veil
    setTimeout(function(){
      overlay.style.transition = 'background 1200ms ease';
      overlay.style.background = 'rgba(7,5,3,0)';
    }, 500);

    // remove overlay + portrait tab glow + refresh portrait tab at t=2500ms
    setTimeout(function(){
      rotationLoopActive = false;
      miniKnotRotationActive = false;
      if(overlay.parentNode) overlay.remove();
      var portraitTab = document.querySelector('.nav-tab[data-screen="s-portrait"]');
      if(portraitTab){
        portraitTab.style.transition = 'filter 400ms ease';
        portraitTab.style.filter = 'drop-shadow(0 0 8px rgba(201,148,58,0.8))';
        setTimeout(function(){ portraitTab.style.filter = ''; }, 2000);
      }
      if(typeof populatePortrait === 'function'){
        try{ populatePortrait(); }catch(e){}
      }
      // hand off to annual ceremony if it was queued (Day-365 + month-end overlap)
      try {
        if (localStorage.getItem('gc_annual_pending')) {
          localStorage.removeItem('gc_annual_pending');
          setTimeout(function(){
            if (typeof _showAnnualCeremony === 'function') _showAnnualCeremony();
          }, 400);
        }
      } catch(e) {}
    }, 2500);
  }

  // ── BEAT 7 — swipe pages activate at t=14000 ──
  setTimeout(function(){
    populateMidPages();
    attachSwipe();
    dotsWrap.style.opacity = '1';
    setTimeout(function(){ swipeHintInPage.style.opacity = '1'; }, 500);
    particleSpawnActive = true;
    restartParticleSpawnLoop();
  }, 14000);
}

// DEPRECATED: replaced by _showAnnualCeremony (multi-page). Kept for now to
// minimize merge risk; remove in a follow-up once all branches have migrated.
// ── YEAR-CLOSING CEREMONY — fires once when Day 365 completes the necklace ──
function showYearClosingCeremony(){
  if(document.getElementById('yearCloseOverlay')) return;

  // ── Compute year-level stats from all entries ──
  var allEntries = [];
  try{ allEntries = JSON.parse(localStorage.getItem('gc_entries')||'[]'); }catch(e){}

  var totalEntries = allEntries.length;

  // top emotion of the entire year
  var yearEmoCounts = {};
  allEntries.forEach(function(e){
    if(e.emo) yearEmoCounts[e.emo] = (yearEmoCounts[e.emo]||0) + 1;
  });
  var yearTopEmo = Object.keys(yearEmoCounts).sort(
    function(a,b){ return yearEmoCounts[b]-yearEmoCounts[a]; }
  )[0] || 'calm';
  var yearWord = PORTRAIT_WORDS[yearTopEmo] || yearTopEmo;

  // month with most mornings
  var startDateObj = gcStartDate ? new Date(gcStartDate) : new Date();
  var startMonth = startDateObj.getMonth();
  var startYear  = startDateObj.getFullYear();
  var bestMonthName = '';
  var bestMonthCount = 0;
  var MONTHS_FULL = ['january','february','march','april','may','june',
    'july','august','september','october','november','december'];
  for(var i=0;i<12;i++){
    var m = (startMonth+i)%12;
    var yr = startYear + Math.floor((startMonth+i)/12);
    var mISO = yr+'-'+String(m+1).padStart(2,'0');
    var mCount = allEntries.filter(function(e){
      return getEntryMonthKey(e) === mISO;
    }).length;
    if(mCount > bestMonthCount){
      bestMonthCount = mCount;
      bestMonthName = MONTHS_FULL[m];
    }
  }

  // anniversary month name
  var _startMonthName = startDateObj.toLocaleDateString('en-US',{month:'long'}).toLowerCase();

  // fetch AI year narrative
  window._yearInsights = null;
  var _yearPayload = {
    total_mornings: totalEntries,
    dominant_emotion: yearTopEmo,
    year_word: yearWord,
    fullest_month: bestMonthName,
    top_emotions: Object.keys(yearEmoCounts)
      .sort(function(a,b){return yearEmoCounts[b]-yearEmoCounts[a];})
      .slice(0,4),
    longest_entry_excerpt: (function(){
      var longest='', longestLen=0;
      allEntries.forEach(function(e){
        if((e.text||'').length > longestLen){
          longestLen = e.text.length;
          longest = e.text.slice(0,120);
        }
      });
      return longest;
    })()
  };
  // Prefer the prefetch kicked off 3.2s earlier by the submit handler
  // (or by the demo year-end button). Falls back to a fresh fetch if none.
  (function(){
    var _promise = window._yearlyInsightsPrefetch;
    window._yearlyInsightsPrefetch = null;
    if(!_promise){
      _promise = fetch(API_BASE + '/yearly-insights', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(_yearPayload)
      }).then(function(r){ return r.json(); })
        .catch(function(){ return null; });
    }
    _promise.then(function(data){ if(data) window._yearInsights = data; });
  })();

  // ── Build overlay ──
  var overlay = document.createElement('div');
  overlay.id = 'yearCloseOverlay';
  overlay.style.cssText = [
    'position:fixed','inset:0','z-index:170',
    'background:rgba(14,11,7,0.97)',
    'display:flex','flex-direction:column',
    'align-items:center','justify-content:center',
    'padding:0 40px',
    'opacity:0','transition:opacity 600ms ease',
    'pointer-events:none'
  ].join(';');
  document.body.appendChild(overlay);
  requestAnimationFrame(function(){ overlay.style.opacity='1'; });

  // ── Stat rows ──
  function makeText(text, size, color, marginBottom, delay){
    var el = document.createElement('p');
    el.textContent = text;
    el.style.cssText = [
      'font-family:"Fraunces",serif','font-style:italic','font-weight:300',
      'font-size:'+size+'px','color:'+color,
      'text-align:center','opacity:0','margin:0 0 '+marginBottom+'px',
      'transition:opacity 1000ms ease','letter-spacing:-0.01em',
      'line-height:1.5'
    ].join(';');
    overlay.appendChild(el);
    setTimeout(function(){ el.style.opacity='1'; }, delay);
    return el;
  }

  function makeMono(text, delay){
    var el = document.createElement('p');
    el.textContent = text;
    el.style.cssText = [
      'font-family:"DM Mono",monospace','font-size:9px',
      'letter-spacing:0.18em','color:rgba(201,148,58,0.25)',
      'text-align:center','opacity:0','margin:0 0 6px',
      'text-transform:uppercase',
      'transition:opacity 800ms ease'
    ].join(';');
    overlay.appendChild(el);
    setTimeout(function(){ el.style.opacity='1'; }, delay);
    return el;
  }

  // line 1 — one year
  makeText('one year.', 22, 'rgba(201,148,58,0.85)', 28, 800);

  // line 2 — month to month
  makeText(
    _startMonthName + ' to ' + _startMonthName + '.',
    15, 'rgba(230,182,88,0.6)', 48, 2000
  );

  // ── Stats block ──
  // mornings
  makeMono('mornings', 3200);
  makeText(
    String(totalEntries),
    52, 'rgba(201,148,58,0.9)', 4, 3600
  );

  // spacer
  var spacer = document.createElement('div');
  spacer.style.cssText = 'height:32px';
  overlay.appendChild(spacer);

  // the year in one word
  makeMono('your year, in one word', 3800);
  makeText(yearWord, 28, 'rgba(245,237,224,0.7)', 4, 4200);

  // month with most mornings
  if(bestMonthName && bestMonthCount > 0){
    var spacer2 = document.createElement('div');
    spacer2.style.cssText = 'height:32px';
    overlay.appendChild(spacer2);
    makeMono('fullest month', 4600);
    makeText(bestMonthName, 20, 'rgba(201,148,58,0.55)', 0, 5000);
  }

  // ── AI year narrative — fades in after all stats ──
  var narrativeEl = document.createElement('p');
  narrativeEl.style.cssText = [
    'font-family:"Fraunces",serif','font-style:italic',
    'font-weight:300','font-size:13px',
    'color:rgba(245,237,224,0.35)',
    'text-align:center','max-width:280px',
    'line-height:1.9','margin:24px 0 0',
    'opacity:0','transition:opacity 1200ms ease'
  ].join(';');
  overlay.appendChild(narrativeEl);

  setTimeout(function(){
    var txt = (window._yearInsights && window._yearInsights.year_narrative)
      || YEAR_CLOSING_LINES[yearTopEmo]
      || 'a whole year held. the chain remembers it all.';
    narrativeEl.textContent = txt;
    narrativeEl.style.opacity = '1';
  }, 8000);

  // ── Tap hint ──
  var hint = document.createElement('p');
  hint.textContent = 'tap to choose your pendant';
  hint.style.cssText = [
    'position:absolute',
    'bottom:calc(88px + env(safe-area-inset-bottom) + 20px)',
    'left:50%','transform:translateX(-50%)',
    'font-family:"DM Mono",monospace','font-size:9px',
    'letter-spacing:0.12em','color:rgba(201,148,58,0.0)',
    'white-space:nowrap','pointer-events:none',
    'transition:color 1200ms ease'
  ].join(';');
  overlay.appendChild(hint);

  // tap becomes active after stats have loaded
  setTimeout(function(){
    hint.style.color = 'rgba(201,148,58,0.3)';
    overlay.style.pointerEvents = 'auto';
    overlay.style.cursor = 'pointer';
    overlay.addEventListener('click', function(){
      overlay.style.opacity = '0';
      setTimeout(function(){
        if(overlay.parentNode) overlay.remove();
        openClaspChoice();
      }, 400);
    });
  }, 20000);
}

// ── CLASP CHOICE — pick a month to immortalize as the necklace clasp ──
// ── CLASP CHOICE GALLERY — scrollable month cards with rotating knots ──
function openClaspChoice(){
  if(document.getElementById('claspChoiceOverlay')) return;
  var overlay = document.createElement('div');
  overlay.id = 'claspChoiceOverlay';
  overlay.style.cssText = [
    'position:fixed','inset:0','z-index:200',
    'background:#0e0b07',
    'display:flex','flex-direction:column',
    'overflow:hidden',
    'opacity:0','transition:opacity 600ms ease'
  ].join(';');

  // Header
  var header = document.createElement('div');
  header.style.cssText = [
    'flex-shrink:0',
    'padding:max(56px,env(safe-area-inset-top)) 32px 24px',
    'text-align:center'
  ].join(';');
  var headerYear = gcStartDate ? new Date(gcStartDate).getFullYear() : new Date().getFullYear();
  header.innerHTML =
    '<p style="font-family:\'DM Mono\',monospace;font-size:8px;'
    +'letter-spacing:0.2em;color:rgba(201,148,58,0.35);'
    +'text-transform:uppercase;margin:0 0 16px">'
    +headerYear+'</p>'
    +'<p style="font-family:\'Fraunces\',serif;font-style:italic;'
    +'font-weight:300;font-size:22px;'
    +'color:rgba(245,237,224,0.85);line-height:1.6;margin:0 0 8px">'
    +'which month will you<br>carry forward?</p>'
    +'<p style="font-family:\'Fraunces\',serif;font-style:italic;'
    +'font-size:12px;color:rgba(245,237,224,0.3);margin:0">'
    +'one pendant. carried forward.</p>';

  // Scrollable gallery
  var gallery = document.createElement('div');
  gallery.style.cssText = [
    'flex:1','overflow-y:auto',
    'padding:8px 24px calc(40px + env(safe-area-inset-bottom))',
    '-webkit-overflow-scrolling:touch'
  ].join(';');

  var MONTHS_FULL = ['january','february','march','april','may','june',
    'july','august','september','october','november','december'];
  // Anniversary-relative: loop 12 months starting from the user's start month.
  // A June 2026 starter sees 2026-06, 07, 08…12, 2027-01, 02, 03, 04, 05.
  var startDateObj = gcStartDate ? new Date(gcStartDate) : new Date();
  var startMonth = startDateObj.getMonth();
  var startYear  = startDateObj.getFullYear();
  var allEntries = [];
  try{ allEntries = JSON.parse(localStorage.getItem('gc_entries')||'[]'); }catch(e){}

  // Build a month card for each eligible (ceremony-completed, non-empty) month
  var eligibleIndex = 0; // running counter for stagger delay
  for(var i = 0; i < 12; i++){
    var m          = (startMonth + i) % 12;
    var yearOffset = Math.floor((startMonth + i) / 12);
    var yearForM   = startYear + yearOffset;
    var mISO = yearForM + '-' + String(m+1).padStart(2,'0');
    var seen = localStorage.getItem('gc_ceremony_seen_'+mISO);
    var mEntries = allEntries.filter(function(e){ return getEntryMonthKey(e) === mISO; });
    if(!seen || mEntries.length === 0) continue;

    // dominant emotion → word
    var eCounts = {};
    mEntries.forEach(function(e){ if(e.emo) eCounts[e.emo] = (eCounts[e.emo]||0)+1; });
    var dom = Object.keys(eCounts).sort(function(a,b){ return eCounts[b]-eCounts[a]; })[0] || 'calm';
    var word = PORTRAIT_WORDS[dom] || dom;

    // Card
    var card = document.createElement('div');
    card.style.cssText = [
      'display:flex','flex-direction:column',
      'align-items:center','padding:28px 20px',
      'margin-bottom:16px',
      'background:rgba(255,255,255,0.02)',
      'border:1px solid rgba(201,148,58,0.07)',
      'border-radius:20px','cursor:pointer',
      'transition:all 300ms ease',
      'opacity:0','transform:translateY(12px)'
    ].join(';');

    var knotCanvas = document.createElement('canvas');
    knotCanvas.style.cssText = 'width:160px;height:160px;margin-bottom:20px';

    var monthLabel = document.createElement('p');
    monthLabel.textContent = MONTHS_FULL[m];
    monthLabel.style.cssText = [
      'font-family:"Fraunces",serif','font-style:italic','font-weight:300',
      'font-size:22px','color:rgba(245,237,224,0.75)',
      'margin:0 0 6px','letter-spacing:-0.01em'
    ].join(';');

    var wordLabel = document.createElement('p');
    wordLabel.textContent = word;
    wordLabel.style.cssText = [
      'font-family:"Fraunces",serif','font-style:italic',
      'font-size:14px','color:rgba(201,148,58,0.55)',
      'margin:0 0 20px'
    ].join(';');

    // emotion dot row — top 3 emotions as colored circles
    var dotRow = document.createElement('div');
    dotRow.style.cssText = [
      'display:flex','gap:6px','align-items:center',
      'justify-content:center','margin-bottom:12px'
    ].join(';');

    var mEmoCounts = {};
    mEntries.forEach(function(e){
      if(e.emo) mEmoCounts[e.emo] = (mEmoCounts[e.emo]||0)+1;
    });
    var mTopEmos = Object.keys(mEmoCounts).sort(
      function(a,b){ return mEmoCounts[b]-mEmoCounts[a]; }
    ).slice(0,3);

    mTopEmos.forEach(function(emo){
      var dot = document.createElement('div');
      var dotColor = (KNOT_PARAMS[emo]||KNOT_FALLBACK).color;
      var pct = Math.round(mEmoCounts[emo]/mEntries.length*100);
      dot.title = emo + ' \u00B7 ' + pct + '%';
      dot.style.cssText = [
        'width:8px','height:8px','border-radius:50%',
        'background:'+dotColor,
        'opacity:0.65'
      ].join(';');
      dotRow.appendChild(dot);
    });

    var countLabel = document.createElement('p');
    countLabel.textContent = mEntries.length + (mEntries.length===1?' morning':' mornings');
    countLabel.style.cssText = [
      'font-family:"DM Mono",monospace','font-size:9px',
      'letter-spacing:0.1em','color:rgba(201,148,58,0.25)',
      'margin:0 0 24px'
    ].join(';');

    var chooseBtn = document.createElement('button');
    chooseBtn.textContent = 'choose as my pendant';
    chooseBtn.style.cssText = [
      'background:transparent',
      'border:1px solid rgba(201,148,58,0.25)',
      'border-radius:20px','padding:8px 20px',
      'font-family:"Fraunces",serif','font-style:italic',
      'font-size:12px','color:rgba(201,148,58,0.5)',
      'cursor:pointer','transition:all 200ms ease'
    ].join(';');

    card.appendChild(knotCanvas);
    card.appendChild(monthLabel);
    card.appendChild(wordLabel);
    card.appendChild(dotRow);
    card.appendChild(countLabel);
    card.appendChild(chooseBtn);
    gallery.appendChild(card);

    // Staggered entrance + start rotating knot once visible
    (function(cardEl, canvasEl, ents, idx, staggerIdx, domEmo){
      setTimeout(function(){
        cardEl.style.opacity = '1';
        cardEl.style.transform = 'translateY(0)';
        requestAnimationFrame(function(){
          drawKnotOnCanvas(canvasEl, ents, idx);
          startKnotRotation(canvasEl, ents, idx);
        });
      }, staggerIdx * 120);

      cardEl.addEventListener('click', function(){
        // stop all rotating knots in the gallery
        overlay.querySelectorAll('canvas').forEach(function(cv){ cv._rotationRunning = false; });
        showClaspConfirmation(overlay, idx, MONTHS_FULL[idx], domEmo, ents, monthYear);
      });
    })(card, knotCanvas, mEntries, m, eligibleIndex, dom, yearForM);
    eligibleIndex++;
  }

  overlay.appendChild(header);
  overlay.appendChild(gallery);
  document.body.appendChild(overlay);

  requestAnimationFrame(function(){ overlay.style.opacity = '1'; });
}

// ── CLASP CONFIRMATION — rotating knot + "yes, this is the one" / "choose another" ──
function showClaspConfirmation(overlay, monthIdx, monthName, dominant, entries, monthYear){
  overlay.innerHTML = '';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';

  var word = PORTRAIT_WORDS[dominant] || dominant;

  var inner = document.createElement('div');
  inner.style.cssText = [
    'display:flex','flex-direction:column',
    'align-items:center','padding:40px 32px',
    'text-align:center','width:100%'
  ].join(';');

  var confirmCanvas = document.createElement('canvas');
  confirmCanvas.style.cssText = 'width:180px;height:180px;margin-bottom:24px';

  var monthEl = document.createElement('p');
  monthEl.textContent = monthName;
  monthEl.style.cssText = [
    'font-family:"Fraunces",serif','font-style:italic',
    'font-size:28px','color:rgba(230,182,88,0.9)',
    'margin:0 0 8px','letter-spacing:-0.01em'
  ].join(';');

  var wordEl = document.createElement('p');
  wordEl.textContent = word;
  wordEl.style.cssText = [
    'font-family:"Fraunces",serif','font-style:italic',
    'font-size:14px','color:rgba(201,148,58,0.45)',
    'margin:0 0 32px'
  ].join(';');

  var countEl = document.createElement('p');
  countEl.style.cssText = [
    'font-family:"DM Mono",monospace','font-size:9px',
    'letter-spacing:0.14em','color:rgba(201,148,58,0.25)',
    'margin:0 0 32px','text-transform:uppercase'
  ].join(';');
  countEl.textContent = entries.length + (entries.length===1?' morning':' mornings');

  var questionEl = document.createElement('p');
  questionEl.innerHTML = [
    'this will become your pendant.',
    '<br>',
    '<span style="font-size:11px;color:rgba(245,237,224,0.2);',
    'letter-spacing:0.04em">it will hang with you into year two.</span>'
  ].join('');
  questionEl.style.cssText = [
    'font-family:"Fraunces",serif','font-style:italic',
    'font-size:13px','color:rgba(245,237,224,0.4)',
    'margin:0 0 36px','line-height:2.0','text-align:center'
  ].join(';');

  var confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'yes, this is the one';
  confirmBtn.style.cssText = [
    'width:100%','max-width:240px','padding:14px',
    'background:rgba(201,148,58,0.1)',
    'border:1px solid rgba(201,148,58,0.35)',
    'border-radius:20px',
    'font-family:"Fraunces",serif','font-style:italic',
    'font-size:13px','color:var(--gold)',
    'cursor:pointer','margin-bottom:16px',
    'transition:all 200ms ease'
  ].join(';');

  var backBtn = document.createElement('button');
  backBtn.textContent = 'choose another';
  backBtn.style.cssText = [
    'background:transparent','border:none',
    'font-family:"Fraunces",serif','font-style:italic',
    'font-size:12px','color:rgba(245,237,224,0.2)',
    'cursor:pointer'
  ].join(';');

  inner.appendChild(confirmCanvas);
  inner.appendChild(monthEl);
  inner.appendChild(wordEl);
  inner.appendChild(countEl);
  inner.appendChild(questionEl);
  inner.appendChild(confirmBtn);
  inner.appendChild(backBtn);
  overlay.appendChild(inner);

  requestAnimationFrame(function(){
    drawKnotOnCanvas(confirmCanvas, entries, monthIdx);
    startKnotRotation(confirmCanvas, entries, monthIdx);
  });

  backBtn.addEventListener('click', function(){
    confirmCanvas._rotationRunning = false;
    overlay.remove();
    openClaspChoice();
  });

  confirmBtn.addEventListener('click', function(){
    confirmCanvas._rotationRunning = false;
    placePendantKnot(overlay, monthIdx, monthName, entries, monthYear);
  });
}

// ── PLACE PENDANT — save the choice, fade, return to splash, ripple + whisper + tab glow ──
function placePendantKnot(overlay, monthIdx, monthName, entries, monthYear){
  var startYear = gcStartDate ? new Date(gcStartDate).getFullYear() : new Date().getFullYear();
  // monthYear is the actual calendar year of the chosen month (may differ from startYear
  // for users who started mid-year, e.g. June 2026 → January maps to 2027)
  var pendantYear = monthYear || startYear;
  var monthISO = pendantYear + '-' + String(monthIdx+1).padStart(2,'0');

  // save the pendant choice permanently and invalidate the splash-canvas pendant cache
  localStorage.setItem(
    'gc_pendant_year_'+startYear,
    JSON.stringify({ monthIdx: monthIdx, monthISO: monthISO, monthName: monthName })
  );
  if(typeof window._invalidatePendantCache === 'function') window._invalidatePendantCache();

  overlay.style.transition = 'opacity 800ms ease';
  overlay.style.opacity = '0';

  setTimeout(function(){
    if(overlay.parentNode) overlay.remove();

    // return to chain — splash canvas now draws the chosen rose as the clasp
    document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('active'); });
    $('s-splash').classList.add('active');
    if(typeof setActiveTab === 'function') setActiveTab('s-splash');

    setTimeout(function(){
      // ripple at clasp position (bottom of necklace circle)
      var claspX = window.innerWidth / 2;
      var claspY = window.innerHeight * 0.42
        + Math.min(window.innerWidth, window.innerHeight) * 0.36;

      var ripple = document.createElement('div');
      ripple.style.cssText = [
        'position:fixed','width:0','height:0','border-radius:50%',
        'border:1px solid rgba(201,148,58,0.7)',
        'left:'+claspX+'px','top:'+claspY+'px',
        'transform:translate(-50%,-50%)',
        'transition:all 700ms ease-out',
        'pointer-events:none','z-index:180'
      ].join(';');
      document.body.appendChild(ripple);
      requestAnimationFrame(function(){
        ripple.style.width = '120px';
        ripple.style.height = '120px';
        ripple.style.opacity = '0';
      });
      setTimeout(function(){ if(ripple.parentNode) ripple.remove(); }, 700);

      // whisper
      var whisper = document.createElement('div');
      whisper.textContent = (window._yearInsights
        && window._yearInsights.pendant_whisper)
        || (monthName + ' will hang with you.');
      whisper.style.cssText = [
        'position:fixed','left:50%','top:50%',
        'transform:translate(-50%,-50%)',
        'font-family:"Fraunces",serif','font-style:italic',
        'font-size:14px','color:rgba(201,148,58,0.6)',
        'pointer-events:none','z-index:180',
        'opacity:0','transition:opacity 800ms ease',
        'white-space:nowrap'
      ].join(';');
      document.body.appendChild(whisper);
      requestAnimationFrame(function(){ whisper.style.opacity = '1'; });
      setTimeout(function(){
        whisper.style.opacity = '0';
        setTimeout(function(){ if(whisper.parentNode) whisper.remove(); }, 800);
      }, 3000);

      // portrait tab glow
      var portraitTab = document.querySelector('.nav-tab[data-screen="s-portrait"]');
      if(portraitTab){
        portraitTab.style.transition = 'filter 400ms ease';
        portraitTab.style.filter = 'drop-shadow(0 0 8px rgba(201,148,58,0.8))';
        setTimeout(function(){ portraitTab.style.filter = ''; }, 2000);
      }
    }, 200);
  }, 800);
}

// progressive-state knot for the CURRENT month in the year grid.
// state: 'gathering' | 'forming' | 'almost' | 'complete'
// - gathering: empty canvas (too early in the month)
// - forming:   faint 3-layer outline at ~6% opacity
// - almost:    clearer 3-layer outline at ~18% opacity
// - complete:  full static rose (same as past months)
function drawCurrentMonthCell(canvas, monthEntries, monthIndex, state){
  // 'complete' just uses the normal full-rose path
  if(state === 'complete'){
    drawKnotOnCanvas(canvas, monthEntries, monthIndex);
    return;
  }

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio||1, 2);
  var W = canvas.offsetWidth || canvas.width || 76;
  var H = canvas.offsetHeight || canvas.height || 76;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  // 'gathering' → leave the canvas blank (no knot yet)
  if(state === 'gathering') return;

  // ghost opacity per state
  var ghostOpacity = state === 'almost' ? 0.18 : 0.06;

  var p = _blendKnotParams(monthEntries, monthIndex).full;

  var cx = W/2, cy = H/2;
  var R = Math.min(W,H) * 0.36;
  var seed = (monthIndex||0) * 137.5;
  var sizeBoost = R < 60 ? (60 / R) : 1;

  // 3-layer ghost outline — stroke only, no fill, scaled opacity
  for(var layer = 0; layer < 3; layer++){
    var layerR = R * (0.95 - layer*0.15);
    ctx.beginPath();
    var STEPS = 400;
    for(var i = 0; i <= STEPS; i++){
      var t = (i/STEPS) * Math.PI * 2;
      var k = p.petals%2===0 ? p.petals/2 : p.petals;
      var r1 = Math.abs(Math.cos(k*t + p.twist*Math.PI));
      var r2 = Math.pow(r1, 1 - p.round*0.5 + p.sharp*0.3);
      var harmonic = 1 + p.sharp*0.15 * Math.cos((p.petals*2+1)*t + seed);
      var r = layerR * r2 * harmonic;
      var angle = t + layer*0.04;
      var x = cx + r*Math.cos(angle);
      var y = cy + r*Math.sin(angle);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.globalAlpha = ghostOpacity * (1 - layer*0.25);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.strokeW * (1-layer*0.2) * sizeBoost * 0.85;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// compute the current-month progressive state based on today's date + whether we've logged
function computeCurrentMonthState(){
  var now = new Date();
  var dayOfMonth = now.getDate();
  var daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  var monthProgress = dayOfMonth / daysInMonth;
  var isLastDay = dayOfMonth === daysInMonth;
  var hasLoggedToday = typeof gcLoggedSet !== 'undefined' && gcLoggedSet.has(todayISO());

  // on the last day the full rose only unlocks once the user has logged that day
  if(isLastDay) return hasLoggedToday ? 'complete' : 'almost';
  if(monthProgress >= 0.87) return 'almost';
  if(monthProgress >= 0.5)  return 'forming';
  return 'gathering';
}

// ── current-month loading states ────────────────────────────
// spinning spiral coil — used for "gathering" state (early in the month, no entries yet to form a shape)
function drawCurrentMonthSpiral(ctx, cx, cy, R, t, emo){
  var p = KNOT_PARAMS[emo] || KNOT_FALLBACK;
  ctx.save();
  // soft glow
  var grd = ctx.createRadialGradient(cx,cy,0,cx,cy,R*1.2);
  grd.addColorStop(0, p.glow.replace(/[\d.]+\)$/,'0.15)'));
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx,cy,R*1.2,0,Math.PI*2);
  ctx.fill();
  // spiral coil — 2.5 turns inward
  ctx.beginPath();
  var turns = 2.5;
  var steps = 200;
  for(var i = 0; i <= steps; i++){
    var pct = i/steps;
    var r = R * 0.55 * pct;
    var a = pct * turns * Math.PI * 2 + t;
    var x = cx + r * Math.cos(a);
    var y = cy + r * Math.sin(a);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = p.color;
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();
}

// ghost rose — used for "forming" (6% opacity) and "almost" (18% opacity) states
// takes `rotation` param so the animation loop can slowly rotate the ghost
function drawCurrentMonthForming(ctx, cx, cy, R, rotation, stats, emo){
  var p;
  if(typeof _blendKnotParams === 'function' && stats && stats.entries && stats.entries.length > 0){
    p = _blendKnotParams(stats.entries, new Date().getMonth()).full;
  } else {
    p = KNOT_PARAMS[emo] || KNOT_FALLBACK;
  }
  var state = (typeof computeCurrentMonthState === 'function') ? computeCurrentMonthState() : 'forming';
  var opacity = (stats && stats.count > 0)
    ? (state === 'almost' ? 0.18 : 0.06)
    : 0.06;
  var seed = new Date().getMonth() * 137.5;
  ctx.save();
  // Ghost concentric rings (matches weave nav's ◎ aesthetic).
  // Radii match _drawKnotGeometry's ring layout so forming → complete has
  // continuity of position.
  var ghostRings = [
    { rMult: 0.95, fill: false, strokeMult: 1.10 },
    { rMult: 0.55, fill: false, strokeMult: 0.85 },
    { rMult: 0.18, fill: true,  strokeMult: 0    }
  ];
  ghostRings.forEach(function(L, layer){
    var layerR = R * L.rMult;
    ctx.beginPath();
    ctx.arc(cx, cy, layerR, 0, Math.PI*2);
    if(L.fill){
      ctx.globalAlpha = opacity * 1.5; // center dot reads a touch brighter
      ctx.fillStyle = p.color;
      ctx.fill();
    } else {
      ctx.globalAlpha = opacity * (1 - layer*0.18);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.strokeW * L.strokeMult * 0.7;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  });
  // dashed outer ring (unchanged — outer boundary hint)
  ctx.strokeStyle = p.color;
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.2;
  ctx.setLineDash([2,4]);
  ctx.beginPath();
  ctx.arc(cx,cy,R*1.05,0,Math.PI*2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

// ── Animated "forming" sparkle — two trail-leaving dots orbit the center
// on a lissajous path, with a fading tail + ambient twinkle specks. Replaces
// the static ◎ ring in the big portrait canvas so the in-progress month feels
// alive. Still stops cleanly: owns `canvas._sparkleRunning` like the rotation
// loop owns `canvas._rotationRunning`.
//   - respects prefers-reduced-motion (falls back to drawCurrentMonthForming)
//   - tinted by the dominant emotion's palette (p.color / p.glow)
//   - self-terminates when the canvas detaches, state leaves "forming",
//     document.hidden, or a caller flips canvas._sparkleRunning = false
function startSparkleForming(canvas, stats, emo, opts){
  if(!canvas || canvas._sparkleRunning) return;
  opts = opts || {};
  var sizePx = opts.size || 260;        // logical CSS px square
  var rRatio = opts.rRatio || (80/260); // orbit radius relative to size

  // reduced motion → skip the loop, paint the calm ring once
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var dprR = Math.min(window.devicePixelRatio||1, 2);
    canvas.width = sizePx * dprR; canvas.height = sizePx * dprR;
    canvas.style.width = sizePx + 'px'; canvas.style.height = sizePx + 'px';
    var ctxR = canvas.getContext('2d');
    ctxR.setTransform(dprR,0,0,dprR,0,0);
    drawCurrentMonthForming(ctxR, sizePx/2, sizePx/2, sizePx*rRatio, 0, stats, emo);
    return;
  }

  canvas._sparkleRunning = true;
  canvas._rotationRunning = false; // mutually exclusive with the rose rotation loop

  var W = sizePx, H = sizePx, cx = W/2, cy = H/2, R = sizePx * rRatio;
  var dpr = Math.min(window.devicePixelRatio||1, 2);
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  var ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // emotion tint
  var p = (typeof KNOT_PARAMS !== 'undefined' && KNOT_PARAMS[emo]) ? KNOT_PARAMS[emo] : (typeof KNOT_FALLBACK !== 'undefined' ? KNOT_FALLBACK : {color:'#c9943a', glow:'rgba(201,148,58,0.6)'});
  var m = (p.glow || '').match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  var tintR = m ? +m[1] : 201, tintG = m ? +m[2] : 148, tintB = m ? +m[3] : 58;
  var tint = function(a){ return 'rgba('+tintR+','+tintG+','+tintB+','+a+')'; };

  // scale dot/trail sizes proportionally so the sparkle reads on any canvas size
  var scale = sizePx / 260;

  // two heads — offset phases trace a figure-8 / lissajous inside the ring
  var TRAIL_LEN = 34;
  var trails = [ [], [] ];

  // ambient twinkle specks — slow life-cycle, random positions inside R*1.15
  var SPECK_COUNT = 14;
  var specks = [];
  for(var s = 0; s < SPECK_COUNT; s++){
    specks.push({
      a: Math.random() * Math.PI * 2,
      r: (0.25 + Math.random()*0.95) * R,
      life: Math.random(),
      speed: 0.0015 + Math.random()*0.0025,
      size: (0.5 + Math.random()*1.3) * scale
    });
  }

  // faint ghost ring behind everything — keeps a whisper of the ◎ marker
  function drawGhostRing(){
    ctx.save();
    ctx.globalAlpha = 0.10;
    ctx.strokeStyle = tint(1);
    ctx.lineWidth = 0.9;
    ctx.setLineDash([2,5]);
    ctx.beginPath(); ctx.arc(cx, cy, R*1.05, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.07;
    ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.arc(cx, cy, R*0.55, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
  }

  // lissajous path for head i at time t
  // a=3,b=2 is a 3:2 loop that stays symmetric and doesn't re-cross the middle too often
  function headPos(i, t){
    var phase = i === 0 ? 0 : Math.PI; // opposite sides
    var rx = R * 0.72, ry = R * 0.56;
    var x = cx + Math.sin(t * 0.9 + phase) * rx;
    var y = cy + Math.sin(t * 1.35 + phase * 0.5) * ry;
    return {x:x, y:y};
  }

  var start = performance.now();
  function frame(now){
    if(!canvas.isConnected){ canvas._sparkleRunning = false; return; }
    if(!canvas._sparkleRunning) return;
    if(document.hidden){ canvas._sparkleRunning = false; return; }

    var t = (now - start) / 1000; // seconds

    ctx.clearRect(0, 0, W, H);
    drawGhostRing();

    // ambient specks — additive, composited first so heads read on top
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for(var si = 0; si < specks.length; si++){
      var sp = specks[si];
      sp.life += sp.speed;
      if(sp.life > 1){ sp.life = 0; sp.a = Math.random()*Math.PI*2; sp.r = (0.25 + Math.random()*0.95) * R; }
      // soft in/out: peak around 0.5
      var k = Math.sin(sp.life * Math.PI);
      var sx = cx + Math.cos(sp.a) * sp.r;
      var sy = cy + Math.sin(sp.a) * sp.r;
      ctx.fillStyle = tint(0.55 * k);
      ctx.beginPath(); ctx.arc(sx, sy, sp.size * (0.6 + 0.5*k), 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();

    // heads + trails
    for(var i = 0; i < 2; i++){
      var pos = headPos(i, t);
      trails[i].push(pos);
      if(trails[i].length > TRAIL_LEN) trails[i].shift();

      // draw trail as fading dots (additive blend for glow)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for(var k2 = 0; k2 < trails[i].length; k2++){
        var pt = trails[i][k2];
        var age = k2 / trails[i].length; // 0 oldest → 1 newest
        var a = Math.pow(age, 1.6) * 0.55;   // fade curve
        var rad = (0.8 + age * 2.4) * scale;
        ctx.fillStyle = tint(a);
        ctx.beginPath(); ctx.arc(pt.x, pt.y, rad, 0, Math.PI*2); ctx.fill();
      }
      // bright head — inner core + halo
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = tint(0.35);
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 7*scale, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = tint(0.9);
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 3.1*scale, 0, Math.PI*2); ctx.fill();
      // sharp white-hot center for sparkle
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(255,248,230,0.95)';
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 1.3*scale, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// dashed ghost ring for future or empty months
function drawGhostKnot(ctx, x, y, size){
  ctx.save();
  ctx.strokeStyle = 'rgba(201,148,58,0.18)';
  ctx.lineWidth = Math.max(1, size * 0.012);
  ctx.setLineDash([size*0.04, size*0.04]);
  ctx.beginPath();
  ctx.arc(x, y, size * 0.42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// derive dominant emotion from an entries array (null when empty)
function dominantEmoFrom(entries){
  var counts = {};
  (entries||[]).forEach(function(e){ if(e.emo) counts[e.emo] = (counts[e.emo]||0) + 1; });
  return Object.keys(counts).sort(function(a,b){return counts[b]-counts[a]})[0] || null;
}

// build a drop-shadow filter string tinted to a specific emotion's palette
function knotShadowFilter(emoKey, blur, alpha){
  var p = KNOT_PARAMS[emoKey] || KNOT_FALLBACK;
  // p.glow is rgba(r,g,b,a) — rewrite alpha for the shadow
  var m = p.glow.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if(!m) return 'none';
  var r = m[1], g = m[2], b = m[3];
  return 'drop-shadow(0 0 '+blur+'px rgba('+r+','+g+','+b+','+alpha+'))';
}

// derive YYYY-MM from an entry — new entries write dateISO, older ones only have a formatted date
function getEntryMonthKey(e){
  if(e.dateISO) return e.dateISO.slice(0,7);
  if(e.date){
    var d = new Date(e.date);
    if(!isNaN(d)) return d.toISOString().slice(0,7);
  }
  return null;
}

// compute stats for a specific ISO month key "YYYY-MM"
function computeMonthStats(ym){
  var allEntries = JSON.parse(localStorage.getItem('gc_entries')||'[]');
  var monthEntries = allEntries.filter(function(e){
    return getEntryMonthKey(e) === ym;
  });
  if(monthEntries.length === 0){
    return {entries:[], count:0, topEmo:null, secondEmo:null, word:null, msg:null};
  }
  // Same priority rule as _blendKnotParams: if any real (user-authored)
  // entries exist this month, only they shape the topEmo / word / msg.
  // Demo-seeded entries don't override what the user actually wrote.
  var realEntries = monthEntries.filter(function(e){ return !e.demo; });
  var statsPool = realEntries.length > 0 ? realEntries : monthEntries;
  var emoCounts = {};
  statsPool.forEach(function(e){ if(e.emo) emoCounts[e.emo] = (emoCounts[e.emo]||0) + 1; });
  var sorted = Object.keys(emoCounts).sort(function(a,b){return emoCounts[b]-emoCounts[a]});
  var topEmo = sorted[0] || null;
  return {
    entries: monthEntries,       // full list (demo + real) still drives the chain / grid
    count: monthEntries.length,
    topEmo: topEmo,              // but topEmo prefers real
    secondEmo: sorted[1] || null,
    word: PORTRAIT_WORDS[topEmo] || topEmo,
    msg: PORTRAIT_MESSAGES[topEmo] || 'you were here. the chain remembers.',
    emoCounts: emoCounts
  };
}

// ── TAB 1: render monthly view ──
function renderPortraitMonth(){
  var now = new Date();
  var ym = now.toISOString().slice(0,7);
  var stats = computeMonthStats(ym);
  var monthLabel = now.toLocaleDateString('en-US',{month:'long',year:'numeric'}).toUpperCase();
  $('portraitMonth').textContent = monthLabel;

  var canvas = $('portraitKnotCanvas');

  if(stats.count === 0){
    // no entries this month — draw a dashed ghost
    var dpr = Math.min(window.devicePixelRatio||1, 2);
    canvas.width = 260 * dpr;
    canvas.height = 260 * dpr;
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,260,260);
    drawGhostKnot(ctx, 130, 130, 220);
    $('portraitWord').textContent = '';
    $('portraitMessage').textContent = 'start journaling to see your portrait grow.';
    $('portraitStats').textContent = '';
    $('portraitStatsSub').textContent = 'log each day this month — your knot forms at month\'s end.';
    $('shareMonthBtn').style.display = 'none';
    return;
  }

  // ── progressive loading state — show spiral/ghost while month is still in progress ──
  var currentState = computeCurrentMonthState();
  var ceremonySeen = localStorage.getItem('gc_ceremony_seen_' + ym);
  var monthComplete = ceremonySeen || (currentState === 'complete');

  if(!monthComplete && stats.count > 0){
    // Stop any lingering rotation loop from a previous complete-state render
    canvas._rotationRunning = false;
    $('portraitWord').textContent =
      currentState === 'gathering' ? '' :
      currentState === 'forming'   ? (stats.word || '') :
      (stats.word || '');

    // Use the emotion-specific present-tense line once we know the dominant
    // emotion — same copy that shows in the replay overlay, so the outside
    // screen carries the same weight. Fall back to the stage-based line for
    // the gathering stage (no dominant emotion yet) or if the dict is missing.
    var _formingLine;
    if(currentState !== 'gathering' && stats.topEmo && typeof PORTRAIT_MESSAGES_PRESENT !== 'undefined'){
      _formingLine = PORTRAIT_MESSAGES_PRESENT[stats.topEmo];
    }
    if(!_formingLine){
      _formingLine =
        currentState === 'gathering' ? 'the chain is gathering your month.'
        : currentState === 'forming'  ? 'something is taking shape.'
        : currentState === 'almost'   ? 'the knot is almost ready.'
        : 'today the chain closes.';
    }
    $('portraitMessage').textContent = _formingLine;

    $('portraitStats').textContent =
      stats.count + (stats.count===1?' entry':' entries')
      + '  \u00B7  ' + (stats.topEmo||'');
    $('portraitStatsSub').textContent =
      currentState === 'gathering'
        ? 'keep logging daily \u2014 your knot forms at month\u2019s end.'
        : currentState === 'forming'
        ? 'keep writing \u2014 the portrait reveals itself at month\u2019s end.'
        : 'almost there \u2014 log the final days to complete your portrait.';
    $('shareMonthBtn').style.display = 'none';

    var dpr = Math.min(window.devicePixelRatio||1, 2);
    canvas.width = 260 * dpr;
    canvas.height = 260 * dpr;
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,260,260);

    // Before month-end: show a living sparkle — two trail-leaving dots
    // orbit the center in a lissajous path, tinted by the dominant emotion.
    // The full rose-curve reveal is still reserved for the end-of-month
    // ceremony; this just signals "something is taking shape" with motion
    // instead of a static ring.
    if(typeof startSparkleForming === 'function'){
      startSparkleForming(canvas, {count:stats.count, topEmo:stats.topEmo}, stats.topEmo||'calm');
    } else {
      drawCurrentMonthForming(ctx, 130, 130, 80, 0, {count:stats.count, topEmo:stats.topEmo}, stats.topEmo||'calm');
    }
    // soft tinted glow around the canvas to match the emotion
    var formingMorning = document.body.classList.contains('theme-morning');
    canvas.style.filter = knotShadowFilter(stats.topEmo || 'calm', 28, formingMorning ? 0.35 : 0.22);
    return;
  }

  // ── reveal protection — same guard as the year grid ──
  // If today is the last day of the month and the user has logged but the ceremony
  // hasn't fired yet (it's on a 3200ms delay), don't spoil the full knot reveal here either.
  var monthState = (typeof computeCurrentMonthState === 'function') ? computeCurrentMonthState() : null;
  var ceremonySeen = localStorage.getItem('gc_ceremony_seen_' + ym);
  var protectReveal = (monthState === 'complete' && !ceremonySeen);

  if(protectReveal){
    // render the ghost "almost" rose + neutral copy instead of the dominant-emotion reveal
    canvas._rotationRunning = false;       // pause any ongoing rotation
    if(typeof window._invalidateClaspCache === 'function') window._invalidateClaspCache();
    var dprP = Math.min(window.devicePixelRatio||1, 2);
    canvas.width = 260 * dprP;
    canvas.height = 260 * dprP;
    var pctx = canvas.getContext('2d');
    pctx.setTransform(dprP,0,0,dprP,0,0);
    pctx.clearRect(0,0,260,260);
    if(typeof drawCurrentMonthForming === 'function'){
      drawCurrentMonthForming(pctx, 130, 130, 100, 0, stats, stats.topEmo || 'calm');
    } else {
      drawGhostKnot(pctx, 130, 130, 220);
    }
    var morningP = document.body.classList.contains('theme-morning');
    canvas.style.filter = knotShadowFilter(stats.topEmo, 22, morningP ? 0.25 : 0.12);
    $('portraitWord').textContent = 'almost';
    $('portraitMessage').textContent = 'the chain is closing \u2014 stay with it.';
    $('portraitStats').textContent = stats.count + (stats.count === 1 ? ' entry' : ' entries') + '  \u00B7  ' + stats.topEmo;
    $('portraitStatsSub').textContent = '';
    $('shareMonthBtn').style.display = 'none';
    return;
  }

  // emotion-matched drop-shadow — stronger on light theme where it actually shows
  var morning = document.body.classList.contains('theme-morning');
  canvas.style.filter = knotShadowFilter(stats.topEmo, 32, morning ? 0.45 : 0.3);

  // portrait is complete — reveal share button (only when not still gathering)
  $('shareMonthBtn').style.display = (currentState === 'gathering') ? 'none' : '';

  // text state always updates (below), canvas state depends on lifecycle
  $('portraitWord').textContent = stats.word || '';
  $('portraitMessage').textContent = stats.msg || '';
  $('portraitStats').textContent = stats.count + (stats.count === 1 ? ' entry' : ' entries') + '  \u00B7  ' + stats.topEmo;
  $('portraitStatsSub').textContent = stats.secondEmo
    ? 'top mood: ' + stats.topEmo + ', ' + stats.secondEmo
    : 'top mood: ' + stats.topEmo;

  // ── canvas lifecycle ──
  // if rotation is already running, don't touch the canvas (theme flip case: filter updated above, loop keeps going)
  if(canvas._rotationRunning) return;

  var seenKey = 'gc_portrait_seen_' + ym;
  var alreadySeen = localStorage.getItem(seenKey);
  var portraitVisible = $('s-portrait').classList.contains('active');
  var monthTabVisible = $('portraitMonthView').classList.contains('active');
  var shouldRunLoop = portraitVisible && monthTabVisible && !document.hidden;

  if(!alreadySeen && shouldRunLoop){
    // first view of this month → weave animation, then auto-rotate at its end
    localStorage.setItem(seenKey, '1');
    drawKnotAnimated(canvas, stats.entries, now.getMonth());
  } else if(alreadySeen && shouldRunLoop){
    // subsequent view (or resume after pause) → jump straight into rotation
    // the loop clears and redraws on its first frame, preserving _lastRotation
    startKnotRotation(canvas, stats.entries, now.getMonth());
  } else {
    // portrait not currently visible → paint a static state so it's ready to show
    drawKnotOnCanvas(canvas, stats.entries, now.getMonth());
  }
}

// stop the rotation loop and remember where it was; called when we're hiding the knot.
// Also stops the sparkle-forming loop so nothing keeps rAF'ing in the background.
function stopKnotRotation(){
  var canvas = document.getElementById('portraitKnotCanvas');
  if(canvas){
    canvas._rotationRunning = false;
    canvas._sparkleRunning  = false;
  }
}

// resume the rotation loop for the current month's entries; called when showing the knot again
function resumeKnotRotation(){
  var canvas = document.getElementById('portraitKnotCanvas');
  if(!canvas || canvas._rotationRunning) return;
  var ym = new Date().toISOString().slice(0,7);
  // only resume if the user has already seen this month (i.e., not the first-view case)
  if(!localStorage.getItem('gc_portrait_seen_' + ym)) return;
  var stats = computeMonthStats(ym);
  if(stats.count === 0) return;
  // don't start the rose-rotation while the month is still in progress — the
  // ring placeholder stays until end-of-month ceremony.
  var state = (typeof computeCurrentMonthState === 'function') ? computeCurrentMonthState() : null;
  var ceremonySeen = localStorage.getItem('gc_ceremony_seen_' + ym);
  var monthComplete = ceremonySeen || state === 'complete';
  if(!monthComplete) return;
  startKnotRotation(canvas, stats.entries, new Date().getMonth());
}

// ── TAB 2: render full year grid ──
// Gentle floating toast when the user taps the NOW cell. The replay overlay
// is reserved for finished months; this toast explains why nothing opened
// and how many entries the month already holds. Floats near the top so it's
// visible without scrolling down past the grid. Self-dismisses in ~3.2s.
function _showFormingHint(entryCount){
  var count = entryCount || 0;
  var entriesPhrase = count === 0
    ? 'no entries yet'
    : count + (count === 1 ? ' entry so far' : ' entries so far');
  var msg = 'this month is still forming \u2014 ' + entriesPhrase + '. come back at month\u2019s end.';

  // reuse a single toast node so rapid taps don't stack them
  var t = document.getElementById('_formingToast');
  if(!t){
    t = document.createElement('div');
    t.id = '_formingToast';
    t.className = 'forming-toast';
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  if(t._timer) clearTimeout(t._timer);
  // force reflow so the transition runs even when the class is re-added
  // while the previous toast hasn't finished fading out.
  t.classList.remove('is-visible');
  // eslint-disable-next-line no-unused-expressions
  void t.offsetWidth;
  t.classList.add('is-visible');
  t._timer = setTimeout(function(){
    t.classList.remove('is-visible');
    t._timer = null;
  }, 3200);
}

function renderPortraitYear(){
  var now = new Date();
  var currentMonth = now.getMonth();
  var currentYear = now.getFullYear();
  // Year grid always starts at January of the current year — this makes
  // the year view read as a real calendar (Jan → Dec) rather than a
  // rolling 12-month window from the user's start date. Past months
  // before start date show as "future"-style placeholders (since no
  // entries exist for them).
  var startMonth = 0;
  var startYear  = currentYear;
  var endYear = currentYear;
  $('portraitYearLabel').textContent = endYear > startYear
    ? startYear + ' \u2014 ' + endYear
    : String(startYear);

  var grid = $('portraitGrid');
  grid.innerHTML = '';
  var MONTH_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var dpr = Math.min(window.devicePixelRatio||1, 2);

  // show year share button only if at least one past month is complete
  var hasPastComplete = false;
  for(var hi = 0; hi < 12; hi++){
    var hm = (startMonth + hi) % 12;
    var hGridYear = startYear + Math.floor((startMonth + hi) / 12);
    var hCellDate = new Date(hGridYear, hm, 1);
    if(hCellDate >= new Date(currentYear, currentMonth, 1)) break;
    var hYm = hGridYear + '-' + String(hm+1).padStart(2,'0');
    if(computeMonthStats(hYm).count > 0){ hasPastComplete = true; break; }
  }
  $('shareYearBtn').style.display = hasPastComplete ? '' : 'none';

  var currentState = computeCurrentMonthState();

  var currentYM = currentYear + '-' + String(currentMonth+1).padStart(2,'0');
  var ceremonySeen = localStorage.getItem('gc_ceremony_seen_' + currentYM);
  if(currentState === 'complete' && !ceremonySeen){
    currentState = 'almost';
  }

  for(var i = 0; i < 12; i++){
    var m = (startMonth + i) % 12;
    var gridYear = startYear + Math.floor((startMonth + i) / 12);
    var ym = gridYear + '-' + String(m+1).padStart(2,'0');
    var stats = computeMonthStats(ym);
    var cellDate = new Date(gridYear, m, 1);
    var nowMonthStart = new Date(currentYear, currentMonth, 1);
    var isFuture = cellDate > nowMonthStart;
    var isCurrent = (m === currentMonth && gridYear === currentYear);
    var isPastComplete = !isFuture && !isCurrent && stats.count > 0;
    // tappable ONLY for past completed months — the in-progress month lives
    // in the hero canvas above (with its sparkle + present-tense copy), so
    // there's nothing to "open" yet for it. Future months obviously stay
    // locked. This keeps the replay overlay a past-tense ritual only.
    var tappable = isPastComplete;

    var cell = document.createElement('div');
    cell.className = 'portrait-year-cell'
      + (isFuture ? ' future' : '')
      + (tappable ? ' tappable' : '')
      + (isCurrent ? ' current' : '');
    cell.dataset.month = String(m);

    var c = document.createElement('canvas');
    c.style.width = '76px';
    c.style.height = '76px';
    cell.appendChild(c);

    if(isCurrent){
      // protect the reveal: if the user logged today on the last day but the ceremony
      // hasn't fired yet (it's on a 3200ms delay), keep showing 'almost' so the full
      // knot doesn't spoil the moment.
      var currentYM = currentYear + '-' + String(currentMonth+1).padStart(2,'0');
      var ceremonySeen = localStorage.getItem('gc_ceremony_seen_'+currentYM);
      if(currentState === 'complete' && !ceremonySeen){
        currentState = 'almost';
      }
      // progressive state for the active month — gathering/forming/almost/complete
      var morning = document.body.classList.contains('theme-morning');
      if(currentState === 'complete'){
        c.style.filter = knotShadowFilter(stats.topEmo, 14, morning ? 0.5 : 0.25);
        // complete: just draw the full rose (via existing static path) — no loading animation
        (function(canvas, entries, idx){
          requestAnimationFrame(function(){ drawKnotOnCanvas(canvas, entries, idx); });
        })(c, stats.entries, m);
      } else {
        // Before month-end (gathering / forming / almost) — show the
        // ◎ ring placeholder via drawCurrentMonthForming. Full rose reveal
        // is reserved for the end-of-month ceremony.
        c.style.filter = 'none';
        cell.dataset.animType = 'pending';
        c.width = 76 * dpr; c.height = 76 * dpr;
        var lctx = c.getContext('2d');
        lctx.setTransform(dpr,0,0,dpr,0,0);
        drawCurrentMonthForming(lctx, 38, 38, 28, 0, stats, stats.topEmo || 'calm');
      }
    } else if(isPastComplete){
      // emotion-matched shadow per cell
      var morning2 = document.body.classList.contains('theme-morning');
      c.style.filter = knotShadowFilter(stats.topEmo, 14, morning2 ? 0.5 : 0.25);
      // ── render offscreen at portrait size (220px) and downscale to 76px for natural antialiasing
      (function(displayCanvas, entries, idx){
        // size the display canvas immediately so the cell occupies the right space
        var d = Math.min(window.devicePixelRatio||1, 2);
        displayCanvas.width  = 76 * d;
        displayCanvas.height = 76 * d;
        // render offscreen synchronously; downscale-paint happens after layout settles
        requestAnimationFrame(function(){
          var off = document.createElement('canvas');
          var odpr = Math.min(window.devicePixelRatio||1, 2);
          off.width  = 220 * odpr;
          off.height = 220 * odpr;
          off.style.width  = '220px';
          off.style.height = '220px';
          drawKnotOnCanvas(off, entries, idx);
          var dctx = displayCanvas.getContext('2d');
          dctx.setTransform(d, 0, 0, d, 0, 0);
          dctx.imageSmoothingEnabled = true;
          dctx.imageSmoothingQuality = 'high';
          dctx.drawImage(off, 0, 0, 76, 76);
        });
      })(c, stats.entries, m);
    } else if(isFuture){
      // future month — dashed ring at higher opacity so it reads as intentional, not a bug
      c.width = 76 * dpr;
      c.height = 76 * dpr;
      var gctx = c.getContext('2d');
      gctx.setTransform(dpr,0,0,dpr,0,0);
      gctx.strokeStyle = 'rgba(201,148,58,0.45)';
      gctx.lineWidth = 1;
      gctx.setLineDash([3, 5]);
      gctx.beginPath();
      gctx.arc(38, 38, 26, 0, Math.PI * 2);
      gctx.stroke();
    } else {
      // past month with no entries → faint ghost
      c.width = 76 * dpr;
      c.height = 76 * dpr;
      var gctx = c.getContext('2d');
      gctx.setTransform(dpr,0,0,dpr,0,0);
      drawGhostKnot(gctx, 38, 38, 64);
    }

    var label = document.createElement('p');
    label.className = 'portrait-year-month';
    // Append a 2-digit year so spanning years read clearly:
    //   "APR '25", "MAY '25", ... "MAR '26"
    label.textContent = isCurrent
      ? 'NOW'
      : MONTH_SHORT[m] + " \u2019" + String(gridYear).slice(2);
    cell.appendChild(label);

    var word = document.createElement('p');
    word.className = 'portrait-year-word';
    if(isPastComplete && stats.word){
      word.textContent = stats.word;
    } else if(isCurrent){
      var dayOfMonth = now.getDate();
      var daysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();
      var wordText;
      if(currentState === 'complete'){
        wordText = stats.word || 'complete';
      } else if(dayOfMonth === daysInMonth){
        // last day of the month — ceremonial copy
        wordText = hasLogged ? 'the chain closes.' : 'today. the chain closes.';
      } else {
        wordText = ({
          gathering: 'gathering',
          forming:   'forming…',
          almost:    'almost'
        })[currentState] || 'almost';
      }
      word.textContent = wordText;
    } else if(isFuture){
      word.textContent = '···';
    } else {
      word.textContent = '—';
    }
    cell.appendChild(word);

    if(tappable){
      (function(captureIdx, captureEntries){
        cell.addEventListener('click', function(){ openMonthDetail(captureIdx, captureEntries); });
      })(m, stats.entries);
    } else if(isCurrent){
      // Current month isn't openable yet — the pendant reveals itself at
      // month's end. Give tactile feedback instead of silence so the tap
      // doesn't feel broken.
      cell.addEventListener('click', function(){ _showFormingHint(stats.count); });
      cell.style.cursor = 'default';
    }

    grid.appendChild(cell);
  }

  // ── loading-state animation for the current-month cell ──
  // cancel any previous loop (if the grid was re-rendered)
  if(window._portraitLoadingRAF) cancelAnimationFrame(window._portraitLoadingRAF);
  var loadingRotation = 0;
  function animateCurrentMonth(){
    window._portraitLoadingRAF = requestAnimationFrame(animateCurrentMonth);
    loadingRotation += 0.006;
    var currentCells = document.querySelectorAll('.portrait-year-cell.current');
    currentCells.forEach(function(cc){
      var type = cc.dataset.animType;
      if(!type) return;
      var c2 = cc.querySelector('canvas');
      if(!c2) return;
      var lctx = c2.getContext('2d');
      var ldpr = Math.min(window.devicePixelRatio||1, 2);
      var Wc = c2.width / ldpr, Hc = c2.height / ldpr;
      lctx.setTransform(ldpr, 0, 0, ldpr, 0, 0);
      lctx.clearRect(0, 0, Wc, Hc);
      var cmISO = new Date().getFullYear() + '-' + String(new Date().getMonth()+1).padStart(2,'0');
      var st = computeMonthStats(cmISO);
      var emoKey = st.topEmo || 'calm';
      var cxL = Wc/2, cyL = Hc/2, RL = Wc * 0.37;
      if(type === 'spiral'){
        drawCurrentMonthSpiral(lctx, cxL, cyL, RL, Date.now()*0.001, emoKey);
      } else {
        drawCurrentMonthForming(lctx, cxL, cyL, RL, loadingRotation, st, emoKey);
      }
    });
  }
  var _initialCurrentCells = document.querySelectorAll('.portrait-year-cell.current');
  if(_initialCurrentCells.length > 0 && _initialCurrentCells[0].dataset.animType){
    animateCurrentMonth();
  }
}

// cancel the current-month loading animation (called when leaving portrait)
function stopPortraitLoadingAnim(){
  if(window._portraitLoadingRAF){
    cancelAnimationFrame(window._portraitLoadingRAF);
    window._portraitLoadingRAF = null;
  }
}

// ── month detail bottom sheet ──
// Monthly replay — paged view for a completed past month from the Year grid.
// Mirrors the structure of the end-of-month ceremony (announcement, what you
// carried, moment that held, days, thread held, close) but skips the
// weave-in intro since the user has already earned the reveal.
function showMonthReplay(ym, monthIndex, entries){
  if(document.getElementById('monthReplayOverlay')) return;
  entries = entries || [];
  if(entries.length === 0) return;

  var yearOfReplay = parseInt(ym.slice(0,4),10) || new Date().getFullYear();
  var dateForLabel = new Date(yearOfReplay, monthIndex, 1);
  var monthName = dateForLabel.toLocaleDateString('en-US',{month:'long'}).toLowerCase();
  var daysInMonth = new Date(yearOfReplay, monthIndex+1, 0).getDate();
  var DAY_WORDS = ['','one','two','three','four','five','six','seven','eight','nine','ten',
    'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty',
    'twenty-one','twenty-two','twenty-three','twenty-four','twenty-five','twenty-six','twenty-seven',
    'twenty-eight','twenty-nine','thirty','thirty-one'];

  // stats — real-first dominant so demo seeds don't outvote real entries
  var emoCounts = {};
  var longestEntry = null, longestLen = -1;
  var _replayPool = _realFirst(entries);
  _replayPool.forEach(function(e){
    if(e.emo) emoCounts[e.emo] = (emoCounts[e.emo]||0) + 1;
  });
  // longest-entry calculation uses the full pool — it's just text stats
  entries.forEach(function(e){
    var tl = (e.text||'').length;
    if(tl > longestLen){ longestLen = tl; longestEntry = e; }
  });
  var dominant = Object.keys(emoCounts).sort(function(a,b){ return emoCounts[b]-emoCounts[a]; })[0] || 'calm';
  var monthWord = PORTRAIT_WORDS[dominant] || dominant;
  var monthMsg = PORTRAIT_MESSAGES[dominant] || 'you were here. the chain remembers.';
  // Voice rule: finished months read in past tense (the month is closed —
  // the chain "held"). An in-progress month must read in present tense —
  // nothing is finished yet, and "you burned for something" lands wrong
  // while the user is still burning for it. We pick which dict to pull
  // from based on whether this replay is the still-forming current month.
  var closingLinesPast = {
    calm:'the quiet was real. you were in it.',
    tender:'soft and still here. that matters.',
    grateful:'you noticed. the chain remembers.',
    hard:'hard months count too. this one did.',
    heavy:'you carried what you could. that is enough.',
    overwhelmed:'small returns through the flood. you kept arriving.',
    alive:'you burned. the chain burned with you.',
    numb:'even the quiet ones are held.',
    hopeful:'something is still opening. stay close to it.',
    light:'you caught the brightness. it stays.',
    quiet:'a month of hush. you honored it.',
    foggy:'you kept walking through. that is how it clears.',
    restless:'restlessness pointed you somewhere. you followed.',
    searching:'searching is a kind of faith. you held it.',
    sad:'sadness got a witness this month. you gave it one.',
    frustrated:'you cared enough to be frustrated. that is love.',
    anxious:'small safe things, one at a time. you did them.',
    heartbroken:'the chain held what you could not carry alone.',
    disappointed:'what disappointed you mattered. that means something.',
    exhausted:'rest is also part of the practice. you earned it.',
    moved:'you let it move you. that is a kind of courage.',
    passionate:'you burned for something. the chain burned with you.',
    nervous:'you stayed close to the edge and kept arriving.',
    livid:'anger was honest this month. you told the truth.',
    lonely:'the chain kept you company. you were not alone.',
    ashamed:'you showed up when you wanted to hide. that counts.',
    certain:'you knew what you knew this month. that is not small.',
    content:'enough arrived. you let it be enough.',
    focused:'you kept the thread this month. that is a practice.',
    inspired:'something sparked. you tended it. it stays.',
    lost:'you walked without a map. arriving still counts.',
    relaxed:'ease visited. you let it stay.',
    vulnerable:'you were soft. the chain held that.',
    yearning:'a month of reaching. the chain is the evidence.',
    betrayed:'the break was real. you told the truth about it.',
    bored:'flat months count. you stayed.',
    insecure:'you doubted and showed up anyway.',
    upset:'upset is honest. you let it be.'
  };
  var closingLinesPresent = {
    calm:'the quiet is real. you are in it.',
    tender:'soft and still here. that matters.',
    grateful:'you are noticing. the chain is listening.',
    hard:'hard months count too. this one does.',
    heavy:'you are carrying what you can. that is enough.',
    overwhelmed:'small returns through the flood. you keep arriving.',
    alive:'you are burning. the chain is burning with you.',
    numb:'even the quiet ones are held.',
    hopeful:'something is opening. stay close to it.',
    light:'you are catching the brightness. it stays.',
    quiet:'a month of hush. you are honoring it.',
    foggy:'you are walking through. that is how it clears.',
    restless:'restlessness is pointing you somewhere. you are following.',
    searching:'searching is a kind of faith. you are holding it.',
    sad:'sadness has a witness this month. you are giving it one.',
    frustrated:'you care enough to be frustrated. that is love.',
    anxious:'small safe things, one at a time. you are doing them.',
    heartbroken:'the chain is holding what you cannot carry alone.',
    disappointed:'what disappoints you matters. that means something.',
    exhausted:'rest is also part of the practice. you are earning it.',
    moved:'you are letting it move you. that is a kind of courage.',
    passionate:'you are burning for something. the chain is burning with you.',
    nervous:'you stay close to the edge and keep arriving.',
    livid:'anger is honest this month. you are telling the truth.',
    lonely:'the chain is keeping you company. you are not alone.',
    ashamed:'you are showing up when you want to hide. that counts.',
    certain:'you know what you know this month. that is not small.',
    content:'enough is arriving. you are letting it be enough.',
    focused:'you are keeping the thread this month. that is a practice.',
    inspired:'something is sparking. you are tending it. it stays.',
    lost:'you are walking without a map. arriving still counts.',
    relaxed:'ease is visiting. you are letting it stay.',
    vulnerable:'you are soft. the chain is holding that.',
    yearning:'a month of reaching. the chain is the evidence.',
    betrayed:'the break is real. you are telling the truth about it.',
    bored:'flat months count. you are staying.',
    insecure:'you are doubting and showing up anyway.',
    upset:'upset is honest. you are letting it be.'
  };
  // decide tense up-front (same logic that flips the canvas into sparkle mode)
  var _nowForTense = new Date();
  var _isCurrentMonthReplay = (yearOfReplay === _nowForTense.getFullYear() && monthIndex === _nowForTense.getMonth());
  var _ceremonySeenTense = localStorage.getItem('gc_ceremony_seen_' + ym);
  var _curStateTense = (typeof computeCurrentMonthState === 'function') ? computeCurrentMonthState() : null;
  var _isFormingTense = _isCurrentMonthReplay && !_ceremonySeenTense && _curStateTense !== 'complete';
  // tense-flip the body line on page 2 too — this is the "you burned..." / "you are burning..." copy
  if(_isFormingTense && typeof PORTRAIT_MESSAGES_PRESENT !== 'undefined'){
    monthMsg = PORTRAIT_MESSAGES_PRESENT[dominant] || 'you are here. the chain is listening.';
  }
  var closingLines = _isFormingTense ? closingLinesPresent : closingLinesPast;
  var closingLabel = _isFormingTense ? 'the thread is holding' : 'the thread held';
  var closingFallback = _isFormingTense
    ? 'you are arriving this month. the chain is listening.'
    : 'you arrived this month. the chain remembers.';

  // ── Build overlay + pages ────────────────────────────────────────
  var overlay = document.createElement('div');
  overlay.id = 'monthReplayOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:200;background:rgba(7,5,3,0.95);opacity:0;transition:opacity 500ms ease;overflow:hidden';

  var pager = document.createElement('div');
  pager.style.cssText = 'width:100%;height:100%;display:flex;transition:transform 400ms cubic-bezier(0.25,0.1,0.25,1);touch-action:pan-y';
  var pages = [];
  for(var i = 0; i < 6; i++){
    var page = document.createElement('div');
    page.style.cssText = 'flex:0 0 100vw;width:100vw;height:100%;position:relative';
    pager.appendChild(page);
    pages.push(page);
  }

  // Close button (top-right)
  var closeBtn = document.createElement('button');
  closeBtn.textContent = 'close';
  closeBtn.style.cssText = 'position:absolute;top:max(18px,env(safe-area-inset-top));right:20px;background:transparent;border:none;font-family:Fraunces,serif;font-style:italic;font-size:13px;color:rgba(201,148,58,0.55);cursor:pointer;z-index:20';
  closeBtn.addEventListener('click', function(){
    overlay.style.opacity = '0';
    setTimeout(function(){ if(overlay.parentNode) overlay.remove(); }, 500);
  });

  // Dots
  var dotsWrap = document.createElement('div');
  dotsWrap.style.cssText = 'position:absolute;bottom:calc(32px + env(safe-area-inset-bottom));left:0;right:0;display:flex;justify-content:center;gap:8px;pointer-events:none';
  var dots = [];
  for(var j = 0; j < 6; j++){
    var dot = document.createElement('div');
    dot.style.cssText = 'width:6px;height:6px;border-radius:50%;background:rgba(201,148,58,'+(j===0?'0.8':'0.25')+');transition:background 300ms';
    dotsWrap.appendChild(dot);
    dots.push(dot);
  }

  // ── Render pages ─────────────────────────────────────────────────
  var dpr = Math.min(window.devicePixelRatio||1, 2);

  // PAGE 1 — announcement
  (function(){
    var wrap = '<div style="padding:calc(60px + env(safe-area-inset-top)) 32px 80px;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:center;gap:16px;max-width:400px;margin:0 auto;box-sizing:border-box">'
      + '<p style="font-family:DM Mono,monospace;font-size:9px;letter-spacing:0.2em;color:rgba(201,148,58,0.45);text-transform:uppercase;margin:0">'+ yearOfReplay +'</p>'
      + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:34px;color:rgba(245,237,224,0.9);margin:0">'+ monthName +'</p>'
      + '<p style="font-family:Fraunces,serif;font-style:italic;font-size:13px;color:rgba(245,237,224,0.4);margin:0 0 8px">'+ (DAY_WORDS[entries.length]||String(entries.length)) +' '+(entries.length===1?'morning':'mornings')+'</p>'
      + '<canvas id="_mrKnotMain" width="240" height="240" style="width:220px;height:220px"></canvas>'
      + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:24px;color:var(--gold);margin:8px 0 0">'+ monthWord +'</p>'
      + '<div style="width:28px;height:1px;background:rgba(201,148,58,0.35);margin:4px 0"></div>'
      + '<p style="font-family:Fraunces,serif;font-style:italic;font-size:14px;color:rgba(245,237,224,0.65);line-height:1.6;text-align:center;max-width:320px;margin:0">'+ monthMsg +'</p>'
      + '</div>';
    pages[0].innerHTML = wrap;
  })();

  // PAGE 2 — what you carried
  (function(){
    var total = entries.length;
    var sorted = Object.keys(emoCounts).sort(function(a,b){ return emoCounts[b]-emoCounts[a]; }).slice(0,5);
    var rows = sorted.map(function(emo){
      var count = emoCounts[emo];
      var pct = Math.round(count/total*100);
      var color = (KNOT_PARAMS[emo]||KNOT_FALLBACK).color;
      return '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">'
        + '<span style="font-family:Fraunces,serif;font-style:italic;font-size:15px;color:rgba(245,237,224,0.85);flex:0 0 90px">'+emo+'</span>'
        + '<div style="flex:1;height:4px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden">'
        +   '<div style="width:'+pct+'%;height:100%;background:'+color+';opacity:0.8"></div>'
        + '</div>'
        + '<span style="font-family:DM Mono,monospace;font-size:10px;color:var(--gold);opacity:0.75">'+pct+'%</span>'
        + '</div>';
    }).join('');
    pages[1].innerHTML = '<div style="padding:calc(80px + env(safe-area-inset-top)) 48px 80px;display:flex;flex-direction:column;height:100%;justify-content:center;max-width:420px;margin:0 auto;box-sizing:border-box">'
      + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.4;text-transform:uppercase;letter-spacing:0.18em;margin:0 0 24px;text-align:center">what you carried</p>'
      + '<p style="font-family:Fraunces,serif;font-weight:300;font-size:28px;color:var(--text);text-align:center;margin:0 0 32px">'+total+' '+(total===1?'entry':'entries')+'</p>'
      + rows
      + '</div>';
  })();

  // PAGE 3 — a moment that held
  (function(){
    var text = longestEntry ? (longestEntry.text||'') : '';
    var dayLabel = longestEntry && typeof longestEntry.day === 'number' ? ('DAY '+String(longestEntry.day).padStart(3,'0')) : '';
    var emoLabel = longestEntry && longestEntry.emo ? longestEntry.emo : '';
    pages[2].innerHTML = '<div style="padding:calc(80px + env(safe-area-inset-top)) 32px 80px;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:18px;max-width:420px;margin:0 auto;box-sizing:border-box">'
      + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.4;text-transform:uppercase;letter-spacing:0.18em;margin:0">a moment that held</p>'
      + (dayLabel ? '<p style="font-family:DM Mono,monospace;font-size:9px;color:var(--gold);opacity:0.55;letter-spacing:0.12em;margin:0">'+dayLabel+(emoLabel?'  \u00B7  '+emoLabel:'')+'</p>' : '')
      + '<div style="width:24px;height:1px;background:rgba(201,148,58,0.35);margin:4px 0"></div>'
      + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:17px;color:rgba(245,237,224,0.85);line-height:1.7;text-align:center;margin:0">'+ (text || '\u2014') +'</p>'
      + '</div>';
  })();

  // PAGE 4 — days
  (function(){
    var word = DAY_WORDS[entries.length] || String(entries.length);
    pages[3].innerHTML = '<div style="padding:calc(80px + env(safe-area-inset-top)) 32px 80px;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:14px;box-sizing:border-box">'
      + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.4;text-transform:uppercase;letter-spacing:0.18em;margin:0">mornings</p>'
      + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:52px;color:var(--gold);letter-spacing:-0.02em;margin:12px 0;text-align:center;line-height:1.1">'+word+'</p>'
      + '<p style="font-family:Fraunces,serif;font-style:italic;font-size:15px;color:rgba(245,237,224,0.5);text-align:center;margin:0">mornings you arrived</p>'
      + '<p style="font-family:DM Mono,monospace;font-size:9px;color:rgba(201,148,58,0.4);letter-spacing:0.08em;margin:28px 0 0">out of '+daysInMonth+'</p>'
      + '</div>';
  })();

  // PAGE 5 — the thread held
  (function(){
    var closing = closingLines[dominant] || closingFallback;
    pages[4].innerHTML = '<div style="padding:calc(80px + env(safe-area-inset-top)) 36px 80px;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:20px;max-width:400px;margin:0 auto;box-sizing:border-box">'
      + '<p style="font-family:DM Mono,monospace;font-size:8px;color:var(--gold);opacity:0.4;text-transform:uppercase;letter-spacing:0.18em;margin:0">'+closingLabel+'</p>'
      + '<div style="width:40px;height:1px;background:linear-gradient(90deg,transparent,#c9943a,transparent);opacity:0.6"></div>'
      + '<p style="font-family:Fraunces,serif;font-style:italic;font-weight:300;font-size:18px;color:var(--gold);line-height:1.7;text-align:center;margin:0">'+closing+'</p>'
      + '</div>';
  })();

  // PAGE 6 — close
  (function(){
    var wrap = document.createElement('div');
    wrap.style.cssText = 'padding:calc(100px + env(safe-area-inset-top)) 32px calc(100px + env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:24px;max-width:400px;margin:0 auto;box-sizing:border-box';
    var mini = document.createElement('canvas');
    mini.id = '_mrKnotMini';
    mini.style.cssText = 'width:120px;height:120px';
    mini.width = 120 * dpr; mini.height = 120 * dpr;
    wrap.appendChild(mini);
    var mLabel = document.createElement('p');
    mLabel.textContent = monthName.toUpperCase() + '  ' + yearOfReplay;
    mLabel.style.cssText = 'font-family:"DM Mono",monospace;font-size:10px;color:var(--gold);opacity:0.55;letter-spacing:0.2em;margin:4px 0 0';
    wrap.appendChild(mLabel);
    var spacer = document.createElement('div');
    spacer.style.cssText = 'flex:1';
    wrap.appendChild(spacer);
    var closeInnerBtn = document.createElement('button');
    closeInnerBtn.textContent = 'close';
    closeInnerBtn.style.cssText = 'width:100%;max-width:280px;padding:16px;background:rgba(201,148,58,0.08);border:1px solid var(--gold);border-radius:14px;color:var(--gold);font-family:Fraunces,serif;font-style:italic;font-size:16px;cursor:pointer;transition:all 200ms ease';
    closeInnerBtn.addEventListener('click', function(){
      overlay.style.opacity = '0';
      setTimeout(function(){ if(overlay.parentNode) overlay.remove(); }, 500);
    });
    wrap.appendChild(closeInnerBtn);
    pages[5].innerHTML = '';
    pages[5].appendChild(wrap);
  })();

  overlay.appendChild(pager);
  overlay.appendChild(closeBtn);
  overlay.appendChild(dotsWrap);
  document.body.appendChild(overlay);

  // Draw the two knots after attach (so getContext is valid + sized).
  // If this is the current, still-forming month, mirror the outside portrait
  // screen by showing the ◎ ring placeholder instead of the fully-formed rose
  // — the pendant reveals itself only at month's end (or after ceremony).
  var nowDate = new Date();
  var isCurrentMonthReplay = (yearOfReplay === nowDate.getFullYear() && monthIndex === nowDate.getMonth());
  var ceremonySeenReplay = localStorage.getItem('gc_ceremony_seen_' + ym);
  var curStateReplay = (typeof computeCurrentMonthState === 'function') ? computeCurrentMonthState() : null;
  var replayIsForming = isCurrentMonthReplay && !ceremonySeenReplay && curStateReplay !== 'complete';

  requestAnimationFrame(function(){
    var main = document.getElementById('_mrKnotMain');
    var mini = document.getElementById('_mrKnotMini');
    if(replayIsForming){
      // Animated sparkle — mirrors the outside portrait screen so this
      // in-progress month feels alive here too. rRatio 0.38 keeps the
      // orbit inside the same visual footprint the static ring used.
      var statsForming = { count: entries.length, entries: entries, topEmo: dominant, word: monthWord };
      if(main) startSparkleForming(main, statsForming, dominant, { size: 220, rRatio: 0.38 });
      if(mini) startSparkleForming(mini, statsForming, dominant, { size: 120, rRatio: 0.38 });
    } else {
      if(main) drawKnotOnCanvas(main, entries, monthIndex);
      if(mini) drawKnotOnCanvas(mini, entries, monthIndex);
    }
  });

  // Fade in
  requestAnimationFrame(function(){ overlay.style.opacity = '1'; });

  // ── Swipe + keyboard + mouse navigation ──────────────────────────
  var currentPage = 0;
  var dragStartX = 0, dragActive = false;

  function setPage(idx){
    idx = Math.max(0, Math.min(5, idx));
    currentPage = idx;
    pager.style.transform = 'translateX(-'+(idx * 100)+'vw)';
    dots.forEach(function(dt, ix){
      dt.style.background = 'rgba(201,148,58,'+(ix===idx?'0.8':'0.25')+')';
    });
  }

  // Pointer events cover mouse, touch, and pen in one handler — works on
  // desktop (preview) and mobile (device). Fall back to touchstart/touchend
  // if pointer isn't supported.
  function onDragStart(clientX, target){
    // ignore drags that originate on interactive elements (buttons, dots)
    if(target && target.closest && target.closest('button')) return false;
    dragStartX = clientX;
    dragActive = true;
    return true;
  }
  function onDragEnd(clientX){
    if(!dragActive) return;
    var dx = clientX - dragStartX;
    if(Math.abs(dx) > 40) setPage(currentPage + (dx < 0 ? 1 : -1));
    dragActive = false;
  }

  if(window.PointerEvent){
    overlay.addEventListener('pointerdown', function(e){
      onDragStart(e.clientX, e.target);
    });
    overlay.addEventListener('pointerup', function(e){ onDragEnd(e.clientX); });
    overlay.addEventListener('pointercancel', function(){ dragActive = false; });
  } else {
    overlay.addEventListener('touchstart', function(e){
      onDragStart(e.touches[0].clientX, e.target);
    }, {passive:true});
    overlay.addEventListener('touchend', function(e){
      onDragEnd(e.changedTouches[0].clientX);
    }, {passive:true});
    overlay.addEventListener('mousedown', function(e){ onDragStart(e.clientX, e.target); });
    overlay.addEventListener('mouseup', function(e){ onDragEnd(e.clientX); });
  }

  overlay.tabIndex = 0;
  overlay.focus();
  overlay.addEventListener('keydown', function(e){
    if(e.key === 'ArrowRight') setPage(currentPage + 1);
    if(e.key === 'ArrowLeft') setPage(currentPage - 1);
    if(e.key === 'Escape'){
      overlay.style.opacity = '0';
      setTimeout(function(){ if(overlay.parentNode) overlay.remove(); }, 500);
    }
  });
  overlay._setPage = setPage;
}

function openMonthDetail(monthIndex, entries){
  // Route to the paged replay overlay instead of the simple bottom sheet.
  if(entries && entries.length > 0){
    // Derive ym from the first entry's date (year may not be the current year).
    var ym = (entries[0].date || '').slice(0,7);
    if(!ym){
      var fallback = new Date(new Date().getFullYear(), monthIndex, 1);
      ym = fallback.getFullYear() + '-' + String(monthIndex+1).padStart(2,'0');
    }
    showMonthReplay(ym, monthIndex, entries);
    return;
  }
  // empty-month case — fall back to the simple sheet
  var year = new Date().getFullYear();
  var d = new Date(year, monthIndex, 1);
  $('monthSheetTitle').textContent = d.toLocaleDateString('en-US',{month:'long',year:'numeric'});

  // derive word from entries — real-first
  var emoCounts = {};
  _realFirst(entries||[]).forEach(function(e){ if(e.emo) emoCounts[e.emo] = (emoCounts[e.emo]||0) + 1; });
  var top = Object.keys(emoCounts).sort(function(a,b){return emoCounts[b]-emoCounts[a]})[0] || null;
  $('monthSheetWord').textContent = top ? (PORTRAIT_WORDS[top] || top) : '';

  // mini knot header — use drawKnotOnCanvas once the sheet opens (defer for layout)
  var canvas = $('monthSheetKnot');
  canvas.style.width = '40px';
  canvas.style.height = '40px';
  requestAnimationFrame(function(){
    if(entries && entries.length > 0){
      drawKnotOnCanvas(canvas, entries, monthIndex);
    } else {
      var dpr = Math.min(window.devicePixelRatio||1, 2);
      canvas.width = 40 * dpr;
      canvas.height = 40 * dpr;
      var ctx = canvas.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      drawGhostKnot(ctx, 20, 20, 34);
    }
  });

  // entries — up to 5, most recent first
  var container = $('monthSheetEntries');
  container.innerHTML = '';
  var toShow = (entries||[]).slice(-5).reverse();
  if(toShow.length === 0){
    container.innerHTML = '<p class="month-sheet-empty">no entries this month.</p>';
  } else {
    toShow.forEach(function(e){
      var row = document.createElement('div');
      row.className = 'month-sheet-entry';
      var text = (e.text||'').slice(0, 120);
      if((e.text||'').length > 120) text += '…';
      var head = document.createElement('div');
      head.className = 'mse-head';
      head.innerHTML = '<span>DAY '+String(e.day||1).padStart(3,'0')+'</span><span class="mse-emo">'+(e.emo||'')+'</span>';
      row.appendChild(head);
      var p = document.createElement('p');
      p.className = 'mse-text';
      p.textContent = text;
      row.appendChild(p);
      container.appendChild(row);
    });
  }

  $('monthSheet').classList.add('open');
}

// unified populate — called on load and after new entries
// Tabs were merged: the calendar year IS the portrait now. We still call
// renderPortraitMonth() so the hidden month canvas + stats stay warm for
// share-month generation, but its rotation loop never starts (the visibility
// checks inside renderPortraitMonth gate on #portraitMonthView being .active,
// which no longer happens).
function populatePortrait(){
  renderPortraitMonth();
  renderPortraitYear();
}
populateHeld();
populatePortrait();
window.__portraitReady = true;

// pause any leftover rotation when the browser tab/app is backgrounded.
// (No resume branch — the month tab no longer surfaces in the UI.)
document.addEventListener('visibilitychange', function(){
  if(document.hidden){
    stopKnotRotation();
    if(typeof stopPortraitLoadingAnim === 'function') stopPortraitLoadingAnim();
  }
});

// month sheet close
$('monthSheetClose').addEventListener('click', function(){
  $('monthSheet').classList.remove('open');
});
$('monthSheet').addEventListener('click', function(e){
  if(e.target === this) this.classList.remove('open');
});

// ── SHARE CANVAS GENERATION ────────────────────────
function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight){
  var words = String(text||'').split(' ');
  var lines = [];
  var curLine = '';
  for(var i = 0; i < words.length; i++){
    var testLine = curLine ? curLine + ' ' + words[i] : words[i];
    if(ctx.measureText(testLine).width > maxWidth && curLine){
      lines.push(curLine);
      curLine = words[i];
    } else {
      curLine = testLine;
    }
  }
  if(curLine) lines.push(curLine);
  var startY = y - ((lines.length - 1) * lineHeight) / 2;
  for(var j = 0; j < lines.length; j++){
    ctx.fillText(lines[j], x, startY + j * lineHeight);
  }
}

function renderMonthShareCanvas(){
  var cv = document.createElement('canvas');
  cv.width = 1080; cv.height = 1080;
  var ctx = cv.getContext('2d');
  ctx.fillStyle = '#0e0b07';
  ctx.fillRect(0, 0, 1080, 1080);

  var now = new Date();
  var ym = now.toISOString().slice(0,7);
  var stats = computeMonthStats(ym);

  if(stats.count > 0) _drawKnotGeometry(ctx, 540, 440, 260, stats.entries, now.getMonth());
  else drawGhostKnot(ctx, 540, 440, 560);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // month name
  var monthLabel = now.toLocaleDateString('en-US',{month:'long',year:'numeric'}).toUpperCase();
  ctx.fillStyle = 'rgba(201,148,58,0.6)';
  ctx.font = '28px "DM Mono", monospace';
  if('letterSpacing' in ctx) ctx.letterSpacing = '0.2em';
  ctx.fillText(monthLabel, 540, 760);
  if('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  // one-word
  ctx.fillStyle = '#e6b658';
  ctx.font = 'italic 52px "Fraunces", serif';
  ctx.fillText(stats.word || 'held', 540, 830);

  // message
  ctx.fillStyle = 'rgba(245,237,224,0.5)';
  ctx.font = 'italic 22px "Fraunces", serif';
  drawWrappedText(ctx, stats.msg || '', 540, 900, 700, 32);

  // wordmark
  ctx.fillStyle = 'rgba(201,148,58,0.35)';
  ctx.font = '16px "Fraunces", serif';
  ctx.fillText('Arrive', 540, 980);

  return cv;
}

function renderYearShareCanvas(){
  var cv = document.createElement('canvas');
  cv.width = 1080; cv.height = 1920;
  var ctx = cv.getContext('2d');
  ctx.fillStyle = '#0e0b07';
  ctx.fillRect(0, 0, 1080, 1920);

  var now = new Date();
  var currentMonth = now.getMonth();
  var currentYear = now.getFullYear();
  var yrStartObj = gcStartDate ? new Date(gcStartDate) : now;
  var yrStartMonth = yrStartObj.getMonth();
  var yrStartYear  = yrStartObj.getFullYear();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // year label — show the actual 365-day span of the chain
  ctx.fillStyle = 'rgba(201,148,58,0.15)';
  ctx.font = '300 120px "Fraunces", serif';
  (function(){
    var _ed = new Date(yrStartObj); _ed.setDate(_ed.getDate() + 364);
    var _ey = _ed.getFullYear();
    var _lbl = (yrStartYear === _ey) ? String(yrStartYear) : (yrStartYear + ' \u2014 ' + _ey);
    ctx.fillText(_lbl, 540, 220);
  })();

  // 4x3 grid
  var MONTH_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var cellW = 220, cellGapX = 30, cellGapY = 80;
  var gridW = 4 * cellW + 3 * cellGapX; // 940
  var startX = (1080 - gridW) / 2; // 70
  var startY = 440;

  for(var i = 0; i < 12; i++){
    var m = (yrStartMonth + i) % 12;
    var yrGridYear = yrStartYear + Math.floor((yrStartMonth + i) / 12);
    var col = i % 4;
    var row = Math.floor(i / 4);
    var cx = startX + col * (cellW + cellGapX) + cellW/2;
    var cy = startY + row * (cellW + cellGapY) + cellW/2;
    var ym = yrGridYear + '-' + String(m+1).padStart(2,'0');
    var stats = computeMonthStats(ym);
    var isFuture = new Date(yrGridYear, m, 1) > new Date(currentYear, currentMonth, 1);
    var isPast = stats.count > 0;

    if(isPast) _drawKnotGeometry(ctx, cx, cy, 90, stats.entries, m);
    else drawGhostKnot(ctx, cx, cy, 180);

    ctx.fillStyle = 'rgba(201,148,58,0.4)';
    ctx.font = '18px "DM Mono", monospace';
    ctx.fillText(MONTH_SHORT[m] + " \u2019" + String(yrGridYear).slice(2), cx, cy + 130);

    ctx.fillStyle = 'rgba(245,237,224,0.35)';
    ctx.font = 'italic 20px "Fraunces", serif';
    var wordLabel = (isPast && stats.word) ? stats.word : (isFuture ? '···' : '—');
    ctx.fillText(wordLabel, cx, cy + 160);
  }

  // wordmark
  ctx.fillStyle = 'rgba(201,148,58,0.25)';
  ctx.font = '16px "DM Mono", monospace';
  ctx.fillText('Arrive  ·  your year in knots', 540, 1860);

  return cv;
}

function shareCanvasBlob(canvas, filename, caption){
  canvas.toBlob(function(blob){
    if(!blob) return;
    var file;
    try{ file = new File([blob], filename, {type:'image/png'}); }catch(e){ file = null; }
    if(file && navigator.canShare && navigator.canShare({files:[file]})){
      navigator.share({files:[file], title:'Arrive', text: caption}).catch(function(){});
      return;
    }
    // fallback: download
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  }, 'image/png');
}

function withShareLoading(btn, delayMs, work){
  var orig = btn.textContent;
  btn.textContent = 'weaving...';
  btn.classList.add('loading');
  setTimeout(function(){
    try{ work(); }catch(e){}
    btn.textContent = 'share ↗';
    btn.classList.remove('loading');
    setTimeout(function(){ btn.textContent = orig; }, 1800);
  }, delayMs);
}

$('shareMonthBtn').addEventListener('click', function(){
  var btn = this;
  withShareLoading(btn, 120, function(){
    var cv = renderMonthShareCanvas();
    var now = new Date();
    var month = now.toLocaleDateString('en-US',{month:'long'}).toLowerCase();
    var stats = computeMonthStats(now.toISOString().slice(0,7));
    var caption = month + ' was ' + (stats.word || 'held') + '. #Arrive';
    shareCanvasBlob(cv, 'arrive-'+month+'.png', caption);
  });
});

$('shareYearBtn').addEventListener('click', function(){
  var btn = this;
  withShareLoading(btn, 300, function(){
    var cv = renderYearShareCanvas();
    var shareYear = gcStartDate ? new Date(gcStartDate).getFullYear() : new Date().getFullYear();
    var caption = shareYear + ' in knots. #Arrive';
    shareCanvasBlob(cv, 'arrive-'+shareYear+'.png', caption);
  });
});

function go(from, to) {
  $(from).classList.remove('active');
  $(to).classList.add('active');
  // hide nav during journaling flow, show on main screens
  const nav=$('bottomNav');
  if(nav){
    const showOn=['s-splash','s-held','s-memories','s-portrait','s-unfold'];
    if(showOn.includes(to)) nav.classList.add('show');
    else nav.classList.remove('show');
  }
}

