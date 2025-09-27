#!/usr/bin/env python3
# Quick test for myChat

print("Testing myChat...")

try:
    from myChat import handle_query
    result = handle_query("Tôi cần công cụ thiết kế logo")
    
    if hasattr(result, 'recommended_tools'):
        print(f"✅ Thành công! Đề xuất {len(result.recommended_tools)} công cụ")
        print(f"Comparison: {bool(result.comparison)}")
        print(f"Final recommendation: {bool(result.final_recommendation)}")
        print(f"Next steps: {bool(result.next_steps)}")
    elif isinstance(result, dict) and 'error' in result:
        print(f"❌ Lỗi: {result['error']}")
    else:
        print(f"⚠️ Kết quả không mong đợi: {type(result)}")
        
except Exception as e:
    print(f"❌ Exception: {e}")
    
print("Test hoàn tất.")