import React, { useState, useEffect } from "react";
import { Maximize2, X } from "lucide-react";
import "./ChatSuggesterApp.css";
import { getSuggestions } from '../services/suggest';
export default function ChatSuggesterApp() {
  const [selectedSuggestion, setSelectedSuggestion] = useState(null); // lấy các thông tin chi tiết của 1 công cụ
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false); // load page
  const [suggestions, setSuggestions] = useState([]); // lấy các gợi ý công cụ để cho chức năng card
  const [comparison, setComparison] = useState([]); // so sánh các công cụ
  const [final_recommendation, setFinal_recommendation] = useState([]); // công cụ được đề xuất cuối cùng
  const [nextSteps, setNextSteps] = useState([]); // các bước tiếp theo để triển khai công cụ
  const [listName, setListName] = useState([]); // danh sách tên công cụ để so sánh

  const handleSend = async () => {
    const query = document.querySelector('textarea').value;
    if (!query) return;
    setLoading(true);
    const response = await getSuggestions(query);
    setSuggestions(response.recommended_tools || []);
    setComparison(response.comparison || []);
    setFinal_recommendation(response.final_recommendation || '');
    setNextSteps(response.next_steps || []);
    console.log("response from backend:", response);
    setLoading(false);
   
  };

  
  useEffect(() => {
    // Cập nhật danh sách tên công cụ khi suggestions thay đổi
    const names = suggestions.map(s => s.name);
    setListName(names);
  }, [suggestions]);




  return (
    <div className="app">
      {/* Chat box */}
      <div className="chat-box">
        <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ví dụ: Tôi cần công cụ ..." rows={3} />
        <div className="actions">
          <button className="btn clear">Xóa</button>
          <button className="btn send" onClick={() => handleSend()}>Gửi</button>
        </div>
      </div>

      {/* Suggestion cards */}
      <div className="suggestions">
        {!loading && suggestions && suggestions.map((s, i) => (
          <div key={`map${i}`} className="Card">
            <button
              className="expand"
              onClick={() => setSelectedSuggestion(s)}
            >
              <Maximize2 size={16} />
            </button>
            <br />
          
            <h3 className="card-title">{s.name}</h3>
            <a href={s.url} target="_blank">Website</a>
            <p><b>Mô tả:</b> {s.description}</p>
            <p><b>Phù hợp cho:</b> {s.best_for}</p>
            <p><b>Độ khó:</b> {s.difficulty_level}</p>
            <p><b>Giá:</b> {s.pricing}</p>
            <p><b>Thời gian thiết lập: {s.setup_time}</b></p>

          </div>
        ))}
      </div>

      <div className= "comparison mt-4 p-0 ">
       
        {!loading && comparison && comparison.length > 0 && (
          <>
             {console.log("comparison", comparison)}
            <h2>So sánh các công cụ</h2>
            <table className="table table-bordered">
              <thead>
                <tr>
                 <th>Tên</th>
                 <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {listName.map((name, index) => (
                  <tr key={`comparison-${index}`}>
                    <td>{name}</td>
                    <td>{comparison[index]}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}><b>Lời khuyên:</b> {
                    !loading && final_recommendation && final_recommendation.length > 0 ? (
                      <ul>
                        {final_recommendation.map((rec, index) => (
                          <li key={`final-rec-${index}`}>{rec}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>Không có lời khuyên nào.</p>
                    )
                  }
                  </td>
                </tr>
              </tfoot>
            </table>
          </>
        )}
        </div>
        <div className="next-steps mt-4 card p-0">
        {!loading && nextSteps && nextSteps.length > 0 && (
          <>
            <h2 className="text-center">Các bước tiếp theo</h2>
            <ul className="">
              {nextSteps.map((step, index) => (
                <li key={`next-step-${index}`}>{step}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Loading page */}
      {loading && <p>Đang tải gợi ý...</p>}


      {/* Modal khi mở card lên*/}
      {selectedSuggestion && (
        <div className="modal-overlay" onClick={() => setSelectedSuggestion(null)}>
          {console.log("selectedSuggestion", selectedSuggestion)}
          <div className="Modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close"
              onClick={() => setSelectedSuggestion(null)}
            >
              <X size={18} />
            </button>
            <div className="contentTool">
              <h2>{selectedSuggestion.name}</h2>
              <p><b>Mô tả:</b> {selectedSuggestion.description}</p>
              <p><a href="#">Video hướng dẫn</a></p>
              <p><b>Hướng dẫn nhanh:</b></p>
              <ul>
                <li>Truy cập vào website: <a href={selectedSuggestion.url} target="_blank">{selectedSuggestion.url}</a></li>
                {selectedSuggestion.quick_guide.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
              <p><b>Ưu điểm: </b></p>
              <ul>
                {selectedSuggestion.advantages.map((pro, index) => (
                  <li key={index}>{pro}</li>
                ))}
              </ul>

              <p><b>Nhược điểm: </b></p>
              <ul>
                {selectedSuggestion.disadvantages.map((con, index) => (
                  <li key={index}>{con}</li>
                ))}
              </ul>
              <a href={selectedSuggestion.url}>Mở công cụ</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
