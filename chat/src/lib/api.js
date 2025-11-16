// Hàm gọi API backend với hỗ trợ abort
export async function askTools(query, signal) {
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const url = `${base}/query?q=${encodeURIComponent(query)}`;

  const res = await fetch(url, { 
    method: 'GET',
    signal // Thêm signal để có thể abort request
  });
   
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || 'Unknown error'}`);
  }
  // Kết quả backend trả dạng JSON theo schema myChat.py
  return res.json();
}