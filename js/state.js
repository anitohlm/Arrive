// ═══ STATE ══════════════════════════════════════════
let emo = null, intent = null;
const $ = id => document.getElementById(id);

// Backend API base.
// Priority:
//   1. localStorage.gc_api_base (override — handy if you swap dev ports)
//   2. localhost dev detection → http://localhost:8766 (uvicorn dev port)
//   3. '' (same-origin, used in production)
// To change the default, edit DEV_API_BASE below.
const DEV_API_BASE = 'http://localhost:8766';
const API_BASE = (function(){
  try{
    var override = localStorage.getItem('gc_api_base');
    if(override) return override;
    if(location.hostname === 'localhost' || location.hostname === '127.0.0.1'){
      // any local preview port → dev backend port
      if(location.port && ('http://localhost:' + location.port) !== DEV_API_BASE){
        return DEV_API_BASE;
      }
    }
  }catch(e){}
  return '';
})();

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

