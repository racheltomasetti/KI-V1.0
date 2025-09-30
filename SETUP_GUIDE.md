# Supabase Authentication Setup Guide

This guide will walk you through setting up Supabase authentication for the KI platform.

## Prerequisites

- A Supabase account (sign up at https://supabase.com - free tier available)
- Node.js and npm installed (for frontend)
- Python 3.11+ installed (for backend)

---

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click **"New Project"**
3. Choose your organization
4. Fill in project details:
   - **Project Name**: `ki-platform` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your location
5. Click **"Create new project"** (takes ~2 minutes)

---

## Step 2: Get Supabase Credentials

Once your project is created:

1. Go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. Copy these three values:

   **For Backend (.env):**
   - `Project URL` → `SUPABASE_URL`
   - `Project API keys` → `service_role` (secret) → `SUPABASE_SERVICE_KEY`

   **For JWT Secret:**
   - Scroll down to **JWT Settings** section
   - Copy `JWT Secret` → `SUPABASE_JWT_SECRET`

   **For Frontend (.env.local):**
   - `Project URL` → `VITE_SUPABASE_URL`
   - `Project API keys` → `anon` `public` → `VITE_SUPABASE_ANON_KEY`

---

## Step 3: Configure Backend Environment

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your credentials:
   ```bash
   ANTHROPIC_API_KEY=your-anthropic-key

   # Supabase Configuration
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_JWT_SECRET=your-jwt-secret-here
   ```

4. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## Step 4: Configure Frontend Environment

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Create `.env.local` file from example:
   ```bash
   cp .env.example .env.local
   ```

3. Edit `.env.local` and add your credentials:
   ```bash
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Install frontend dependencies:
   ```bash
   npm install
   ```

---

## Step 5: Setup Database Schema

1. In your Supabase dashboard, click **SQL Editor** (in sidebar)
2. Click **"New query"**
3. Copy the contents of `supabase_setup.sql` (in project root)
4. Paste into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)
6. Verify success: You should see "Success. No rows returned"

This creates:
- ✅ `user_profiles` table
- ✅ Row Level Security policies
- ✅ Auto-profile creation trigger
- ✅ Updated_at timestamp trigger

---

## Step 6: Configure Email Settings (Optional for Development)

By default, Supabase requires email confirmation. For development, you can disable this:

1. Go to **Authentication** → **Settings** in Supabase dashboard
2. Scroll to **Email Auth** section
3. Toggle **"Enable email confirmations"** OFF (for dev only!)
4. Click **Save**

**Note:** Re-enable this for production!

---

## Step 7: Start the Application

### Start Backend:
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Start Frontend (in new terminal):
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## Step 8: Test Authentication Flow

1. Open browser to `http://localhost:5173`
2. You should see the **Sign Up / Sign In** page
3. Click **"Don't have an account? Sign up"**
4. Enter email and password (min 6 characters)
5. Click **"Sign Up"**

**If email confirmation is enabled:**
- Check your email for confirmation link
- Click link to confirm account
- Return to app and sign in

**If email confirmation is disabled:**
- You'll be automatically signed in
- You should see the **Onboarding** page

6. Click **"Skip for Now"** to bypass onboarding (dev only)
7. You should see the **Chat** interface
8. Try sending a message to test the full flow!

---

## Troubleshooting

### Backend Issues

**Error: `SUPABASE_JWT_SECRET not configured`**
- Make sure `.env` file exists in backend directory
- Verify `SUPABASE_JWT_SECRET` is set correctly
- Restart backend server

**Error: `Invalid authentication token`**
- Check that JWT secret matches between Supabase and backend `.env`
- Verify you're using the correct secret (not the anon key)

### Frontend Issues

**Error: `Supabase credentials not found`**
- Make sure `.env.local` file exists in frontend directory
- Verify both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart frontend dev server (Vite needs restart for env changes)

**Sign up succeeds but can't sign in:**
- Check if email confirmation is enabled in Supabase
- Verify email was confirmed if required
- Check Supabase Authentication → Users to see user status

### Database Issues

**Error: `relation "user_profiles" does not exist`**
- Run the SQL setup script in Supabase SQL Editor
- Verify the script executed successfully

**User created but no profile:**
- Check that the trigger `on_auth_user_created` exists
- Manually check: Go to Table Editor → user_profiles in Supabase

---

## Verify Setup

Run these checks to ensure everything is configured:

### 1. Backend Health Check
```bash
curl http://localhost:8000/health
```
Should return: `{"status":"healthy","agents":[...]}`

### 2. Database Check
In Supabase SQL Editor, run:
```sql
SELECT * FROM user_profiles;
```
Should show your user profile after signup.

### 3. Frontend Auth State
Open browser console (F12) and check for:
- No Supabase client errors
- Session stored in localStorage

---

## Next Steps

Once authentication is working:

1. **Implement Real Onboarding**: Replace placeholder with agent-driven interview
2. **Add Knowledge Entry**: Create interface for users to add content
3. **Content Generation**: Implement memoir/podcast/video generation agents
4. **Profile Management**: Add settings page to view/edit profile

---

## Security Notes

⚠️ **Important for Production:**

1. **Re-enable email confirmation** in Supabase Auth settings
2. **Use HTTPS** for all requests (Railway/Vercel auto-provide this)
3. **Update CORS origins** in `backend/main.py` to your production domain
4. **Never commit `.env` or `.env.local`** files to git
5. **Rotate keys** if accidentally exposed
6. **Enable RLS policies** on all new tables

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with React](https://supabase.com/docs/guides/auth/quickstarts/react)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [JWT.io Debugger](https://jwt.io/) - Debug JWT tokens

---

## Support

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Check backend terminal for errors
4. Verify all environment variables are set correctly
