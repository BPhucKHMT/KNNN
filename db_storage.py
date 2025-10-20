import faiss
import numpy as np
import sqlite3
import json
from sentence_transformers import SentenceTransformer

DB_PATH = "query_cache.db"
EMBEDDING_MODEL = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# === Chuẩn bị DB ===
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute("""
CREATE TABLE IF NOT EXISTS cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT,
    embedding BLOB,
    response_json TEXT
)
""")
conn.commit()
conn.close()

# === FAISS index (384 chiều) ===
index = faiss.IndexFlatIP(384)
id_map = []  # ánh xạ giữa vị trí trong FAISS và id trong DB

def normalize(v):
    return v / np.linalg.norm(v)

def add_to_cache(query, response_dict):
    vec = EMBEDDING_MODEL.encode([query])[0]
    vec = normalize(vec)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO cache (query, embedding, response_json) VALUES (?, ?, ?)",
              (query, vec.tobytes(), json.dumps(response_dict, ensure_ascii=False)))
    new_id = c.lastrowid
    conn.commit()
    conn.close()
    index.add(np.array([vec]).astype("float32"))
    id_map.append(new_id)

def search_similar(query, threshold=0.8):
    vec = EMBEDDING_MODEL.encode([query])[0]
    vec = normalize(vec).astype("float32")

    if index.ntotal == 0:
        # load DB vào FAISS
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT id, embedding FROM cache")
        rows = c.fetchall()
        for r in rows:
            emb = np.frombuffer(r[1], dtype=np.float32)
            index.add(np.array([emb]))
            id_map.append(r[0])
        conn.close()

    D, I = index.search(np.array([vec]), k=1)
    score = D[0][0]
    if score >= threshold and I[0][0] >= 0:
        matched_id = id_map[I[0][0]]
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT query, response_json FROM cache WHERE id=?", (matched_id,))
        row = c.fetchone()
        conn.close()
        if row:
            print("✅ Found in cache:", row[0], "| score:", score)
            return row[0], json.loads(row[1]), score
    return None, None, score
