import { el, icon, toast } from '../utils/dom.js';
import { CATEGORY_FORM, SUGGESTED_TITLES } from '../data/plans.js';
import { store } from './radar.js';

export function LanzarView({ onNavigate }) {
  const state = {
    title: '',
    description: '',
    category: 'sport',
    location: 'Cafetería Central',
    capacity: 8,
    visible: true,
    publishing: false
  };

  const titleInput = el('input', {
    class: 'input', id: 'plan-title', maxlength: 60,
    placeholder: 'Ej: Faltan 2 para completar el 6v6 mixto',
    onInput: (e) => { state.title = e.target.value; updateCounter(); pulseField(e.target); }
  });
  const counterSpan = el('span', { id: 'char-counter' }, '0/60');

  function updateCounter() { counterSpan.textContent = `${state.title.length}/60`; }

  function pulseField(input) {
    input.style.background = 'var(--surface-container)';
    setTimeout(() => input.style.background = '', 250);
  }

  const categoryInputs = el('div', { class: 'cat-grid' });
  for (const c of CATEGORY_FORM) {
    const card = el('label', { class: 'cat-card' + (state.category === c.id ? ' is-active' : '') },
      el('input', { type: 'radio', name: 'category', value: c.id,
        checked: state.category === c.id,
        onChange: () => {
          state.category = c.id;
          for (const node of categoryInputs.children) node.classList.remove('is-active');
          card.classList.add('is-active');
        }
      }),
      el('div', { class: 'cat-card__emoji' }, c.emoji),
      el('div', { class: 'cat-card__label' },
        el('strong', {}, c.label),
        el('span', {}, c.desc)
      )
    );
    categoryInputs.appendChild(card);
  }

  const counterVal = el('span', { class: 'counter-value' }, String(state.capacity));
  const plusBtn = el('button', { class: 'counter-btn counter-btn--plus', onClick: () => {
    state.capacity = Math.min(20, state.capacity + 1);
    counterVal.textContent = state.capacity;
  }}, '+');
  const minusBtn = el('button', { class: 'counter-btn', onClick: () => {
    state.capacity = Math.max(2, state.capacity - 1);
    counterVal.textContent = state.capacity;
  }}, '−');

  const cuposControls = el('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
    el('div', { class: 'counter-row' }, minusBtn, counterVal, plusBtn),
    el('div', { class: 'row', style: { gap: '6px', justifyContent: 'center' } },
      icon('tips_and_updates', { size: 14 }),
      el('span', { class: 'muted', style: { fontSize: '11px' } }, 'Podrás ajustar los cupos en tiempo real desde "Mis Planes".')
    )
  );

  const visibleSwitch = el('button', {
    class: 'switch is-on', id: 'cupos-toggle',
    onClick: () => {
      state.visible = !state.visible;
      visibleSwitch.classList.toggle('is-on', state.visible);
      cuposControls.style.opacity = state.visible ? '1' : '0.4';
      cuposControls.style.pointerEvents = state.visible ? 'auto' : 'none';
    }
  });

  const suggestedRow = el('div', { class: 'suggested-chips' });
  for (const t of SUGGESTED_TITLES) {
    suggestedRow.appendChild(el('button', {
      class: 'chip',
      onClick: () => {
        state.title = t;
        titleInput.value = t;
        updateCounter();
        pulseField(titleInput);
        toast('Título sugerido aplicado');
      }
    }, '✨ ' + t));
  }

  const submitBtn = el('button', {
    class: 'btn btn--gradient btn--block btn--lg',
    onClick: () => publish()
  },
    icon('rocket_launch', { size: 22 }),
    el('span', {}, 'PUBLICAR PLAN AHORA (En Vivo)')
  );

  function publish() {
    if (!state.title.trim()) { toast('Escribe un título para tu plan'); titleInput.focus(); return; }
    if (state.publishing) return;
    state.publishing = true;
    submitBtn.innerHTML = '';
    submitBtn.appendChild(el('span', { class: 'btn-spinner' }));
    submitBtn.appendChild(el('span', {}, 'Lanzando señal de radar…'));
    submitBtn.style.pointerEvents = 'none';
    setTimeout(() => {
      const plan = store.createPlan({
        title: state.title.trim(),
        description: state.description.trim() || '¡Súmate a este plan!',
        category: state.category,
        location: state.location.trim() || 'Campus',
        capacity: state.capacity
      });
      state.publishing = false;
      toast('🎉 Plan publicado en vivo');
      submitBtn.innerHTML = '';
      submitBtn.appendChild(icon('check_circle', { size: 22 }));
      submitBtn.appendChild(el('span', {}, '¡Plan En Vivo en el Campus!'));
      submitBtn.classList.remove('btn--gradient');
      submitBtn.classList.add('btn--secondary');
      submitBtn.style.pointerEvents = 'auto';
      setTimeout(() => onNavigate('mis-planes', { planId: plan.id }), 700);
    }, 1100);
  }

  const wrap = el('div', { class: 'view', style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
    // Header
    el('div', { class: 'px-gutter-mobile pt-2' },
      el('div', {},
        el('h1', { class: 'card-title', style: { fontSize: '22px' } }, 'Lanzar Plan Express'),
        el('p', { class: 'card-sub' }, 'Publica un evento en menos de 30 segundos · Visible al instante')
      )
    ),
    // Title field
    el('div', { class: 'card' },
      el('div', { class: 'field' },
        el('div', { class: 'row row--between' },
          el('label', { for: 'plan-title' }, 'Título del plan'),
          counterSpan
        ),
        titleInput,
        suggestedRow
      )
    ),
    // Description
    el('div', { class: 'card' },
      el('div', { class: 'field' },
        el('label', {}, 'Descripción'),
        el('textarea', {
          class: 'textarea',
          placeholder: 'Detalles, qué llevar, requisitos, recomendaciones…',
          onInput: (e) => state.description = e.target.value
        })
      )
    ),
    // Category
    el('div', { class: 'card' },
      el('strong', {}, '¿Qué tipo de plan es?'),
      categoryInputs
    ),
    // Location
    el('div', { class: 'card' },
      el('div', { class: 'field' },
        el('label', {}, 'Punto de encuentro'),
        el('input', { class: 'input', value: state.location,
          onInput: (e) => state.location = e.target.value,
          placeholder: 'Ej: Cafetería Central, Terraza D…'
        })
      )
    ),
    // Capacity
    el('div', { class: 'card' },
      el('div', { class: 'row row--between' },
        el('div', { class: 'row' },
          icon('group'),
          el('strong', {}, 'Cupos limitados')
        ),
        visibleSwitch
      ),
      cuposControls
    ),
    // Submit
    el('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '24px' } },
      submitBtn,
      el('div', { class: 'row', style: { gap: '6px', justifyContent: 'center' } },
        el('span', { class: 'dot' }),
        el('span', { class: 'muted', style: { fontSize: '11px' } }, 'Se publicará en un radio de 1 km al instante')
      )
    )
  );

  return wrap;
}