import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from typing import List
import json
import re

# API key Gemini
myAPIKey = "AIzaSyAIn6B1I4U37iJ_YFJR3EWc-bkGUk__xuk"
os.environ["GOOGLE_API_KEY"] = myAPIKey

# JSON Schema cho structured output
json_schema = {
  "title": "ToolInfoSchema",  # ✅ phải có title hợp lệ (a-z, A-Z, 0-9, _, -, ., :)
  "type": "object",
  "properties": {
    "recommended_tools": {
      "type": "array",
      "description": "Danh sách công cụ đề xuất",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "description": "Tên công cụ" },
          "category": { "type": "string", "description": "Danh mục công cụ" },
          "description": { "type": "string", "description": "Mô tả ngắn gọn về công cụ" },
          "url": { "type": "string", "description": "URL chính thức của công cụ" },
          "quick_guide": {
            "type": "array",
            "description": "Hướng dẫn sử dụng nhanh",
            "items": { "type": "string" }
          },
          "setup_time": { "type": "string", "description": "Thời gian thiết lập" },
          "difficulty_level": { "type": "string", "description": "Mức độ khó" },
          "advantages": {
            "type": "array",
            "description": "Ưu điểm",
            "items": { "type": "string" }
          },
          "disadvantages": {
            "type": "array",
            "description": "Nhược điểm",
            "items": { "type": "string" }
          },
          "pricing": { "type": "string", "description": "Thông tin giá cả" },
          "best_for": { "type": "string", "description": "Phù hợp cho ai" }
        },
        "required": [
          "name", "category", "description", "url", "quick_guide",
          "setup_time", "difficulty_level", "advantages", "disadvantages",
          "pricing", "best_for"
        ]
      }
    },
    "comparison": {
      "type": "array",
      "description": "So sánh các công cụ",
      "items": { "type": "string" }
    },
    "final_recommendation": {
         "type": "array",
        "description": "Lời khuyên cuối cùng",
        "items": { "type": "string" }
    },
    "next_steps": {
      "type": "array",
      "description": "Các bước tiếp theo",
      "items": { "type": "string" }
    }
  },
  "required": ["recommended_tools", "comparison", "final_recommendation", "next_steps"]
}

