import { useEffect, useState, useRef } from 'react';
import { getFlowers, getSupplies, getOrders, createOrder, getOrderById } from '../api.js';
import { showToast } from '../toast.js';
import ErrorCard from '../components/ErrorCard.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';

function OrdersPage() {
  const [flowers, setFlowers] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedFlowers, setSelectedFlowers] = useState([]);
  const [selectedSupplies, setSelectedSupplies] = useState([]);
  const [orderName, setOrderName] = useState('');
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const orderNameRef = useRef();
  

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [f, s, o] = await Promise.all([getFlowers(), getSupplies(), getOrders()]);
      setFlowers(f || []);
      setSupplies(s || []);
      setOrders(o || []);
    } catch (e) {
      setError(e.message || String(e));
    }
  }

  function addFlowerRow() {
    setSelectedFlowers((s) => [...s, { id: null, name: '', qty: 1 }]);
  }

  function addSupplyRow() {
    setSelectedSupplies((s) => [...s, { id: null, name: '', qty: 1 }]);
  }

  function updateFlower(index, patch) {
    setSelectedFlowers((s) => s.map((r, i) => i === index ? { ...r, ...patch } : r));
  }

  function updateSupply(index, patch) {
    setSelectedSupplies((s) => s.map((r, i) => i === index ? { ...r, ...patch } : r));
  }

  function removeFlower(index) {
    setSelectedFlowers((s) => s.filter((_, i) => i !== index));
  }

  function removeSupply(index) {
    setSelectedSupplies((s) => s.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    setError(null);
    // basic validation
    if (selectedFlowers.length === 0 && selectedSupplies.length === 0) {
      setError('Please select at least one flower or one supply.');
      return;
    }

    // use browser native validity UI for order name
    if (orderNameRef.current && !orderNameRef.current.reportValidity()) return;

    // validate quantities against inStock
    for (const f of selectedFlowers) {
      if (!f.id) { setError('A flower is not selected.'); return; }
      const info = flowersWithStock.find(x => x.id === Number(f.id));
      if (!info) { setError('Flower not found.'); return; }
      if (Number(f.qty) > info.inStock) { setError(`Quantity for flower "${info.name}" exceeds in stock (${info.inStock}).`); return; }
    }
    for (const s of selectedSupplies) {
      if (!s.id) { setError('A supply is not selected.'); return; }
      const info = suppliesWithStock.find(x => x.id === Number(s.id));
      if (!info) { setError('Supply not found.'); return; }
      if (Number(s.qty) > info.inStock) { setError(`Quantity for supply "${info.name}" exceeds in stock (${info.inStock}).`); return; }
    }

    setConfirmOpen(true);
  }

  async function doCreate() {
    setConfirmOpen(false);
    setError(null);
    try {
      const payload = {
        orderName: orderName || undefined,
        flowers: selectedFlowers.map(f => ({ id: Number(f.id), qty: Number(f.qty) })),
        supplies: selectedSupplies.map(s => ({ id: Number(s.id), qty: Number(s.qty) }))
      };

      const created = await createOrder(payload);
      showToast('Order created', 'success');
      // refresh flowers/supplies and orders list from server
      await loadAll();
      // fetch created order details and merge into current orders list without duplicating
      const details = await getOrderById(created.id);
      setOrders((current) => {
        const exists = current.some(x => x.id === details.id);
        if (exists) {
          return current.map(x => x.id === details.id ? details : x);
        }
        return [details, ...current];
      });
      // reset form
      setSelectedFlowers([]);
      setSelectedSupplies([]);
      setOrderName('');
    } catch (e) {
      setError(e.message || String(e));
      showToast(e.message || 'Create order failed', 'error');
    }
  }

  // compute totals for preview
  const flowerTotal = selectedFlowers.reduce((acc, it) => {
    const info = flowers.find(f => f.id === Number(it.id));
    if (!info) return acc;
    return acc + (Number(info.price) * Number(it.qty || 0));
  }, 0);

  const supplyTotal = selectedSupplies.reduce((acc, it) => {
    const info = supplies.find(s => s.id === Number(it.id));
    if (!info) return acc;
    return acc + (Number(info.price) * Number(it.qty || 0));
  }, 0);

  const bouquetPrice = Math.round((flowerTotal * 3 * 1.3 + supplyTotal * 2) * 100) / 100;

  const hasSelectedFlower = selectedFlowers.some(f => Number(f.id) > 0);
  const hasSelectedSupply = selectedSupplies.some(s => Number(s.id) > 0);
  const canSubmit = (hasSelectedFlower || hasSelectedSupply) && !error;

  // compute frontend-only inStock values (FE-only; server still authoritative)
  const flowersWithStock = flowers.map(f => ({
    ...f,
    inStock: Math.max(0, Number(f.availableCount ?? 0) - Number(f.soldCount ?? 0))
  }));
  const suppliesWithStock = supplies.map(s => ({
    ...s,
    inStock: Math.max(0, Number(s.count ?? 0) - Number(s.soldCount ?? 0))
  }));

  const availableFlowerTypes = flowersWithStock.filter(f => f.inStock > 0).length;
  const availableSupplyTypes = suppliesWithStock.filter(s => s.inStock > 0).length;
  const canAddFlower = selectedFlowers.length < availableFlowerTypes;
  const canAddSupply = selectedSupplies.length < availableSupplyTypes;

  function formatDateNoSeconds(value) {
    if (!value) return '';
    const d = new Date(value);
    return d.toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  // Searchable dropdown component
  function SearchableDropdown({ items, selectedId, selectedName, onSelect, placeholder, excludeIds = [] }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const ref = useRef();

    useEffect(() => {
      function onDoc(e) {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      }
      document.addEventListener('click', onDoc);
      return () => document.removeEventListener('click', onDoc);
    }, []);

    const filtered = items
      .filter(it => it.name.toLowerCase().includes(query.toLowerCase()))
      .filter(it => (it.id === Number(selectedId)) || !excludeIds.includes(it.id));

    return (
      <div className="search-dropdown" ref={ref} style={{ position: 'relative' }}>
        <div className="search-trigger" onClick={() => { setOpen((v) => !v); setQuery(''); }}>
          {selectedName || placeholder || '-- choose --'}
          <span className="caret">▾</span>
        </div>
        {open && (
          <div className="search-panel">
            <input className="search-input" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
            <div className="search-list">
              {filtered.map(it => (
                <div key={it.id} className="search-option" onClick={() => { onSelect(it); setOpen(false); }}>
                  <div className="opt-name">{it.name}</div>
                  <div className="opt-price">${Number(it.price).toFixed(2)}</div>
                </div>
              ))}
              {filtered.length === 0 && <div className="search-empty">No results</div>}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="content-panel">
      <div className="panel-header">
        <h2>Orders</h2>
      </div>

      <div className="panel-body">
        {error && <ErrorCard message={error} onClose={() => setError(null)} />}

        <div className="order-form">
          <div className="form-row">
            <label>Order name</label>
            <input ref={orderNameRef} required className="order-input order-name" value={orderName} onChange={e => setOrderName(e.target.value)} />
          </div>

          <div className="section">
            <h4>Flowers</h4>
            <div className="order-controls">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {canAddFlower ? (
                  <button className="primary-button" onClick={addFlowerRow}>Add Flower</button>
                ) : (
                  <div className="muted">All available flowers added</div>
                )}
              </div>
            </div>
            <table className="grid-table data-table">
              <thead>
                <tr><th>Flower</th><th>In stock</th><th>Qty</th><th>Subtotal</th><th></th></tr>
              </thead>
              <tbody>
                {selectedFlowers.map((r, idx) => (
                  <tr key={idx}>
                    <td>
                      <SearchableDropdown
                        items={flowersWithStock}
                        selectedId={r.id}
                        selectedName={r.name}
                        excludeIds={selectedFlowers.map(x => Number(x.id)).filter(Boolean)}
                        onSelect={(it) => updateFlower(idx, { id: it.id, name: it.name, qty: it.inStock > 0 ? 1 : 0 })}
                        placeholder="-- choose --"
                      />
                    </td>
                    <td>{r.id ? (flowersWithStock.find(x => x.id === Number(r.id))?.inStock ?? '-') : '-'}</td>
                    <td>
                      <input
                        className="qty-input"
                        type="number"
                        min="1"
                        value={r.qty}
                        onChange={e => {
                          const raw = Number(e.target.value || 0);
                          const info = flowersWithStock.find(f => f.id === Number(r.id) || f.name === r.name);
                          const max = info ? (info.inStock ?? Infinity) : Infinity;
                          const clamped = Math.max(1, Math.min(raw, max));
                          updateFlower(idx, { qty: clamped });
                        }}
                        disabled={(() => { const info = flowersWithStock.find(f => f.id === Number(r.id) || f.name === r.name); return info && info.inStock < 1; })()}
                        max={r.id ? (flowersWithStock.find(f => f.id === Number(r.id))?.inStock ?? undefined) : undefined}
                      />
                    </td>
                    <td className="muted">${(() => {
                      const info = flowers.find(f => f.id === Number(r.id) || f.name === r.name);
                      return info ? (Number(info.price) * Number(r.qty || 0)).toFixed(2) : '0.00';
                    })()}</td>
                    <td><button className="secondary-button" onClick={() => removeFlower(idx)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="section">
            <h4>Supplies</h4>
            <div className="order-controls">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {canAddSupply ? (
                  <button className="primary-button" onClick={addSupplyRow}>Add Supply</button>
                ) : (
                  <div className="muted">All available supplies added</div>
                )}
              </div>
            </div>
            <table className="grid-table data-table">
              <thead>
                <tr><th>Supply</th><th>In stock</th><th>Qty</th><th>Subtotal</th><th></th></tr>
              </thead>
              <tbody>
                {selectedSupplies.map((r, idx) => (
                  <tr key={idx}>
                    <td>
                      <SearchableDropdown
                        items={suppliesWithStock}
                        selectedId={r.id}
                        selectedName={r.name}
                        excludeIds={selectedSupplies.map(x => Number(x.id)).filter(Boolean)}
                        onSelect={(it) => updateSupply(idx, { id: it.id, name: it.name, qty: it.inStock > 0 ? 1 : 0 })}
                        placeholder="-- choose --"
                      />
                    </td>
                    <td>{r.id ? (suppliesWithStock.find(x => x.id === Number(r.id))?.inStock ?? '-') : '-'}</td>
                    <td>
                      <input
                        className="qty-input"
                        type="number"
                        min="1"
                        value={r.qty}
                        onChange={e => {
                          const raw = Number(e.target.value || 0);
                          const info = suppliesWithStock.find(s => s.id === Number(r.id) || s.name === r.name);
                          const max = info ? (info.inStock ?? Infinity) : Infinity;
                          const clamped = Math.max(1, Math.min(raw, max));
                          updateSupply(idx, { qty: clamped });
                        }}
                        disabled={(() => { const info = suppliesWithStock.find(s => s.id === Number(r.id) || s.name === r.name); return info && info.inStock < 1; })()}
                        max={r.id ? (suppliesWithStock.find(s => s.id === Number(r.id))?.inStock ?? undefined) : undefined}
                      />
                    </td>
                    <td className="muted">${(() => {
                      const info = supplies.find(s => s.id === Number(r.id) || s.name === r.name);
                      return info ? (Number(info.price) * Number(r.qty || 0)).toFixed(2) : '0.00';
                    })()}</td>
                    <td><button className="secondary-button" onClick={() => removeSupply(idx)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>Preview:</strong> Flower total ${flowerTotal.toFixed(2)} — Supply total ${supplyTotal.toFixed(2)} — <strong>Bouquet</strong> ${bouquetPrice.toFixed(2)}
            </div>
            <button className="primary-button" onClick={handleSubmit} disabled={!canSubmit}>Create Order</button>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <h3>Orders</h3>
          <table className="grid-table">
            <thead>
              <tr><th>Name</th><th>Price</th><th>Date</th><th>Details</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.orderName}</td>
                  <td>${Number(o.orderPrice).toFixed(2)}</td>
                  
                  <td>{formatDateNoSeconds(o.orderDate)}</td>
                  <td>
                    {o.flowers && o.flowers.length > 0 && (
                      <div>
                        <strong>Flowers:</strong>
                        <ul>
                          {o.flowers.map(f => <li key={f.id}>{f.itemName} x {f.qty}</li>)}
                        </ul>
                      </div>
                    )}
                    {o.supplies && o.supplies.length > 0 && (
                      <div>
                        <strong>Supplies:</strong>
                        <ul>
                          {o.supplies.map(s => <li key={s.id}>{s.itemName} x {s.qty}</li>)}
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ConfirmModal open={confirmOpen} title="Confirm create order" message="Are you sure you want to create this order?" onConfirm={doCreate} onCancel={() => setConfirmOpen(false)} />
      </div>
    </section>
  );
}

export default OrdersPage;
