export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'html') node.innerHTML = value;
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'dataset' && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) node.dataset[k] = v;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(node.style, value);
    } else if (key in node && typeof node[key] !== 'object') {
      try { node[key] = value; } catch { node.setAttribute(key, value); }
    } else {
      node.setAttribute(key, value);
    }
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function icon(name, opts = {}) {
  const span = el('span', {
    class: 'material-symbols-outlined',
    style: { fontSize: opts.size ? `${opts.size}px` : '20px' }
  });
  span.textContent = name;
  return span;
}

let toastTimer = null;
export function toast(text, duration = 2200) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = el('div', { class: 'toast' });
    t.appendChild(icon('check_circle'));
    t.appendChild(el('span', { class: 'toast__text' }));
    document.body.appendChild(t);
  }
  t.querySelector('.toast__text').textContent = text;
  t.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-show'), duration);
}

export function categoryEmoji(id) {
  const map = { sport: '⚽', board: '🎲', party: '🎉', study: '📚', all: '🔥' };
  return map[id] ?? '✨';
}

export function categoryLabel(id) {
  const map = {
    sport: 'Pichanga',
    board: 'Cartas & Mesa',
    party: 'Fiesta & Previa',
    study: 'Estudio'
  };
  return map[id] ?? 'Plan';
}

export function progressFillClass(category) {
  return {
    sport: '',
    board: 'progress__fill--tertiary',
    party: 'progress__fill--secondary-fixed',
    study: 'progress__fill--primary'
  }[category] ?? '';
}

export function fmtDistance(m) {
  return m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`;
}

export function fmtPercent(att, cap) {
  return Math.round((att / cap) * 100);
}

export function uid() {
  return 'p-' + Math.random().toString(36).slice(2, 9);
}