class TechConsultant:
    def __init__(self, model="gemini-2.5-flash", temperature=0):
        # Sử dụng json_schema với structured output
        self.model = ChatGoogleGenerativeAI(
            model=model,
            temperature=temperature,
            max_output_tokens=None,
            timeout=None,
            max_retries=3,
        ).with_structured_output(json_schema, method="json_schema")
        
        # System message chi tiết
        system_message = SystemMessage(content="""
Bạn là chuyên gia tư vấn công cụ công nghệ với kinh nghiệm 10+ năm.

NHIỆM VỤ:
- Phân tích nhu cầu của người dùng
- Đề xuất 2-4 công cụ phù hợp nhất  
- So sánh chi tiết ưu/nhược điểm
- Đưa ra lời khuyên cụ thể 
-Các bước tiếp theo chỉ cần liệt kê (không cần các tiêu đề hãy gì hết)
-Ở comparison mỗi công cụ phải là một mục riêng biệt không được gộp lại so sánh chung
-Không cần phải đánh dấu ** ** cho các tiêu đề
- Cung cấp hướng dẫn bước đầu

LĨNH VỰC CHUYÊN MÔN:
- Web Development (Frontend, Backend, Full-stack)
- Mobile Development (iOS, Android, Cross-platform)  
- Design & UI/UX (Figma, Adobe, Canva...)
- Project Management (Trello, Notion, Asana...)
- Marketing & Business (Analytics, Social Media...)
- Data Analysis & AI Tools
- DevOps & Cloud Services

NGUYÊN TẮC TƯ VẤN:
1. Ưu tiên công cụ miễn phí hoặc freemium
2. Phù hợp với trình độ người dùng (beginner/intermediate/advanced)
3. Có cộng đồng hỗ trợ tốt
4. Dễ học và triển khai nhanh
5. Phổ biến tại Việt Nam

BẮT BUỘC: Luôn trả về JSON hợp lệ theo schema sau, không thiếu bất kỳ field nào.
Nếu không chắc giá trị, hãy trả về chuỗi `"Unknown"` hoặc mảng rỗng `[]`, KHÔNG được bỏ qua field.


Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp.
""")
        
        self.messages = [
            system_message,
            HumanMessage(content="Chào anh/chị! Em cần tư vấn công cụ công nghệ phù hợp."),
            AIMessage(content="Xin chào! Tôi rất vui được hỗ trợ bạn tìm kiếm công cụ công nghệ phù hợp. Hãy chia sẻ với tôi về dự án, mục tiêu và yêu cầu cụ thể nhé!")
        ]

    def ask(self, question):
        """Đặt câu hỏi tư vấn công cụ công nghệ"""
        # Làm giàu câu hỏi với context
        enhanced_question = f"""
Câu hỏi: {question}

Vui lòng phân tích và đề xuất công cụ phù hợp. Nếu thông tin chưa đủ, hãy hỏi thêm về:
- Loại dự án/công việc cụ thể
- Ngân sách dự kiến  
- Trình độ kỹ thuật hiện tại
- Quy mô team/dự án
- Timeline thực hiện
"""
        
        self.messages.append(HumanMessage(content=enhanced_question))
        
        try:
            # Gọi AI với structured output
            response = self.model.invoke(self.messages)
            print("response là", response)
            # Validate và clean response
            validated_response = self._validate_response(response)
            print("Validated response:", type(validated_response))
            # Lưu conversation history
            summary = f"Đã tư vấn {len(validated_response['recommended_tools'])} công cụ cho: {question[:50]}..."
            self.messages.append(AIMessage(content=summary))
            
            return validated_response
            
        except Exception as e:
            print(f"🔴 Error: {str(e)}")
            
            # Fallback response
            fallback_response = {
                            "recommended_tools": [{
                                "name": "Lỗi hệ thống",
                                "category": "Error",
                                "description": f"Đã xảy ra lỗi: {str(e)[:100]}...",
                                "url": "",
                                "quick_guide": [],
                                "setup_time": "Unknown",
                                "difficulty_level": "Unknown",
                                "advantages": [],
                                "disadvantages": [],
                                "pricing": "Unknown",
                                "best_for": "Unknown"
                            }],
                            "comparison": [],
                            "final_recommendation": ["Vui lòng thử lại hoặc đặt câu hỏi khác."],
                            "next_steps": ["Kiểm tra kết nối mạng", "Thử lại sau 5 phút", "Liên hệ hỗ trợ nếu lỗi tiếp tục"]
                        }

            
            self.messages.append(AIMessage(content=f"Đã xảy ra lỗi: {str(e)[:50]}..."))
            return fallback_response

    def _validate_response(self, response):
        """Validate và làm sạch response từ AI"""
        try:
            # Nếu response là dict (chuẩn structured output)
            if isinstance(response, dict):
                return response
            else:
                return response.dict()  # Chuyển sang dict nếu là pydantic model
        except Exception as e:
            print(f"🟡 Validation error: {e}")
            return {
                "recommended_tools": [{
                    "name": "Lỗi validation",
                    "category": "Error",
                    "description": str(e)[:100],
                    "url": "",
                    "quick_guide": [],
                    "setup_time": "Unknown",
                    "difficulty_level": "Unknown",
                    "advantages": [],
                    "disadvantages": [],
                    "pricing": "Unknown",
                    "best_for": "Unknown"
                }],
                "comparison": [],
                "final_recommendation": "Vui lòng thử lại với câu hỏi khác",
                "next_steps": ["Kiểm tra input", "Thử lại", "Liên hệ hỗ trợ"]
            }

    def reset_conversation(self):
        """Reset cuộc trò chuyện"""
        system_msg = self.messages[0]
        self.messages = [
            system_msg,
            HumanMessage(content="Chào anh/chị! Em cần tư vấn công cụ công nghệ phù hợp."),
            AIMessage(content="Xin chào! Tôi rất vui được hỗ trợ bạn tìm kiếm công cụ công nghệ phù hợp. Hãy chia sẻ với tôi về dự án, mục tiêu và yêu cầu cụ thể nhé!")
        ]

    def get_conversation_summary(self):
        """Lấy tóm tắt cuộc trò chuyện"""
        human_msgs = [msg for msg in self.messages if isinstance(msg, HumanMessage)]
        return f"Đã có {len(human_msgs)} câu hỏi trong cuộc trò chuyện này"

# Global instance để duy trì conversation
_tech_consultant = None

def get_consultant():
    """Lấy hoặc tạo consultant instance"""
    global _tech_consultant
    if _tech_consultant is None:
        _tech_consultant = TechConsultant()
    return _tech_consultant

def ask_for_tools(question):
    """Interface đơn giản để hỏi về công cụ công nghệ"""
    consultant = get_consultant()
    return consultant.ask(question)

def reset_consultation():
    """Reset cuộc tư vấn"""
    global _tech_consultant
    if _tech_consultant:
        _tech_consultant.reset_conversation()
        return "✅ Đã reset cuộc tư vấn!"
    return "⚠️ Chưa có cuộc tư vấn nào để reset"

def get_consultation_summary():
    """Lấy tóm tắt cuộc tư vấn"""
    consultant = get_consultant()
    return consultant.get_conversation_summary()

# Sample questions for testing
SAMPLE_QUESTIONS = {
    "web_dev": "Tôi muốn tạo website bán hàng online, budget 2-3 triệu",
    "mobile_app": "Cần phát triển app mobile cho startup, có kinh nghiệm React",
    "design": "Tôi là học sinh cần công cụ thiết kế poster và logo miễn phí",
    "project_mgmt": "Team 5 người cần quản lý dự án phần mềm hiệu quả",
    "data_analysis": "Phân tích dữ liệu bán hàng cho shop online nhỏ"
}


        
  
def handle_query(query):
    """Hàm tiện lợi để xử lý query và trả về dict"""
    try:
        result = ask_for_tools(query)
        return result
    except Exception as e:
        return {"error": str(e)}
    
'''    # Nếu response là string JSON
            if isinstance(response, str):
                return json.loads(response)

            # Nếu không hợp lệ
            return {
                "recommended_tools": [],
                "comparison": [],
                "final_recommendation": "Phản hồi không hợp lệ",
                "next_steps": ["Thử lại câu hỏi"]
            }
            '''