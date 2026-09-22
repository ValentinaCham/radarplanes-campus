import { el, icon, toast } from '../utils/dom.js';
import { SAFETY_TIPS, PROFILE } from '../data/plans.js';
import { store } from './radar.js';

export function ComunidadView() {
  const container = el('div', { class: 'view', style: { display: 'flex', flexDirection: 'column', gap: '14px' } });

  // Header card
  container.appendChild(el('div', { class: 'card card--high', style: { padding: '16px', position: 'relative', overflow: 'hidden' } },
    el('div', {
      style: {
        position: 'absolute', right: '-32px', top: '-32px', width: '128px', height: '128px',
        borderRadius: '50%', background: 'rgba(64,239,183,0.1)', filter: 'blur(24px)'
      }
    }),
    el('div', { class: 'row', style: { gap: '10px', position: 'relative', zIndex: 1 } },
      el('div', { class: 'icon-circle icon-circle--secondary', style: { width: '40px', height: '40px' } }, icon('verified_user', { size: 22 })),
      el('div', { style: { flex: 1 } },
        el('div', { class: 'row', style: { gap: '6px', flexWrap: 'wrap' } },
          el('strong', { class: 'card-title' }, 'Comunidad & Campus Seguro'),
          el('span', { style: { fontSize: '18px' } }, '🛡️')
        ),
        el('p', { class: 'card-sub' }, 'RadarPlanes es exclusivo para la comunidad universitaria verificada con credenciales oficiales.')
      )
    )
  ));

  // Radar radius
  const radiusLabel = el('strong', {}, '1.0 km');
  const proximityText = el('span', {}, 'Mostrando planes a 1.0 km (~15 min caminando)');
  const ringSizes = ['64px','96px','120px','144px'];
  const radarCard = el('div', { class: 'card' },
    el('div', { class: 'row row--between' },
      el('div', { class: 'row', style: { gap: '6px' } }, icon('explore'), el('strong', {}, 'Radio de Proximidad')),
      el('span', { class: 'pill pill--secondary' }, el('span', { class: 'dot dot--pulse' }), 'Radar Activo')
    ),
    el('div', { class: 'radar-screen' },
      el('div', { class: 'radar-ring radar-ring--a' }),
      el('div', { class: 'radar-ring radar-ring--b' }),
      el('div', { class: 'radar-ring radar-ring--c', id: 'radar-ring-c', style: { width: ringSizes[store.radius], height: ringSizes[store.radius] } }),
      el('div', { class: 'radar-sweep' }),
      el('div', { class: 'radar-pin', style: { top: '16px', left: '20px', color: 'var(--secondary)' } }, '⚽ Cancha 2'),
      el('div', { class: 'radar-pin', style: { bottom: '20px', right: '28px', color: 'var(--tertiary)' } }, '☕ Cafetería'),
      el('div', { class: 'radar-pin', style: { top: '32px', right: '36px', color: 'var(--primary)' } }, '📚 Biblioteca'),
      el('div', { class: 'radar-badge' }, proximityText)
    ),
    el('div', { class: 'radius-grid' },
      ['500m', '1 km', '3 km', '5 km'].map((label, idx) => {
        const subs = ['Pabellones','Campus','Alrededores','Distrito'];
        const descs = ['500 m (~7 min caminando)','1.0 km (~15 min caminando)','3.0 km (~10 min bici)','5.0 km (Distrito)'];
        return el('button', {
          class: store.radius === idx ? 'is-active' : '',
          onClick: () => {
            store.setRadius(idx);
            radiusLabel.textContent = label;
            proximityText.textContent = 'Mostrando planes a ' + descs[idx];
            const ring = document.getElementById('radar-ring-c');
            if (ring) { ring.style.width = ringSizes[idx]; ring.style.height = ringSizes[idx]; }
            for (const sib of ring.parentElement.parentElement.querySelectorAll('.radius-grid button')) sib.classList.remove('is-active');
            const btn = ring.parentElement.parentElement.querySelectorAll('.radius-grid button')[idx];
            btn.classList.add('is-active');
          }
        }, label, el('span', {}, subs[idx]));
      })
    ),
    el('div', { class: 'card card--high', style: { padding: '12px', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } },
      el('div', { class: 'row', style: { gap: '10px' } },
        el('div', { class: 'icon-circle icon-circle--tertiary' }, icon('sports_soccer', { size: 18 })),
        el('div', {},
          el('strong', { style: { fontSize: '14px' } }, 'Alerta exprés de pichangas'),
          el('div', { class: 'muted', style: { fontSize: '11px' } }, 'Avisar cuando haya deportes a < 300m')
        )
      ),
      el('button', {
        class: 'switch' + (store.pichangaAlert ? ' is-on' : ''),
        id: 'pichanga-toggle',
        onClick: () => {
          const on = store.togglePichanga();
          document.getElementById('pichanga-toggle').classList.toggle('is-on', on);
          toast(on ? 'Alertas de pichanga activadas' : 'Alertas pausadas');
        }
      })
    )
  );
  container.appendChild(radarCard);

  // Safety tips
  container.appendChild(el('div', {},
    el('div', { class: 'section-head' },
      el('h2', {}, icon('health_and_safety'), 'Protocolo Safe Student'),
      el('span', { class: 'muted', style: { fontSize: '11px' } }, 'Guía de Campus')
    ),
    el('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 0 8px' } },
      ...SAFETY_TIPS.map(tip => el('div', { class: 'card card--high', style: { flexDirection: 'row', alignItems: 'flex-start', gap: '12px' } },
        el('div', { class: `icon-circle icon-circle--${tip.accent}` }, icon(tip.icon, { size: 22 })),
        el('div', { style: { flex: 1 } },
          el('strong', {}, tip.title),
          el('p', { class: 'card-sub', style: { marginTop: '4px', lineHeight: 1.4 } }, tip.body)
        )
      ))
    )
  ));

  // Profile
  container.appendChild(el('div', { class: 'card card--high', style: { padding: '16px' } },
    el('div', { class: 'row row--between', style: { paddingBottom: '4px' } },
      el('span', { class: 'muted', style: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' } }, 'Identidad Universitaria'),
      el('span', { class: 'pill pill--secondary', style: { fontSize: '10px' } }, icon('format_image_left', { size: 12 }), 'SSO Activo')
    ),
    el('div', { class: 'row', style: { gap: '12px' } },
      el('div', { style: { position: 'relative', flexShrink: 0 } },
        el('div', { class: 'avatar', style: { width: '52px', height: '52px', background: 'var(--primary-container)', color: 'var(--on-primary-container)', marginLeft: 0 } }, 'VH'),
        el('div', {
          style: {
            position: 'absolute', bottom: '-2px', right: '-2px', width: '18px', height: '18px',
            borderRadius: '50%', background: 'var(--secondary)', color: 'var(--on-secondary)',
            display: 'grid', placeItems: 'center'
          }
        }, icon('check', { size: 12 }))
      ),
      el('div', { style: { flex: 1 } },
        el('strong', {}, PROFILE.name),
        el('div', { class: 'muted', style: { fontSize: '12px' } }, `Universidad Central (${PROFILE.email})`),
        el('div', { class: 'pill pill--secondary', style: { marginTop: '4px', fontSize: '10px' } },
          icon('school', { size: 12 }),
          'Estudiante Verificado ✓'
        )
      )
    ),
    el('div', { class: 'row row--between', style: { paddingTop: '12px', borderTop: '1px solid var(--outline-variant)', marginTop: '8px' } },
      el('span', { class: 'row', style: { gap: '4px' } },
        icon('domain', { size: 14 }),
        el('span', { class: 'muted', style: { fontSize: '12px' } }, PROFILE.faculty)
      ),
      el('button', { class: 'btn btn--ghost', style: { padding: '4px 8px', fontSize: '12px' }, onClick: () => toast('Abriendo configuración de cuenta') }, 'Gestionar cuenta')
    )
  ));

  // Footer
  container.appendChild(el('div', { class: 'card card--soft', style: { textAlign: 'center', padding: '16px' } },
    el('div', { class: 'row', style: { gap: '6px', justifyContent: 'center' } },
      el('strong', {}, 'RadarPlanes'),
      el('span', { class: 'pill pill--secondary', style: { fontSize: '10px' } }, 'v1.2 Mobile')
    ),
    el('p', { class: 'muted', style: { fontSize: '12px', maxWidth: '260px', margin: '8px auto 12px' } },
      'Diseñado para la comunidad universitaria · Hecho por estudiantes para estudiantes'
    ),
    el('a', {
      class: 'btn btn--ghost btn--block',
      href: 'https://github.com/ValentinaCham',
      target: '_blank', rel: 'noopener noreferrer',
      onClick: (e) => { e.preventDefault(); toast('Abriendo GitHub @ValentinaCham'); window.open('https://github.com/ValentinaCham', '_blank'); }
    }, icon('code', { size: 16 }), el('span', {}, 'Ver Repositorio en GitHub (Vite + ES6+)')),
    el('div', { class: 'row', style: { gap: '10px', justifyContent: 'center', marginTop: '10px', fontSize: '11px' } },
      el('span', { class: 'row', style: { gap: '4px' } }, icon('lock', { size: 14 }), el('span', { class: 'muted' }, 'Cifrado e2e')),
      el('span', { class: 'muted' }, '•'),
      el('span', { class: 'row', style: { gap: '4px' } }, icon('policy', { size: 14 }), el('span', { class: 'muted' }, 'Normas de convivencia'))
    )
  ));

  return container;
}