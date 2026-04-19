// ═══ STATE ══════════════════════════════════════════
let emo = null, intent = null;
const $ = id => document.getElementById(id);

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


// ═══ THEME ══════════════════════════════════════════
// Dark mode only — theme switching removed. Keep setTheme as a no-op
// so any leftover callers don't throw.
document.body.className = 'theme-dark';
localStorage.setItem('gc_theme', 'dark');
function setTheme(){ /* dark-only; no-op */ }

