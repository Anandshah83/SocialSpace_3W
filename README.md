# ⚡ SETUP GUIDE — SocialSpace
## Read this first before running the app!

---

## ✅ STEP 1 — Prerequisites

Install these if you haven't already:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18 or higher | https://nodejs.org |
| VS Code | Latest | https://code.visualstudio.com |

Check versions:
```
node -v     (should show v18+)
npm -v      (should show v9+)
```

---

## ✅ STEP 2 — Open in VS Code

1. Extract the ZIP file → you get a `socialspace` folder
2. Open **VS Code**
3. Go to **File → Open Folder** → select the `socialspace` folder
4. VS Code will suggest **installing recommended extensions** → click **Install All**

---

## ✅ STEP 3 — MongoDB Atlas Setup (Free Database)

1. Go to → https://cloud.mongodb.com → Sign up free
2. Click **"Build a Database"** → choose **Free (M0 Sandbox)** → any region → Create
3. Create a **Database User**:
   - Username: `socialuser`
   - Password: `Test1234` (save this!)
   - Click **Create User**
4. Under **"Network Access"** → **Add IP Address** → **Allow Access from Anywhere** → Confirm
5. Click **Connect** → **Drivers** → copy the connection string

It looks like:
```
mongodb+srv://socialuser:<password>@cluster0.abcde.mongodb.net/?retryWrites=true
```

Edit it like this (replace `<password>` with your real password and add `/socialspace?`):
```
mongodb+srv://socialuser:Test1234@cluster0.abcde.mongodb.net/socialspace?retryWrites=true&w=majority
```

---

## ✅ STEP 4 — Cloudinary Setup (Free Image Uploads)

1. Go to → https://cloudinary.com → Sign up free
2. From the **Dashboard** page, copy these 3 values:
   - **Cloud Name** (e.g. `dxyz123abc`)
   - **API Key** (e.g. `123456789012345`)
   - **API Secret** (e.g. `AbCdEfGhIjKlMnOpQrStUvWxYz`)

---

## ✅ STEP 5 — Fill in Environment Variables

Open the file: **`backend/.env`** in VS Code and fill in your values:

```env
MONGO_URI=mongodb+srv://socialuser:Test1234@cluster0.abcde.mongodb.net/socialspace?retryWrites=true&w=majority
JWT_SECRET=socialspace_secret_key_change_this
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

> ⚠️ Replace only the values — keep the variable names exactly as they are!
> ✅ `frontend/.env` is already configured for local development — don't change it.

---

## ✅ STEP 6 — Install & Run

Open **VS Code Terminal** (press `Ctrl + `` ` ``):

```bash
# Step 1: Install root dependencies
npm install

# Step 2: Install backend + frontend packages
npm run install-all

# Step 3: Start both servers
npm run dev
```

Wait ~10 seconds. You should see:
```
[BACKEND] ✅ MongoDB connected
[BACKEND] 🚀 Server on http://localhost:5000
[FRONTEND] Compiled successfully!
```

Your browser will automatically open → **http://localhost:3000** 🎉

---

## ✅ STEP 7 — Test the App

1. Click **Sign Up** → create your account
2. Write a post and click **Post**
3. Open **Incognito/Private window** → go to `http://localhost:3000`
4. Create a second account → like and comment on the first post
5. Everything updates instantly ✨

---

## ❓ Common Problems & Fixes

| Problem | Fix |
|---------|-----|
| `MongoServerError: bad auth` | Wrong password in `MONGO_URI` in `backend/.env` |
| `MongooseServerSelectionError` | IP not whitelisted → MongoDB Atlas → Network Access → Allow 0.0.0.0/0 |
| `ECONNREFUSED localhost:5000` | Backend not running → run `npm run dev:backend` |
| `Module not found` | Run `npm run install-all` again |
| Port 3000 busy | Run `npx kill-port 3000` then retry |
| Port 5000 busy | Run `npx kill-port 5000` then retry |
| Images not uploading | Wrong Cloudinary keys in `backend/.env` |

---

## 📁 Project Structure

```
socialspace/
├── 📄 SETUP.md              ← you are here
├── 📄 package.json          ← root: npm run dev starts everything
├── 📄 .gitignore
│
├── .vscode/
│   ├── settings.json        ← editor auto-format
│   ├── extensions.json      ← recommended extensions
│   ├── launch.json          ← press F5 to debug backend
│   └── api-test.http        ← test API without Postman
│
├── backend/                 ← Node.js + Express API
│   ├── .env                 ← ⚠️ FILL IN YOUR VALUES
│   ├── server.js
│   ├── models/
│   │   ├── User.js          ← users collection
│   │   └── Post.js          ← posts collection (with comments)
│   ├── routes/
│   │   ├── auth.js          ← signup, login, /me
│   │   └── posts.js         ← feed, like, comment, delete
│   └── middleware/
│       ├── auth.js          ← JWT verification
│       └── upload.js        ← Cloudinary image upload
│
└── frontend/                ← React.js + Material UI
    ├── .env                 ← already set (localhost:5000)
    └── src/
        ├── App.js           ← routes + MUI theme
        ├── api/index.js     ← all API calls
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   ├── Navbar.js
        │   ├── CreatePost.js
        │   └── PostCard.js
        └── pages/
            ├── FeedPage.js
            ├── LoginPage.js
            └── SignupPage.js
```

---

## 🌍 Deploy After Testing

| Service | Purpose | Link |
|---------|---------|------|
| MongoDB Atlas | Database | Already done above |
| Render | Backend hosting | https://render.com |
| Vercel | Frontend hosting | https://vercel.com |

**Render**: Connect GitHub repo → Root Directory: `backend` → Build: `npm install` → Start: `node server.js` → add all env vars

**Vercel**: Connect GitHub repo → Root Directory: `frontend` → Add env var: `REACT_APP_API_URL` = your Render URL + `/api`

After deploy → update Render's `CLIENT_URL` to your Vercel URL.
