// Hàm gọi API backend
export async function askTools(query) {
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const url = `${base}/query?q=${encodeURIComponent(query)}`;

  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || 'Unknown error'}`);
  }
  // Kết quả backend trả dạng JSON theo schema myChat.py (recommended_tools, comparison, final_recommendation, next_steps)
  return res.json();
}
