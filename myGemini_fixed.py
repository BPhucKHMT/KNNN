import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv

myAPIKey = "AIzaSyAIn6B1I4U37iJ_YFJR3EWc-bkGUk__xuk"
# API key Gemini
os.environ["GOOGLE_API_KEY"] = myAPIKey
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

from typing import List

class Tool(BaseModel):
    name: str = Field(..., description="Tên công cụ")
    category: str = Field(default="General", description="Danh mục công cụ (VD: Design, Development, Project Management)")
    description: str = Field(default="", description="Mô tả ngắn gọn về công cụ")
    url: str = Field(default="", description="URL chính thức của công cụ")
    quick_guide: str = Field(default="Hướng dẫn đang được cập nhật", description="Hướng dẫn bắt đầu nhanh (các bước cụ thể)")
    setup_time: str = Field(default="Chưa xác định", description="Thời gian thiết lập dự kiến")
    difficulty_level: str = Field(default="Beginner", description="Mức độ khó: Beginner/Intermediate/Advanced")
    advantages: List[str] = Field(default_factory=lambda: ["Đang cập nhật"], description="Các ưu điểm chính")
    disadvantages: List[str] = Field(default_factory=lambda: ["Đang cập nhật"], description="Các nhược điểm cần lưu ý")
    pricing: str = Field(default="Chưa xác định", description="Thông tin về giá: gói miễn phí, gói trả phí, đánh giá value")
    best_for: str = Field(default="Người dùng chung", description="Phù hợp nhất cho ai/trường hợp nào")
    alternatives: List[str] = Field(default_factory=lambda: [], description="Các công cụ thay thế tương tự")

class ToolInfo(BaseModel):
    recommended_tools: List[Tool] = Field(..., description="Danh sách 2-4 công cụ được đề xuất")
    comparison: str = Field(default="Đang so sánh các công cụ...", description="So sánh chi tiết các công cụ về độ dễ dùng, tính năng, giá cả")
    final_recommendation: str = Field(default="Đang phân tích để đưa ra khuyến nghị...", description="Lời khuyên cuối cùng và lý do chọn")
    next_steps: List[str] = Field(default_factory=lambda: ["Bước 1", "Bước 2", "Bước 3"], description="Các bước tiếp theo nên thực hiện")


class myGemini:
    def __init__(self, model="gemini-2.5-flash", temperature=0.3, max_tokens=4000):
        self.model = ChatGoogleGenerativeAI(
            model=model,
            temperature=temperature,
            max_output_tokens=max_tokens,
            timeout=None,
            max_retries=2,
        ).with_structured_output(ToolInfo, method="json_mode")
        
        self.messages = [
            SystemMessage(content="""
Bạn là một trợ lý AI chuyên tư vấn công cụ số cho học tập và công việc.
                          
Nhiệm vụ:
Đề xuất các công cụ số phù hợp với mục đích sử dụng của người dùng.

QUAN TRỌNG: Bạn PHẢI trả về JSON đúng theo cấu trúc ToolInfo với các trường:
- recommended_tools: Danh sách 2-4 công cụ (mỗi tool phải có đủ tất cả trường)
- comparison: So sánh các công cụ 
- final_recommendation: Lời khuyên cuối cùng
- next_steps: Các bước tiếp theo

Với mỗi công cụ trong recommended_tools, PHẢI có đủ các trường:
- name: Tên công cụ
- category: Danh mục
- description: Mô tả ngắn gọn  
- url: URL chính thức
- quick_guide: Hướng dẫn chi tiết từng bước
- setup_time: Thời gian thiết lập
- difficulty_level: Beginner/Intermediate/Advanced
- advantages: Mảng các ưu điểm
- disadvantages: Mảng các nhược điểm  
- pricing: Thông tin giá cả
- best_for: Phù hợp cho ai
- alternatives: Mảng công cụ thay thế

Ưu tiên công cụ phù hợp với sinh viên Việt Nam.
"""),
            HumanMessage(content="Tôi sẽ đưa ra mục đích sử dụng của tôi bạn hãy trả lời nhé"),
            AIMessage(content="Được thôi, bạn hãy đưa ra câu hỏi."),
        ]

    def textSearch(self, query):
        self.messages.append(HumanMessage(content=query))
        try:
            response = self.model.invoke(self.messages)
            # Với structured output, response đã là ToolInfo object
            self.messages.append(AIMessage(content=f"Đề xuất {len(response.recommended_tools)} công cụ phù hợp"))
            return response
        except Exception as e:
            error_msg = f"Lỗi: {str(e)}"
            self.messages.append(AIMessage(content=error_msg))
            # Trả về ToolInfo mặc định
            return ToolInfo(
                recommended_tools=[Tool(name="Lỗi xử lý", description=str(e)[:100])],
                comparison="Có lỗi xảy ra trong quá trình xử lý",
                final_recommendation="Vui lòng thử lại với câu hỏi khác",
                next_steps=["Thử lại câu hỏi", "Kiểm tra kết nối"]
            )


def handle_query(query):
    MyGemini = myGemini()
    return MyGemini.textSearch(query)