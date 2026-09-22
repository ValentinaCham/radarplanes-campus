import { el, clear, icon, categoryEmoji, fmtDistance } from '../utils/dom.js';
import { CATEGORIES, SEED_PLANS } from '../data/plans.js';

const STORAGE_KEY = 'radarplans.v1';

class PlanStore {
  constructor() {
    const stored = this._load();
    this.plans = stored?.plans ?? [...SEED_PLANS];
    this.joined = stored?.joined ?? ['plan-2'];
    this.created = stored?.created ?? ['plan-3'];
    this.radius = stored?.radius ?? 1;
    this.sort = stored?.sort ?? 'distance';
    this.category = stored?.category ?? 'all';
    this.pichangaAlert = stored?.pichangaAlert ?? true;
  }

  _load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
  }
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        plans: this.plans, joined: this.joined, created: this.created,
        radius: this.radius, sort: this.sort, category: this.category,
        pichangaAlert: this.pichangaAlert
      }));
    } catch {}
  }

  filteredPlans() {
    let list = [...this.plans];
    if (this.category !== 'all') list = list.filter(p => p.category === this.category);
    if (this.sort === 'distance') list.sort((a, b) => a.distance - b.distance);
    else list.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0));
    return list;
  }

  createPlan(data) {
    const plan = {
      id: 'p-' + Math.random().toString(36).slice(2, 9),
      title: data.title,
      description: data.description,
      category: data.category,
      distance: 100 + Math.floor(Math.random() * 400),
      location: data.location,
      capacity: data.capacity,
      attendees: 1,
      startsIn: '15 min',
      urgent: false,
      host: { name: 'Tú', career: 'Estudiante', avatar: '' },
      image: ''
    };
    this.plans = [plan, ...this.plans];
    this.created = [plan.id, ...this.created];
    this.save();
    return plan;
  }

  join(id) {
    const plan = this.plans.find(p => p.id === id);
    if (!plan) return false;
    if (plan.attendees >= plan.capacity) return false;
    plan.attendees += 1;
    if (!this.joined.includes(id)) this.joined.push(id);
    this.save();
    return true;
  }

  leave(id) {
    const plan = this.plans.find(p => p.id === id);
    if (!plan) return;
    plan.attendees = Math.max(0, plan.attendees - 1);
    this.joined = this.joined.filter(x => x !== id);
    this.save();
  }

  cancel(id) {
    this.plans = this.plans.filter(p => p.id !== id);
    this.created = this.created.filter(x => x !== id);
    this.joined = this.joined.filter(x => x !== id);
    this.save();
  }

  setRadius(r) { this.radius = r; this.save(); }
  setSort(s) { this.sort = s; this.save(); }
  setCategory(c) { this.category = c; this.save(); }
  togglePichanga() { this.pichangaAlert = !this.pichangaAlert; this.save(); return this.pichangaAlert; }
}

export const store = new PlanStore();
window.__store = store; // dev helper

