import { el, icon, toast, categoryEmoji } from '../utils/dom.js';
import { store } from './radar.js';

let activeTab = 'created';

export function MisPlanesView({ onNavigate, onOpenDetail, params }) {
  const wrap = el('div', { class: 'view' });

  // Header
  wrap.appendChild(el('div', { class: 'px-gutter-mobile pt-2 pb-1' },
    el('div', { class: 'row row--between' },
      el('div', {},
        el('div', { class: 'row', style: { gap: '6px' } },
          el('h1', { class: 'card-title', style: { fontSize: '22px' } }, 'Mis Planes'),
          el('span', { style: { fontSize: '18px' } }, '⚡')
        ),
        el('p', { class: 'card-sub' }, 'Gestiona tus eventos en tiempo real o revisa tus cupos')
      ),
      el('div', { class: 'icon-circle icon-circle--secondary' }, icon('tune'))
    )
  ));

  // Tabs
  const createdBadge = el('span', { class: 'tab__badge' }, String(store.created.length));
  const joinedBadge = el('span', { class: 'tab__badge', style: { background: 'var(--surface-container-highest)', color: 'var(--on-surface-variant)' } }, String(store.joined.length));
  const tabCreated = el('button', {
    class: 'tab' + (activeTab === 'created' ? ' is-active' : ''),
    onClick: () => switchTab('created')
  }, icon('bolt', { size: 17 }), el('span', {}, 'Creados por mí'), createdBadge);
  const tabJoined = el('button', {
    class: 'tab' + (activeTab === 'joined' ? ' is-active' : ''),
    onClick: () => switchTab('joined')
  }, icon('groups', { size: 17 }), el('span', {}, 'Me Sumé'), joinedBadge);

  wrap.appendChild(el('div', { style: { padding: '8px 16px' } },
    el('div', { class: 'tabs' }, tabCreated, tabJoined)
  ));

  function switchTab(tab) {
    activeTab = tab;
    tabCreated.classList.toggle('is-active', tab === 'created');
    tabJoined.classList.toggle('is-active', tab === 'joined');
    refreshList();
  }

  // List container
  const list = el('div', { style: { padding: '4px 16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' } });
  wrap.appendChild(list);

  function refreshList() {
    list.innerHTML = '';
    const ids = activeTab === 'created' ? store.created : store.joined;
    const plans = ids.map(id => store.plans.find(p => p.id === id)).filter(Boolean);
    if (!plans.length) {
      list.appendChild(el('div', { class: 'card', style: { textAlign: 'center', padding: '28px 14px' } },
        icon('event_busy', { size: 36 }),
        el('p', { class: 'muted', style: { fontSize: '13px', margin: '8px 0 0' } }, activeTab === 'created' ? 'Aún no has creado planes.' : 'Aún no te sumaste a ningún plan.')
      ));
      return;
    }
    for (const p of plans) {
      if (activeTab === 'created') list.appendChild(createdCard(p, refreshList));
      else list.appendChild(joinedCard(p, onOpenDetail));
    }
  }

  refreshList();

  // Cancel modal
  let currentCancelId = null;
  const backdrop = el('div', { class: 'modal-backdrop', onClick: (e) => {
    if (e.target === backdrop) closeModal();
  }});
  const modal = el('div', { class: 'modal' },
    icon('delete_sweep', { size: 36 }),
    el('h3', {}, '¿Cancelar este plan?'),
    el('p', {}, 'Se notificará a todos los anotados y el cupo quedará libre.'),
    el('div', { class: 'modal__actions' },
      el('button', { class: 'btn btn--ghost', onClick: closeModal }, 'Mantener'),
      el('button', { class: 'btn btn--danger', onClick: () => {
        if (currentCancelId) {
          store.cancel(currentCancelId);
          toast('Plan cancelado y cupos liberados');
        }
        closeModal();
        refreshList();
        createdBadge.textContent = String(store.created.length);
      }}, 'Sí, cancelar')
    )
  );
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  function openCancelModal(id) { currentCancelId = id; backdrop.classList.add('is-open'); }
  function closeModal() { backdrop.classList.remove('is-open'); }

  function createdCard(p, refresh) {
    const pct = Math.round((p.attendees / p.capacity) * 100);
    const currentSpots = el('span', { class: 'counter-value', id: 'current-spots' }, String(p.attendees));
    const progressBar = el('div', { class: 'progress__fill', style: { width: pct + '%' } });
    const percentText = el('span', { class: 'pill pill--secondary' }, `${pct}% lleno`);

    let planActive = true;
    const statusLabel = el('span', {
      class: 'card-sub', style: { color: 'var(--secondary)', fontWeight: 700 }
    }, 'Plan Activo y Visible');
    const toggleBtn = el('button', {
      class: 'pill', style: { background: 'var(--surface-container-high)', border: 'none', cursor: 'pointer' },
      onClick: () => {
        planActive = !planActive;
        statusLabel.textContent = planActive ? 'Plan Activo y Visible' : 'Plan pausado (oculto)';
        statusLabel.style.color = planActive ? 'var(--secondary)' : 'var(--on-surface-variant)';
        toast(planActive ? 'Plan reactivado' : 'Plan pausado');
      }
    }, icon('sensors', { size: 16 }), el('span', {}, 'Pausar'));

    const incBtn = el('button', { class: 'counter-btn counter-btn--plus', onClick: () => {
      if (p.attendees >= p.capacity) return toast('Ya alcanzaste el máximo de cupos');
      p.attendees++;
      store.save();
      currentSpots.textContent = String(p.attendees);
      const newPct = Math.round((p.attendees / p.capacity) * 100);
      progressBar.style.width = newPct + '%';
      percentText.textContent = `${newPct}% lleno`;
      toast(`+1 anotado. Total: ${p.attendees}`);
    }}, '+');
    const decBtn = el('button', { class: 'counter-btn', onClick: () => {
      if (p.attendees <= 1) return toast('Mínimo 1 cupo (tú)');
      p.attendees--;
      store.save();
      currentSpots.textContent = String(p.attendees);
      const newPct = Math.round((p.attendees / p.capacity) * 100);
      progressBar.style.width = newPct + '%';
      percentText.textContent = `${newPct}% lleno`;
      toast(`-1 cupo. Total: ${p.attendees}`);
    }}, '−');

    const card = el('article', { class: 'card card--soft', style: { padding: '16px', borderRadius: '20px' } },
      el('div', { class: 'row row--between' },
        el('div', { class: 'row' },
          el('span', { class: 'dot dot--ping' }),
          statusLabel
        ),
        toggleBtn
      ),
      el('div', { class: 'row', style: { gap: '10px' } },
        el('div', {
          style: {
            width: '60px', height: '60px', borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary-container), var(--secondary))',
            display: 'grid', placeItems: 'center', fontSize: '28px', flexShrink: 0
          }
        }, categoryEmoji(p.category)),
        el('div', { style: { flex: 1, minWidth: 0 } },
          el('h3', { class: 'plan-card__title' }, p.title),
          el('div', { class: 'row', style: { gap: '8px', marginTop: '4px' } },
            el('span', { class: 'pill', style: { background: 'var(--surface-container-high)' } }, categoryEmoji(p.category) + ' ' + (p.category === 'sport' ? 'Deportes' : p.category === 'board' ? 'Cartas' : p.category === 'party' ? 'Fiesta' : 'Estudio')),
            el('span', { class: 'muted', style: { fontSize: '11px' } }, '· Hace 5 min')
        )
        )
      ),
      el('div', { class: 'card', style: { background: 'var(--surface-container)', padding: '12px' } },
        el('div', { class: 'row row--between' },
          el('span', { style: { fontWeight: 600 } }, 'Cupos en el plan'),
          percentText
        ),
        el('div', { class: 'counter-row' }, decBtn, currentSpots, incBtn),
        el('div', { class: 'progress', style: { marginTop: '6px' } }, progressBar)
      ),
      el('div', { class: 'row row--between' },
        el('span', { class: 'pill pill--secondary' }, icon('near_me', { size: 14 }), el('span', {}, p.location)),
        el('span', { class: 'pill', style: { background: 'var(--surface-container-high)' } }, icon('photo_camera', { size: 14 }), el('span', {}, 'Story IG'))
      ),
      el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } },
        el('button', { class: 'btn btn--ghost btn--lg', onClick: () => toast('Aviso enviado a los anotados') },
          icon('campaign', { size: 18 }), el('span', {}, 'Avisar lleno')
        ),
        el('button', { class: 'btn btn--danger btn--lg', onClick: () => openCancelModal(p.id) },
          icon('delete_sweep', { size: 18 }), el('span', {}, 'Cancelar')
        )
      )
    );
    return card;
  }

  function joinedCard(p, onOpen) {
    const pct = Math.round((p.attendees / p.capacity) * 100);
    return el('article', { class: 'card card--soft', style: { padding: '16px', borderRadius: '20px' } },
      el('div', { class: 'row row--between' },
        el('span', { class: 'pill pill--secondary' }, icon('confirmation_number', { size: 14 }), el('span', {}, 'Cupo Confirmado')),
        el('span', { class: 'pill pill--tertiary' }, icon('timer', { size: 14 }), el('span', {}, p.startsIn || 'Pronto'))
      ),
      el('div', { class: 'row', style: { gap: '10px' } },
        el('div', {
          style: {
            width: '60px', height: '60px', borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--tertiary), var(--secondary))',
            display: 'grid', placeItems: 'center', fontSize: '28px', flexShrink: 0
          }
        }, categoryEmoji(p.category)),
        el('div', { style: { flex: 1, minWidth: 0 } },
          el('h3', { class: 'plan-card__title' }, p.title),
          el('div', { class: 'row', style: { gap: '6px', marginTop: '4px', fontSize: '12px' } },
            icon('face_6', { size: 14 }),
            el('span', { class: 'muted' }, `Organiza ${p.host.name}`)
          )
        )
      ),
      el('div', { class: 'card', style: { background: 'var(--surface-container)', padding: '12px' } },
        el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
          el('div', {},
            el('span', { class: 'muted', style: { fontSize: '11px' } }, 'Tu Puesto'),
            el('div', { style: { color: 'var(--secondary)', fontWeight: 800, fontFamily: 'var(--font-display)' } },
              `#${Math.min(p.attendees, p.capacity)} de ${p.capacity}`)
          ),
          el('div', {},
            el('span', { class: 'muted', style: { fontSize: '11px' } }, 'Punto de Encuentro'),
            el('div', { style: { fontWeight: 600, fontSize: '13px' } }, p.location)
          )
        )
      ),
      el('div', { class: 'progress' }, el('div', { class: 'progress__fill', style: { width: pct + '%' } })),
      el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } },
        el('button', { class: 'btn btn--ghost btn--lg', onClick: () => toast('Abriendo ruta hacia ' + p.location) },
          icon('turn_sharp_right', { size: 18 }), el('span', {}, 'Ver Ruta')
        ),
        el('button', { class: 'btn btn--primary btn--lg', onClick: () => onOpen(p.id) },
          icon('forum', { size: 18 }), el('span', {}, 'Ver Detalle')
        )
      )
    );
  }

  return wrap;
}