#!/usr/bin/env python3
# Test script with better error handling

print("=== myChat Debug Test ===")

try:
    from myChat import handle_query
    
    print("Testing with simple query...")
    result = handle_query("Tôi cần công cụ thiết kế logo đơn giản")
    
    print(f"\n=== RESULT ANALYSIS ===")
    print(f"Result type: {type(result)}")
    
    if hasattr(result, 'recommended_tools'):
        print(f"✅ SUCCESS!")
        print(f"- Recommended tools: {len(result.recommended_tools)}")
        print(f"- Has comparison: {bool(result.comparison)}")
        print(f"- Has final_recommendation: {bool(result.final_recommendation)}")
        print(f"- Has next_steps: {bool(result.next_steps)}")
        
        print("\n=== TOOLS ===")
        for i, tool in enumerate(result.recommended_tools, 1):
            print(f"{i}. {tool.name}")
            print(f"   Category: {tool.category}")
            print(f"   Description: {tool.description[:50]}...")
            
    elif isinstance(result, dict) and 'error' in result:
        print(f"❌ ERROR: {result['error'][:100]}...")
    else:
        print(f"❓ UNEXPECTED: {result}")
        
    print("\n=== Test completed ===")
        
except Exception as e:
    print(f"❌ EXCEPTION: {e}")
    import traceback
    traceback.print_exc()