/* ============== View: Radar / Home ============== */
export function RadarView({ onNavigate, onOpenDetail }) {
  const container = el('div', { class: 'view' });

// Subheader
  const live = store.filteredPlans().length;
  const sub = el('div', { class: 'px-gutter-mobile pt-2 pb-1' },
    el('div', { class: 'card card--high' },
      el('div', { class: 'row row--between' },
        el('div', { class: 'row', style: { minWidth: 0, flex: 1 } },
          el('div', { class: 'radar-stats__icon' }, icon('near_me'),
            el('span', { class: 'dot dot--ping', style: { position: 'absolute' } })
          ),
          el('div', { style: { display: 'flex', flexDirection: 'column', minWidth: 0 } },
            el('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } },
              el('strong', {}, 'Campus Central'),
              el('span', { class: 'dot' }),
              el('span', { class: 'pill pill--secondary', style: { padding: '1px 8px' } }, '<500m')
            ),
            el('span', { class: 'card-sub' }, `${live} planes activos detectados`)
          )
        ),
        el('button', {
          class: 'btn btn--ghost', style: { padding: '8px 12px', fontSize: '12px', flexShrink: 0 },
          onClick: () => {
            store.setSort(store.sort === 'distance' ? 'urgency' : 'distance');
            onNavigate('radar');
            toast('Ordenando por: ' + (store.sort === 'distance' ? 'Distancia' : 'Urgencia'));
          }
        },
          icon('swap_vert', { size: 16 }),
          el('span', { style: { whiteSpace: 'nowrap' } }, store.sort === 'distance' ? 'Distancia' : 'Urgencia')
        )
      )
    )
  );
  container.appendChild(sub);

  // Category chips
  const chipsRow = el('div', { class: 'chips', style: { padding: '4px 16px' } });
  for (const cat of CATEGORIES) {
    const count = cat.id === 'all' ? store.plans.length : store.plans.filter(p => p.category === cat.id).length;
    const c = el('button', {
      class: 'chip' + (store.category === cat.id ? ' is-active' : ''),
      onClick: () => { store.setCategory(cat.id); onNavigate('radar'); toast('Filtrando planes…'); }
    },
      el('span', {}, cat.emoji),
      el('span', {}, `${cat.label} (${count})`)
    );
    chipsRow.appendChild(c);
  }
  container.appendChild(chipsRow);

  // Map / Radar visual
  const ringSize = ['60px','90px','110px','140px'][store.radius];
  const radar = el('div', { class: 'card' },
    el('div', { class: 'row row--between' },
      el('div', { class: 'row' },
        icon('explore'),
        el('strong', {}, 'Planes cerca de ti')
      ),
      el('span', { class: 'pill pill--secondary' },
        el('span', { class: 'dot dot--pulse' }),
        'En vivo'
      )
    ),
    el('div', { class: 'radar-screen' },
      el('div', { class: 'radar-ring radar-ring--a' }),
      el('div', { class: 'radar-ring radar-ring--b' }),
      el('div', { class: 'radar-ring radar-ring--c', style: { width: ringSize, height: ringSize } }),
      el('div', { class: 'radar-sweep' }),
      // Pins (simulated nearby)
      el('div', { class: 'radar-pin', style: { top: '16px', left: '20px', color: 'var(--secondary)' }, onClick: () => onOpenDetail('plan-1') }, '⚽ Cancha 2'),
      el('div', { class: 'radar-pin', style: { top: '32px', right: '36px', color: 'var(--primary)' }, onClick: () => onOpenDetail('plan-4') }, '📚 Biblioteca'),
      el('div', { class: 'radar-pin', style: { bottom: '20px', right: '28px', color: 'var(--tertiary)' }, onClick: () => onOpenDetail('plan-2') }, '🎲 Cafetería'),
      el('div', { class: 'radar-pin', style: { top: '60px', left: '40%', color: 'var(--secondary-fixed)' }, onClick: () => onOpenDetail('plan-3') }, '🎉 Terraza D'),
      el('div', { class: 'radar-badge' },
        el('span', {}, `Mostrando planes a ${RADIUS_OPTIONS_DESC(store.radius)}`)
      )
    ),
    el('div', { class: 'radius-grid' },
      ...RADIUS_OPTIONS_RENDER(store.radius, () => { store.setRadius(arguments[0]); onNavigate('radar'); })
    )
  );
  container.appendChild(radar);

  // Feed header
  const feedHead = el('div', { class: 'section-head', style: { padding: '8px 16px' } },
      el('h2', {}, 'Planes a tu Alrededor'),
      el('span', { class: 'row', style: { gap: '6px' } },
        el('span', { class: 'dot dot--pulse' }),
        el('span', { class: 'muted', style: { fontSize: '12px' } }, 'En directo')
      )
  );
  container.appendChild(feedHead);

  // Feed
  const feed = el('section', { style: { padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '32px' } });
  for (const p of store.filteredPlans()) {
    feed.appendChild(planCard(p, () => onOpenDetail(p.id)));
  }
  container.appendChild(feed);

  return container;
}

const RADIUS_OPTIONS = [
  { step: 0, label: '500m', sub: 'Pabellones', desc: '500 m (~7 min caminando)' },
  { step: 1, label: '1 km', sub: 'Campus', desc: '1.0 km (~15 min caminando)' },
  { step: 2, label: '3 km', sub: 'Alrededores', desc: '3.0 km (~10 min bici)' },
  { step: 3, label: '5 km', sub: 'Distrito', desc: '5.0 km (Distrito)' }
];
function RADIUS_OPTIONS_DESC(step) { return RADIUS_OPTIONS[step].desc; }
function RADIUS_OPTIONS_RENDER(active, onChange) {
  return RADIUS_OPTIONS.map(opt => el('button', {
    class: active === opt.step ? 'is-active' : '',
    onClick: () => onChange(opt.step)
  },
    opt.label,
    el('span', {}, opt.sub)
  ));
}

