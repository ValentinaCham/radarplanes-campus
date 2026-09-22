import './styles.css';
import { el, clear, toast } from './utils/dom.js';
import { BottomNav, TopHeader } from './components/nav.js';
import { RadarView, store } from './views/radar.js';
import { LanzarView } from './views/lanzar.js';
import { MisPlanesView } from './views/mis-planes.js';
import { ComunidadView } from './views/comunidad.js';
import { DetailView } from './views/detail.js';

const app = document.getElementById('app');
const state = {
  view: 'radar',
  detailId: null,
  params: null,
  history: ['radar']
};

function render() {
  clear(app);
  const shell = el('div', { class: 'app-shell' });

  if (!state.detailId) {
    shell.appendChild(TopHeader({ onNavigate: navigate }));
  }

  const frame = el('main', { class: 'shell-frame', id: 'view-frame' });
  shell.appendChild(frame);

  if (state.detailId) {
    frame.appendChild(DetailView({
      planId: state.detailId,
      onBack: (refresh) => {
        state.detailId = null;
        if (refresh) state.params = { refresh: Date.now() };
        render();
      }
    }));
  } else {
    const view = renderView(state.view, state.params);
    frame.appendChild(view);
  }

  if (!state.detailId) {
    shell.appendChild(BottomNav({
      active: state.view,
      onNavigate: (v) => navigate(v),
      joinedCount: store.joined.length
    }));
  }

  app.appendChild(shell);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (location.search.includes('debug')) {
    setTimeout(() => {
      const shellEl = document.querySelector('.shell-frame');
      const viewEl = document.querySelector('.view');
      const hero = document.querySelector('.hero');
      const h1 = document.querySelector('h1');
      const out = {
        innerWidth: window.innerWidth,
        docWidth: document.documentElement.scrollWidth,
        body: { sw: document.body.scrollWidth, cw: document.body.clientWidth },
        shell: shellEl ? { sw: shellEl.scrollWidth, cw: shellEl.clientWidth } : null,
        view: viewEl ? { sw: viewEl.scrollWidth, cw: viewEl.clientWidth } : null,
        hero: hero ? { sw: hero.scrollWidth, cw: hero.clientWidth } : null,
        h1: h1 ? { sw: h1.scrollWidth, cw: h1.clientWidth, text: h1.textContent } : null
      };
      const div = document.createElement('pre');
      div.style.cssText = 'position:fixed;top:0;left:0;background:#000;color:#0f0;padding:6px;font:11px monospace;z-index:9999;white-space:pre-wrap;max-width:100%;';
      div.textContent = JSON.stringify(out, null, 2);
      document.body.appendChild(div);
    }, 1500);
  }
}

function renderView(name, params) {
  const ctx = {
    onNavigate: navigate,
    onOpenDetail: (id) => { state.detailId = id; render(); },
    params
  };
  switch (name) {
    case 'radar': return RadarView(ctx);
    case 'lanzar': return LanzarView(ctx);
    case 'mis-planes': return MisPlanesView(ctx);
    case 'comunidad': return ComunidadView();
    default: return RadarView(ctx);
  }
}

function navigate(view, params) {
  if (view === state.view && !params) return;
  state.view = view;
  state.detailId = null;
  state.params = params || null;
  if (state.history[state.history.length - 1] !== view) state.history.push(view);
  if (location.hash !== '#' + view) history.replaceState(null, '', '#' + view);
  render();
}

// Boot from hash if present
const initialHash = location.hash.replace('#', '');
if (['radar', 'lanzar', 'mis-planes', 'comunidad'].includes(initialHash)) {
  state.view = initialHash;
}

// Allow ?plan=plan-1 deep-link for the detail view (used in screenshots)
const params = new URLSearchParams(location.search);
const initialPlan = params.get('plan');
if (initialPlan) {
  state.detailId = initialPlan;
}

// Intercept hash deep-link
window.addEventListener('hashchange', () => {
  const h = location.hash.replace('#', '');
  if (['radar', 'lanzar', 'mis-planes', 'comunidad'].includes(h)) navigate(h);
});

// Boot
render();

// Greet (only first time per session, delayed)
const skipGreet = location.search.includes('nogreet');
if (!skipGreet && !sessionStorage.getItem('rp_greeted')) {
  sessionStorage.setItem('rp_greeted', '1');
  setTimeout(() => toast('👋 Bienvenida de vuelta, Valeria', 1800), 1200);
}