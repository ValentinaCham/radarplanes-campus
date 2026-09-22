import { el, icon, toast, categoryEmoji, fmtDistance, progressFillClass } from '../utils/dom.js';
import { store } from './radar.js';

export function DetailView({ planId, onBack }) {
  const p = store.plans.find(x => x.id === planId);
  if (!p) {
    return el('div', { class: 'view', style: { padding: '24px', textAlign: 'center' } },
      el('p', { class: 'muted' }, 'Plan no encontrado'),
      el('button', { class: 'btn btn--secondary', onClick: onBack }, 'Volver al radar')
    );
  }

  const pct = Math.round((p.attendees / p.capacity) * 100);
  const joined = store.joined.includes(p.id);

  const container = el('div', { class: 'view', style: { display: 'flex', flexDirection: 'column', gap: '14px' } });

  // Floating back button (overlay on hero)
  const backBtn = el('button', {
    class: 'icon-btn', onClick: () => onBack(false),
    style: {
      position: 'absolute', top: 'calc(16px + env(safe-area-inset-top, 0px))', left: '16px',
      zIndex: 3, background: 'rgba(34, 42, 61, 0.85)', backdropFilter: 'blur(8px)'
    },
    'aria-label': 'Volver'
  }, icon('arrow_back', { size: 20 }));

  // Hero
  const hero = el('div', { class: 'hero', style: { position: 'relative' } },
    backBtn,
    el('div', {
      class: 'hero__img',
      style: { background: heroGradient(p.category) }
    }),
    el('div', { class: 'hero__scrim' }),
    el('div', { class: 'hero__overlay-top' },
      el('div', { class: 'pill', style: { background: 'rgba(34, 42, 61, 0.85)' } },
        el('span', { class: 'dot dot--ping', style: { background: 'var(--error)' } }),
        el('span', { style: { color: 'var(--error)', fontSize: '11px', fontWeight: 700 } }, 'EN VIVO'),
        el('span', { class: 'muted', style: { fontSize: '11px' } }, '· Creado hace 8 min')
      ),
      el('button', {
        class: 'pill', style: { background: 'rgba(34, 42, 61, 0.85)', border: 'none', cursor: 'pointer' },
        onClick: () => toast('Enlace copiado al portapapeles')
      }, el('span', { style: { color: 'var(--primary)', fontSize: '12px' } }, 'Compartir'), icon('ios_share', { size: 16 }))
    ),
    el('div', { class: 'hero__overlay-bottom' },
      el('span', { class: 'pill', style: { background: 'rgba(0, 210, 156, 0.92)', color: 'var(--on-secondary-container)' } },
        icon('sports_soccer', { size: 16 }),
        el('span', { style: { fontSize: '12px', fontWeight: 700 } }, `${p.category === 'sport' ? 'Pichanga' : p.category === 'board' ? 'Cartas & Mesa' : p.category === 'party' ? 'Fiesta & Previa' : 'Estudio'} · ${fmtDistance(p.distance)}`)
      )
    )
  );
  container.appendChild(hero);

  // Title
  container.appendChild(el('div', { style: { padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '6px' } },
    el('h1', { class: 'card-title', style: { fontSize: '20px' } }, p.title),
    el('div', { class: 'row', style: { gap: '6px', color: 'var(--tertiary)', fontSize: '13px' } },
      icon('bolt', { size: 16 }),
      el('span', {}, pct >= 90 ? '¡Casi lleno! Cierra al completar todos los cupos.' : `Quedan ${p.capacity - p.attendees} cupos libres`)
    )
  ));

  // Capacity
  const avatars = el('div', { class: 'avatars' });
  for (let i = 0; i < Math.min(p.attendees, 5); i++) {
    avatars.appendChild(el('div', { class: 'avatar', style: { background: ['#40efb7','#ffb95f','#8083ff','#54fdc4','#ffb4ab'][i] } }, ['JV','MR','LM','CD','AP'][i]));
  }
  if (p.attendees > 5) avatars.appendChild(el('div', { class: 'avatar' }, `+${p.attendees - 5}`));

  container.appendChild(el('div', { class: 'card', style: { margin: '0 16px' } },
    el('div', { class: 'row row--between' },
      el('div', { class: 'row', style: { gap: '6px', minWidth: 0 } },
        icon('group', { size: 18 }),
        el('strong', { style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, `${p.attendees} de ${p.capacity} confirmados`)
      ),
      el('span', { class: 'pill pill--tertiary', style: { flexShrink: 0 } }, `¡Solo faltan ${p.capacity - p.attendees}!`)
    ),
    el('div', { class: 'progress' }, el('div', { class: 'progress__fill progress__fill--gradient', style: { width: pct + '%' } })),
    el('div', { class: 'row row--between', style: { paddingTop: '6px' } },
      avatars,
      el('div', { class: 'row', style: { gap: '4px', flexShrink: 0 } },
        el('div', { class: 'pill pill--secondary', style: { padding: '4px', borderRadius: '50%' } }, icon('person_add', { size: 16 })),
        el('div', { class: 'pill pill--secondary', style: { padding: '4px', borderRadius: '50%' } }, icon('add', { size: 16 }))
      )
    )
  ));

  // Time + venue
  container.appendChild(el('div', { style: { padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' } },
    el('div', { class: 'card card--soft', style: { flexDirection: 'row', alignItems: 'center', gap: '12px' } },
      el('div', { class: 'icon-circle icon-circle--primary' }, icon('schedule', { size: 22 })),
      el('div', {},
        el('div', { class: 'row', style: { gap: '6px' } },
          el('strong', {}, p.startsIn ? `Hoy, 4:30 PM` : p.startsAt ? 'Esta noche' : 'Ahora'),
          el('span', { class: 'pill', style: { background: 'rgba(255,185,95,0.2)', color: 'var(--tertiary)', fontSize: '10px' } }, p.startsIn ?? 'En vivo')
        ),
        el('span', { class: 'muted', style: { fontSize: '11px' } }, 'Duración estimada: 1 hora')
      )
    ),
    el('div', { class: 'card card--soft', style: { flexDirection: 'row', alignItems: 'center', gap: '12px' } },
      el('div', { class: 'icon-circle icon-circle--secondary' }, icon('stadium', { size: 22 })),
      el('div', {},
        el('strong', {}, p.location),
        el('div', { class: 'muted', style: { fontSize: '11px' } }, 'Cerca de Cafetería Central')
      )
    )
  ));

  // Organizer
  container.appendChild(el('div', { class: 'card', style: { margin: '0 16px', flexDirection: 'row', alignItems: 'center', gap: '12px' } },
    el('div', { style: { position: 'relative', flexShrink: 0 } },
      el('div', { class: 'avatar', style: { width: '44px', height: '44px', background: 'var(--primary-container)', color: 'var(--on-primary-container)', marginLeft: 0 } }, p.host.name.split(' ').map(s => s[0]).slice(0, 2).join('')),
      el('span', { class: 'dot', style: { position: 'absolute', bottom: '0', right: '0' } })
    ),
    el('div', { style: { flex: 1, minWidth: 0 } },
      el('div', { class: 'row', style: { gap: '4px' } },
        el('span', { style: { fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, p.host.name),
        icon('verified', { size: 16 })
      ),
      el('div', { class: 'muted', style: { fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, `${p.host.career} · 6to ciclo`),
      el('div', { class: 'row', style: { gap: '4px', marginTop: '2px' } },
        icon('star', { size: 14 }),
        el('span', { style: { fontWeight: 700, fontSize: '12px' } }, '4.9'),
        el('span', { class: 'muted', style: { fontSize: '11px' } }, '· 18 planes')
      )
    ),
    el('button', { class: 'icon-btn', style: { flexShrink: 0 }, onClick: () => toast('Abriendo chat con ' + p.host.name) }, icon('chat', { size: 18 }))
  ));

  // Mini map route
  container.appendChild(el('div', { class: 'card', style: { margin: '0 16px' } },
    el('div', { class: 'row row--between' },
      el('div', { class: 'row', style: { gap: '6px' } }, icon('directions_walk', { size: 18 }), el('strong', {}, 'Ruta de llegada rápida')),
      el('span', { class: 'pill pill--secondary', style: { background: 'rgba(64,239,183,0.15)' } }, 'A pie · 5 min')
    ),
    el('div', { class: 'route' },
      svgRoute()
    ),
    el('div', { class: 'row row--between', style: { marginTop: '6px' } },
      el('div', { class: 'row', style: { gap: '6px' } },
        icon('near_me', { size: 14 }),
        el('span', { class: 'muted', style: { fontSize: '12px' } }, 'Pabellón B (Tú)')
      ),
      el('div', { class: 'row', style: { gap: '6px' } },
        icon('location_on', { size: 14 }),
        el('span', { class: 'muted', style: { fontSize: '12px' } }, p.location)
      )
    )
  ));

  // CTA
  container.appendChild(el('div', { style: { padding: '0 16px 24px' } },
    el('button', {
      class: joined ? 'btn btn--ghost btn--block btn--lg' : 'btn btn--secondary btn--block btn--lg',
      onClick: () => {
        if (joined) {
          store.leave(p.id);
          toast('Te has salido del plan');
        } else if (store.join(p.id)) {
          toast('⚡ ¡Te uniste al plan!');
        } else {
          toast('Cupos agotados');
        }
        onBack(true);
      }
    },
      joined ? icon('exit_to_app', { size: 18 }) : icon('bolt', { size: 18 }),
      el('span', {}, joined ? 'Salirme del plan' : 'Ver Plan & Sumarme')
    ),
    el('button', { class: 'btn btn--ghost btn--block', style: { marginTop: '8px' }, onClick: () => toast('Reporte enviado. Te contactaremos en breve.') },
      icon('flag', { size: 16 }), el('span', {}, 'Reportar plan')
    )
  ));

  return container;
}

function heroGradient(cat) {
  const grads = {
    sport: 'linear-gradient(135deg, #0a3d2e 0%, #40efb7 100%)',
    board: 'linear-gradient(135deg, #2a1a00 0%, #ffb95f 100%)',
    party: 'linear-gradient(135deg, #0a3d2e 0%, #54fdc4 100%)',
    study: 'linear-gradient(135deg, #1a1a4d 0%, #8083ff 100%)'
  };
  return grads[cat] ?? 'linear-gradient(135deg, #0b1326 0%, #2d3449 100%)';
}

function svgRoute() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 360 180');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.style.cssText = 'width:100%;height:100%;display:block;';
  // background grid
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#222a3d" stroke-width="0.5"/>
    </pattern>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#40efb7" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#40efb7" stop-opacity="0"/>
    </radialGradient>
  `;
  svg.appendChild(defs);
  svg.innerHTML += `
    <rect width="360" height="180" fill="#131b2e"/>
    <rect width="360" height="180" fill="url(#grid)"/>
    <path d="M -10 100 Q 80 110 160 80 T 370 30" fill="none" stroke="#171f33" stroke-width="22" stroke-linecap="round"/>
    <path d="M 30 150 Q 100 130 180 100 T 310 50" fill="none" stroke="#40efb7" stroke-dasharray="6 6" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="148" r="12" fill="url(#halo)"/>
    <circle cx="50" cy="148" r="6" fill="#8083ff"/>
    <circle cx="320" cy="48" r="10" fill="url(#halo)"/>
    <circle cx="320" cy="48" r="5" fill="#40efb7"/>
    <text x="50" y="170" text-anchor="middle" fill="#8083ff" font-family="Inter" font-size="9" font-weight="600">Tú</text>
    <text x="320" y="34" text-anchor="middle" fill="#40efb7" font-family="Inter" font-size="9" font-weight="600">Plan</text>
  `;
  return svg;
}