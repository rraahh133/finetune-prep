#!/usr/bin/env python3
"""
RAG Ingest: Convert your PDFs into a searchable vector store.
Run once. Takes ~1-2 minutes for 6 PDFs.

Usage:
  pip install chromadb sentence-transformers -q --break-system-packages
  python3 rag_ingest.py --input datasets/ --store ./vector_db
"""

import argparse
import subprocess
import json
import os
import re
from pathlib import Path

# ============================================================
# TEXT EXTRACTION
# ============================================================
ALLOWED_EXT = {'.pdf', '.txt', '.md', '.ipynb', '.docx', '.xlsx', '.png', '.jpg', '.jpeg'}

def extract_text(filepath: Path) -> str:
    ext = filepath.suffix.lower()
    if ext == '.pdf':
        try:
            from pypdf import PdfReader
            reader = PdfReader(str(filepath))
            return "\n\n".join((p.extract_text() or "") for p in reader.pages)
        except Exception as e:
            print(f"Error extracting {filepath}: {e}")
            return ""
    elif ext == '.docx':
        try:
            import docx
            doc = docx.Document(str(filepath))
            parts = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
            for table in doc.tables:
                for row in table.rows:
                    cells = [c.text.strip().replace("\n", " ") for c in row.cells]
                    if any(cells):
                        parts.append("| " + " | ".join(cells) + " |")
            return "\n\n".join(parts)
        except Exception as e:
            print(f"Error extracting docx {filepath}: {e}")
            return ""
    elif ext in ('.xlsx', '.xls'):
        try:
            import openpyxl
            wb = openpyxl.load_workbook(str(filepath), data_only=True)
            sheets = []
            for name in wb.sheetnames:
                ws = wb[name]
                rows = []
                for row in ws.iter_rows(values_only=True):
                    cells = [str(c).strip() if c is not None else "" for c in row]
                    if any(cells):
                        rows.append("| " + " | ".join(cells) + " |")
                if rows:
                    sheets.append(f"### Sheet: {name}\n" + "\n".join(rows))
            return "\n\n".join(sheets)
        except Exception as e:
            print(f"Error extracting xlsx {filepath}: {e}")
            return ""
    elif ext in ('.png', '.jpg', '.jpeg', '.webp'):
        try:
            from PIL import Image
            img = Image.open(str(filepath))
            w, h = img.size
            header = f"[Image: {filepath.name} ({w}x{h}, {img.format})]"
            ocr_text = ""
            try:
                import pytesseract
                ocr_text = pytesseract.image_to_string(img).strip()
            except Exception:
                pass
            if ocr_text:
                return f"{header}\n\nOCR Extracted Text:\n{ocr_text}"
            return f"{header}\n\nImage visual context: {filepath.name}"
        except Exception as e:
            print(f"Error reading image {filepath}: {e}")
            return ""
    elif ext in ('.txt', '.md'):
        return filepath.read_text(encoding='utf-8', errors='replace')
    elif ext == '.ipynb':
        try:
            nb = json.loads(filepath.read_text(encoding='utf-8', errors='ignore'))
            cells = []
            for cell in nb.get('cells', []):
                src = cell.get('source', [])
                if isinstance(src, list):
                    src = "".join(src)
                if src.strip():
                    cells.append(src.strip())
            return "\n\n".join(cells)
        except Exception:
            pass
    return ""


def clean_text(text: str) -> str:
    text = re.sub(r'\f', '\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {3,}', '  ', text)
    return text.strip()


