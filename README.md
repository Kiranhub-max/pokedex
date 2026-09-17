![alt text](image-3.png)

![alt text](image-2.png)

![alt text](image-4.png)
## Part 0 — Run it locally first

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```


**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173`, search "pikachu", confirm the card renders.
