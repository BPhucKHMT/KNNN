from unittest import result
from flask import Flask, json, request, jsonify
from flask_cors import CORS
import os
from myChat import handle_query

import re

app = Flask(__name__)
CORS(app)  # cho phép React call API

@app.route("/query", methods=["GET"])
def query():
    user_query = request.args.get("q")

    if not user_query:
        return jsonify({"error": "Missing query parameter 'q'"}), 400

    try:
        response = handle_query(user_query)
        print(type(response))
        # Nếu đã là dict -> trả thẳng
        '''
        if isinstance(response, dict):
            return jsonify(response)
        # Nếu là string -> wrap lại
        else:
            return jsonify({"result": str(response)})
            '''
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500






if __name__ == "__main__":
    app.run(debug=True, port=5000)