# ============================================================
# CHUNKING (better than word-based for RAG)
# ============================================================
def chunk_by_paragraphs(text: str, max_chars: int = 1200, overlap_chars: int = 200) -> list:
    """
    Split by paragraph boundaries, merge into ~max_chars chunks.
    Keeps sentences together — better for search relevance.
    """
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    chunks = []
    current = ""
    
    for para in paragraphs:
        if len(current) + len(para) < max_chars:
            current = (current + '\n\n' + para).strip()
        else:
            if current:
                chunks.append(current)
            # Overlap: carry last part forward
            words = para.split()
            if len(words) > 20:
                current = ' '.join(words[-overlap_chars:][:30]) if len(' '.join(words)) > overlap_chars else para
            else:
                current = para
    
    if current:
        chunks.append(current)
    
    return chunks


# ============================================================
# INGEST PIPELINE
# ============================================================
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', type=str, required=True, help='Folder with documents')
    parser.add_argument('--store', type=str, default='./vector_db', help='Where to save vector DB')
    parser.add_argument('--model', type=str, default='all-MiniLM-L6-v2',
                        help='Embedding model (default: tiny, fast, free)')
    parser.add_argument('--chunk-size', type=int, default=1200, help='Max chars per chunk')
    args = parser.parse_args()
    
    # Step 1: Extract text
    print("=" * 60)
    print("STEP 1: Extracting text from documents...")
    print("=" * 60)
    
    input_path = Path(args.input)
    files = []
    if input_path.is_file():
        files = [input_path]
    elif input_path.is_dir():
        ignored_dirs = {"$recycle.bin", "system volume information", "appdata", "node_modules", ".git", ".venv", "__pycache__"}
        for dirpath, dirnames, filenames in os.walk(str(input_path), topdown=True, onerror=lambda err: None):
            dirnames[:] = [d for d in dirnames if not d.startswith('.') and d.lower() not in ignored_dirs]
            for fname in filenames:
                ext = Path(fname).suffix.lower()
                if ext in ALLOWED_EXT and not fname.startswith('~$') and not fname.startswith('.'):
                    files.append(Path(dirpath) / fname)
    files = sorted(files)
    
    documents = []  # [{text, file, chunk_id}]
    
    for f in files:
        print(f"\n📄 {f.name}")
        raw = extract_text(f)
        if not raw:
            print("   → EMPTY")
            continue
        
        clean = clean_text(raw)
        chunks = chunk_by_paragraphs(clean, max_chars=args.chunk_size)
        
        for i, chunk in enumerate(chunks):
            documents.append({
                "text": chunk,
                "file": f.name,
                "chunk_id": i,
            })
        
        print(f"   → {len(raw):,} chars → {len(chunks)} chunks")
    
    print(f"\n✅ Total: {len(documents)} chunks from {len(files)} files")
    
    # Step 2: Embed + store
    print(f"\n{'=' * 60}")
    print(f"STEP 2: Embedding chunks ({args.model})...")
    print(f"{'=' * 60}")
    
    from sentence_transformers import SentenceTransformer
    import chromadb
    from chromadb.config import Settings
    
    model = SentenceTransformer(args.model)
    print(f"   Model loaded: {args.model}")
    
    client = chromadb.PersistentClient(
        path=args.store,
        settings=Settings(anonymized_telemetry=False)
    )
    collection = client.get_or_create_collection(
        name="pdf_docs",
        metadata={"hnsw:space": "cosine"}
    )
    
    batch_size = 50
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i+batch_size]
        ids = [f"doc_{j}" for j in range(i, i + len(batch))]
        texts = [d["text"] for d in batch]
        metadatas = [{"file": d["file"], "chunk_id": d["chunk_id"], "source": d["file"]} for d in batch]
        
        print(f"   Embedding {i+1}-{min(i+batch_size, len(documents))}/{len(documents)}...", end=" ", flush=True)
        embeddings = model.encode(texts).tolist()
        
        collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
        )
        print("✅")
    
    print(f"\n✅ DONE!")
    print(f"   Vector DB: {args.store}")
    print(f"   Chunks: {collection.count()}")
    print(f"   Files: {len(files)}")
    print(f"\nNow run: python3 rag_chat.py --store {args.store}")


if __name__ == '__main__':
    main()
