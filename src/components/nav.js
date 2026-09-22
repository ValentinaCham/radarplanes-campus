import { el, icon } from '../utils/dom.js';

const NAV_ITEMS = [
  { id: 'radar', label: 'Radar', icon: 'radar' },
  { id: 'lanzar', label: 'Lanzar', icon: 'bolt', fab: true },
  { id: 'mis-planes', label: 'Planes', icon: 'check_circle', badge: 2 },
  { id: 'comunidad', label: 'Comunidad', icon: 'shield' }
];

export function BottomNav({ active, onNavigate, joinedCount }) {
  const wrap = el('nav', { class: 'bottom-nav' },
    el('div', { class: 'bottom-nav__inner' },
      ...NAV_ITEMS.map(item => {
        const isFab = !!item.fab;
        const link = el('button', {
          class: 'nav-link' + (isFab ? ' nav-link--fab' : '') + (active === item.id ? ' is-active' : ''),
          'aria-current': active === item.id ? 'page' : null,
          onClick: () => onNavigate(item.id)
        });
        link.appendChild(icon(item.icon, { size: isFab ? 26 : 22 }));
        link.appendChild(el('span', {}, item.label));
        if (item.id === 'mis-planes' && joinedCount > 0) {
          link.appendChild(el('span', { class: 'nav-badge' }, String(joinedCount)));
        }
        return link;
      })
    )
  );
  return wrap;
}

export function TopHeader({ onNavigate }) {
  return el('header', { class: 'app-header' },
    el('div', { class: 'brand' },
      el('div', { class: 'brand-mark' }, icon('radar', { size: 18 })),
      el('span', {}, 'RadarPlanes')
    ),
    el('div', { class: 'header-actions' },
      el('button', { class: 'icon-btn', onClick: () => onNavigate('comunidad'), 'aria-label': 'Comunidad' }, icon('shield', { size: 20 })),
      el('button', { class: 'icon-btn', onClick: () => onNavigate('mis-planes'), 'aria-label': 'Mis planes' }, icon('notifications', { size: 20 }))
    )
  );
}