# 🌱 EcoRent — Team B9

**Rental Agreement Management System** for the REVA Web Application Development Hackathon.

EcoRent keeps the original green / eco-friendly product feel, while adding the management features needed for a stronger hackathon submission:

- React + Vite
- HTML + CSS + JavaScript
- Supabase Authentication
- Supabase PostgreSQL database
- Supabase Storage for signed agreement documents
- Dashboard
- Property catalogue + property management
- Tenant management
- Rental agreement creation
- Live agreement preview
- Browser print / Save as PDF
- Rent / payment tracking
- Lease-expiry alerts
- Demo mode with localStorage fallback
- GitHub + Vercel ready

## 1. Run locally

```bash
npm install
npm run dev
```

Open the localhost URL shown by Vite.

## 2. Connect Supabase

The project already contains the provided Supabase URL and publishable browser key in:

```text
src/supabase.js
```

Run **the entire**:

```text
supabase/schema.sql
```

inside **Supabase → SQL Editor**.

The SQL creates:

- profiles
- properties
- tenants
- agreements
- rent_payments
- documents
- signup profile trigger
- RLS policies
- private Storage bucket `agreement-documents`
- starter properties

## 3. Authentication

For a fast classroom demo, in Supabase:

**Authentication → Providers → Email**

You can disable **Confirm email** so a newly-created user can sign in immediately during the hackathon.

The app also has Demo Mode, so the core UI remains usable even before a Supabase login.

## 4. How the app decides between Demo Mode and Supabase

- Not signed in → Demo Mode with localStorage.
- Signed in → loads and writes owner-managed data to Supabase.
- Public property catalogue is readable without signing in.
- Owner data is protected by RLS.

## 5. GitHub

```bash
git init
git add .
git commit -m "Build EcoRent Team B9 MVP"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ecorent-b9.git
git push -u origin main
```

## 6. Vercel

Import the GitHub repository into Vercel.

Use:

```text
Framework preset: Vite
Build command: npm run build
Output directory: dist
```

No secret environment variables are required for this build because the supplied browser publishable key is already in `src/supabase.js`.

> Never put a Supabase service-role key in a React frontend.

## 7. Suggested 3-minute demo

1. Home → show the eco-friendly concept.
2. Properties → open Green Home.
3. Rent This Property → fill tenant details.
4. Create Rental Agreement → show live agreement preview.
5. Save/Print as PDF.
6. Dashboard → show properties, active leases, pending rent and renewal alert.
7. Payments → mark a pending payment as paid.
8. Agreements → upload a signed document.
9. Briefly open Supabase dashboard to prove data is being persisted.

## 8. Folder structure

```text
EcoRent/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
├── TEAM_NOTES.md
├── supabase/
│   └── schema.sql
├── public/
└── src/
    ├── App.jsx
    ├── demoData.js
    ├── main.jsx
    ├── style.css
    └── supabase.js
```


## Modular structure

`App.jsx` is now the shell/orchestrator. Business logic lives in `src/hooks/useEcoRent.js`, shared formatting logic in `src/utils.js`, reusable UI in `src/components/`, and screens in `src/pages/`.
