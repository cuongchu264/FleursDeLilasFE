import { useEffect, useState } from 'react';
import { onToast } from '../toast.js';

function Toast({ t, onClose }) {
  return (
    <div className={`toast ${t.variant} ${t.visible ? 'enter' : 'exit'}`}>
      <div className="toast-message">{t.message}</div>
      <button className="toast-close" onClick={() => onClose(t.id)}>×</button>
    </div>
  );
}

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsub = onToast((t) => {
      const meta = { ...t, visible: false };
      setToasts((s) => [...s, meta]);

      // allow browser to render then trigger enter animation
      requestAnimationFrame(() => {
        setToasts((s) => s.map(x => x.id === t.id ? { ...x, visible: true } : x));
      });

      if (t.timeout && t.timeout > 0) {
        setTimeout(() => {
          // start exit animation, then remove
          setToasts((s) => s.map(x => x.id === t.id ? { ...x, visible: false } : x));
          setTimeout(() => {
            setToasts((s) => s.filter(x => x.id !== t.id));
          }, 300);
        }, t.timeout);
      }
    });

    return unsub;
  }, []);

  useEffect(() => {}, [toasts]);

  function remove(id) {
    // trigger exit animation then remove
    setToasts((s) => s.map(x => x.id === id ? { ...x, visible: false } : x));
    setTimeout(() => {
      setToasts((s) => s.filter(x => x.id !== id));
    }, 300);
  }

  return (
    <div className="toast-root">
      {toasts.map((t) => (
        <Toast key={t.id} t={t} onClose={remove} />
      ))}
    </div>
  );
}

export default ToastContainer;