function planCard(p, onOpen) {
  const pct = Math.round((p.attendees / p.capacity) * 100);
  const fillClass = {
    sport: '',
    board: 'progress__fill--tertiary',
    party: 'progress__fill--secondary-fixed',
    study: 'progress__fill--primary'
  }[p.category] ?? '';

  return el('article', {
    class: 'plan-card',
    id: p.id,
    dataset: { distance: p.distance, category: p.category },
    onClick: onOpen
  },
    el('div', { class: 'row row--between' },
      el('div', { class: 'plan-card__tags' },
        el('span', { class: 'pill pill--secondary' },
          el('span', {}, categoryEmoji(p.category)),
          el('span', {}, `${labelCat(p.category)} · A ${fmtDistance(p.distance)} (${p.location})`)
        )
      ),
      p.startsIn
        ? el('span', { class: 'pill pill--tertiary' }, icon('schedule', { size: 14 }), el('span', {}, p.startsIn))
        : p.startedAgo
          ? el('span', { class: 'pill pill--error' }, el('span', { class: 'dot dot--ping', style: { background: 'var(--error)' } }), el('span', {}, `Ya empezó (hace ${p.startedAgo})`))
          : p.startsAt
            ? el('span', { class: 'pill' }, icon('alarm', { size: 14 }), el('span', {}, p.startsAt))
            : el('span', { class: 'pill pill--secondary' }, icon('bolt', { size: 14 }), el('span', {}, p.startsIn ?? 'Ahora'))
    ),
    el('h3', { class: 'plan-card__title' }, p.title),
    el('p', { class: 'plan-card__desc' }, p.description),
    p.verifiedTag ? el('div', { class: 'row', style: { gap: '6px' } },
      el('span', { class: 'pill', style: { background: 'var(--surface-container-high)', fontSize: '10px' } },
        icon('verified', { size: 14 }), el('span', {}, `Story IG verificada `), el('strong', { style: { color: 'var(--on-surface)' } }, p.verifiedTag)
      )
    ) : null,
    p.liveOn ? el('div', { class: 'row', style: { gap: '6px' } },
      el('span', { class: 'pill' },
        el('span', { class: 'dot dot--ping', style: { background: 'var(--error)' } }),
        el('span', {}, p.liveOn + ' activo')
      )
    ) : null,
    el('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '4px' } },
      el('div', { class: 'row row--between', style: { fontSize: '12px' } },
        el('span', { class: 'pill pill--secondary', style: { padding: '2px 8px' } },
          icon('group', { size: 14 }),
          el('span', {}, p.attendees >= p.capacity
            ? `Lleno (${p.capacity}/${p.capacity})`
            : `Quedan ${p.capacity - p.attendees} cupos de ${p.capacity}`)
        ),
        el('span', { class: 'muted', style: { fontSize: '11px' } }, `${p.attendees} anotados (${pct}%)`)
      ),
      el('div', { class: 'progress' },
        el('div', { class: 'progress__fill ' + fillClass, style: { width: pct + '%' } })
      )
    ),
    el('button', {
      class: 'btn btn--secondary btn--block btn--lg',
      onClick: (e) => { e.stopPropagation(); quickRsvp(p); }
    },
      el('span', {}, 'Ver Plan & Sumarme'),
      icon('bolt', { size: 18 })
    )
  );
}

function labelCat(id) {
  return { sport: 'Pichanga', board: 'Cartas & Mesa', party: 'Fiesta & Previa', study: 'Estudio' }[id];
}

function quickRsvp(p) {
  if (store.joined.includes(p.id)) {
    toast('Ya estás anotado en este plan');
    return;
  }
  if (p.attendees >= p.capacity) {
    toast('Cupos agotados');
    return;
  }
  store.join(p.id);
  toast('⚡ ¡Cupo reservado con éxito!');
}