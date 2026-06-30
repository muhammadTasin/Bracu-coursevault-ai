# CourseVault AI 🌌

CourseVault AI is a premium, 3D-animated academic study universe and resource bookmark manager tailored for university students. Featuring a dark aurora aesthetic, glassmorphic card overlays, and three-dimensional folder galaxies, CourseVault AI offers a command center where scholars can manage their course folder directories, catalog study materials, and access AI-driven resource recommendations.

---

## 🚀 Key Features

* **3D Animated Nebula Directory:** Uses WebGL, shaders, and Three.js rendering to simulate a dynamic course galaxy dashboard.
* **Supabase Authentication:** Secure, cookie-aware sign-up, login, and sign-out sessions handled at the edge.
* **Scholar Identity & Avatars:** Allows scholars to register with custom profile photo URLs that sync dynamically to their navigation profiles.
* **Course Folder Directories:** Dynamic CRUD controls to initialize, read, and delete academic folders (e.g. `CSE 427`).
* **Categorized Bookmarks:** Organizes study references into six distinct lanes:
  * 💻 **GitHub:** Source repositories and projects.
  * 📺 **YouTube:** Lectures and video walkthroughs.
  * 📄 **PDF/Notes:** Exam solutions, notes, and slides.
  * 🌐 **Website:** Documentation and blogs.
  * 🎯 **Practice:** Exercises, problems, and assignments.
  * 📁 **Other:** Miscellaneous materials.
* **AI Resource Sync:** Triggers simulated scanning queries against Gemini models, allowing students to save highly relevant suggested links directly to their database with a single click.
* **Secure Route Guards:** Server-side session validation intercepts traffic on all dashboard, folder, and settings paths, automatically redirecting non-authenticated users.

---

## 🛠 Tech Stack

1. **Frontend:** React, Next.js 15 (App Router), TypeScript, Tailwind CSS v4.
2. **3D Visuals:** Three.js, custom Fragment Shaders.
3. **Backend & Database:** Supabase (PostgreSQL with Row Level Security, sync triggers).
4. **Validation:** Zod schemas for input validation.

---

## 📂 Project Architecture

```
├── app/
│   ├── auth/            # Sign In and Sign Up page routes
│   ├── courses/         # Folder details and categorized resource pages
│   ├── dashboard/       # Nebula course selection command center
│   ├── settings/        # Scholar profile and API configuration settings
│   ├── layout.tsx       # Root layout holding backdrop canvasses
│   └── page.tsx         # Landing splash page
├── components/ui/
│   ├── FolderUniverse.tsx  # Three.js folder particles universe
│   ├── ShaderBackground.tsx # GPU-driven space backdrop canvas
│   └── Navbar.tsx          # Dynamic avatar-fetching header
├── lib/
│   ├── actions/         # Server Actions (Auth, Courses, Resources, Profiles)
│   ├── supabase/        # Cookie-aware client, server, and middleware wrappers
│   └── validation.ts    # Zod payload schemas
├── supabase/
│   └── schema.sql       # Postgres schema migrations, RLS rules, and triggers
└── types/               # TypeScript interfaces
```

---

## 💾 Database Schema

The database consists of 4 main tables:
1. **`profiles`:** Statically synced with Supabase Auth users. Holds profile name and avatar image URLs.
2. **`courses`:** Stores user-created folder categories with unique course codes and tag collections.
3. **`resources`:** Houses bookmark records with URL path validation and check constraints for resource lanes.
4. **`ai_suggestions`:** Logs queries and structured JSON suggestions returned by the AI provider.

### Row-Level Security (RLS)
All database actions utilize strict RLS constraints. Users can only perform CRUD actions on records matching `auth.uid() = user_id`.

---

## 🔧 Local Development Setup

### 1. Database Setup
Copy the contents of [`supabase/schema.sql`](file:///home/tasin/My%20websites/coursevault-ai/supabase/schema.sql) and run it inside the **SQL Editor** of your Supabase Dashboard.

### 2. Environment Variables
Create a `.env.local` file in your root folder and add the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Auth Redirection
In the Supabase Dashboard under **Auth -> URL Configuration**, add:
* Site URL: `http://localhost:3000`
* Redirect URLs: `http://localhost:3000/auth/callback` and `http://localhost:3000/dashboard`

### 4. Running the App
Install dependencies and launch the dev server:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your local study universe.

---

## ☁ Deployment to Vercel

1. Push your code to your GitHub repository.
2. Import the project on [Vercel](https://vercel.com/new).
3. Bind your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as Environment Variables.
4. Update the **Site URL** and **Redirect URIs** inside your Supabase Auth dashboard with your newly generated production Vercel link.
