# Deployment Guide — Pokémon Explorer
### React (Vercel) + FastAPI (Render)

---

## Part 0 — Run it locally first

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
Visit `http://localhost:8000/docs` — you should see the Swagger UI and be able to test `/pokemon/pikachu`.

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173`, search "pikachu", confirm the card renders.

Once both work locally, you're ready to deploy.

---

## Part 1 — Push the project to GitHub

```bash
cd pokemon-explorer
git init
git add .
git commit -m "Initial commit"
```

Create a new empty repo on GitHub (no README/license), then:

```bash
git remote add origin https://github.com/<your-username>/pokemon-explorer.git
git branch -M main
git push -u origin main
```

Your `.env` file will **not** be pushed (it's in `.gitignore`) — that's intentional. Secrets/config never go to GitHub.

---

## Part 2 — Deploy the backend to Render

1. Go to **render.com** and sign in (GitHub login is easiest).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account and select the `pokemon-explorer` repo.
4. Configure the service:
   | Setting | Value |
   |---|---|
   | Name | `pokemon-api` (or anything) |
   | Root Directory | `backend` |
   | Runtime | Python 3 |
   | Build Command | `pip install -r requirements.txt` |
   | Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
   | Instance Type | Free |
5. Click **Create Web Service**. Render will build and deploy — this takes a couple of minutes.
6. Once live, Render gives you a URL like:
   ```
   https://pokemon-api.onrender.com
   ```
7. **Test it**: open `https://pokemon-api.onrender.com/docs` and try `/pokemon/pikachu`. If you get JSON back, the backend is live.

> Note: On Render's free tier, the service "sleeps" after inactivity and the first request after sleeping can take 30–60 seconds to wake up. That's normal — good talking point for students about free-tier limitations.

---

## Part 3 — Deploy the frontend to Vercel

1. Go to **vercel.com** and sign in with GitHub.
2. Click **Add New...** → **Project**.
3. Import the `pokemon-explorer` repo.
4. Configure the project:
   | Setting | Value |
   |---|---|
   | Framework Preset | Vite |
   | Root Directory | `frontend` |
   | Build Command | `npm run build` (default) |
   | Output Directory | `dist` (default) |
5. Before deploying, expand **Environment Variables** and add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://pokemon-api.onrender.com` (your Render URL from Part 2, **no trailing slash**) |
6. Click **Deploy**. Vercel builds and deploys — usually under a minute.
7. You'll get a live URL like:
   ```
   https://pokemon-explorer.vercel.app
   ```

---

## Part 4 — Test the full deployed stack

Open your Vercel URL and search for a Pokémon. The request path is now:

```
Vercel (React)  →  Render (FastAPI)  →  PokéAPI
```

If the search fails, check in this order:
1. **Browser console (F12)** — look for a CORS error or a failed fetch.
2. **Render logs** — Render dashboard → your service → *Logs* tab, to see if the request even arrived.
3. **Environment variable** — confirm `VITE_API_URL` on Vercel exactly matches your Render URL (typos or trailing slashes are the #1 cause of failures).
4. If you change the env var on Vercel, you must **redeploy** (Vercel → Deployments → ⋯ → Redeploy) — env var changes don't apply retroactively to old builds.

---

## Part 5 — What to update after every future code change

- **Backend change** → push to GitHub → Render auto-redeploys (if auto-deploy is on, which is default).
- **Frontend change** → push to GitHub → Vercel auto-redeploys.
- Both platforms redeploy automatically on every `git push` to `main`, since they're connected directly to the GitHub repo.

---

## Quick recap for students

| Layer | Local | Deployed |
|---|---|---|
| Frontend | `localhost:5173` | Vercel |
| Backend | `localhost:8000` | Render |
| External API | pokeapi.co | pokeapi.co (unchanged) |

Concepts covered: **React, FastAPI, REST APIs, CORS, environment variables, and cloud deployment** — all in one small project.
