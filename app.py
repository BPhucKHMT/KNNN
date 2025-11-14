from unittest import result
from flask import Flask, json, request, jsonify
from flask_cors import CORS
from myChat import handle_query
from db_storage import add_to_cache, search_similar, clear_cache, get_cache_stats
import re
import os

app = Flask(__name__)
CORS(app)  # cho phép React call API

# Cấu hình threshold
CACHE_THRESHOLD = float(os.getenv("CACHE_THRESHOLD", "0.92"))

@app.route("/query", methods=["GET"])
def query():
    user_query = request.args.get("q")

    if not user_query:
        return jsonify({"error": "Missing query parameter 'q'"}), 400

    try:
        # Tìm kiếm trong cache trước với threshold có thể cấu hình
        cached_query, cached_response, score = search_similar(user_query, threshold=CACHE_THRESHOLD)
        
        print(f"Cache check - Query: '{user_query[:50]}...' | Score: {score:.4f} | Threshold: {CACHE_THRESHOLD}")
        
        if cached_response:
            print(f"✅ Returning from cache (score: {score:.4f})")
            return jsonify(cached_response)
        
        # Nếu không tìm thấy trong cache, gọi myChat
        print(f"Calling AI model for new query")
        response = handle_query(user_query)
        
        # Lưu vào cache
        add_to_cache(user_query, response)
        print(f"Saved to cache: '{user_query[:50]}...'")
        
        # Trả về response
        return jsonify(response)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/cache/stats", methods=["GET"])
def cache_stats():
    """Endpoint để xem thống kê cache"""
    try:
        stats = get_cache_stats()
        return jsonify({
            "success": True,
            "current_threshold": CACHE_THRESHOLD,
            **stats
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/cache/clear", methods=["POST"])
def cache_clear():
    """Endpoint để xóa toàn bộ cache"""
    try:
        clear_cache()
        return jsonify({
            "success": True,
            "message": "Cache đã được xóa hoàn toàn"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)