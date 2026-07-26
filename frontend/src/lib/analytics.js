const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// Fire-and-forget: never blocks or interrupts the UI if this fails
// (offline, backend down, ad blocker, etc.) — it's just interaction logging.
export function logClick(button) {
  fetch(`${API_BASE}/api/analytics/click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ button }),
  }).catch(() => {});
}
