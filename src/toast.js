const _emitter = new EventTarget();

export function showToast(message, variant = 'info', timeout = 4000) {
  const detail = { id: Date.now() + Math.random(), message, variant, timeout };
  const event = new CustomEvent('toast', { detail });
  _emitter.dispatchEvent(event);
}

export function onToast(fn) {
  const handler = (e) => fn(e.detail);
  _emitter.addEventListener('toast', handler);
  return () => _emitter.removeEventListener('toast', handler);
}
