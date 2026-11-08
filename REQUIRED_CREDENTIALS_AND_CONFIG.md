# RewindVerse — Required Credentials, API Keys & Environment Configuration

**Document Status:** Living Technical Guide  
**Applies to:** RewindVerse Platform & Rewind Studio  
**Date:** November 2026  

---

## 1. Executive Summary: What You Need Right Now vs Later

RewindVerse is engineered under a **Local-First, Privacy-First Architecture**:

> 💡 **Key Takeaway for You:**  
> **You DO NOT need any API keys or database credentials to build, run, test, and use the core RewindVerse platform!**  
> All core capabilities — the Interactive Optimizer Lab, Web Worker computation engine (RewindML), RVTS trace generator, deterministic Replay Viewer, step scrubber, heuristic Diagnostics (Rewind Insights), CSV importer, and Rewind Academy lessons — **run 100% client-side inside the browser using Web Workers and IndexedDB**.

Cloud credentials are only needed when you choose to activate **Cloud Sharing** (generating public read-only URLs like `rewindverse.com/share/[token]`) or **User Account Sync**.

---

## 2. Complete Environment Matrix

| Environment Variable | Required For | Status | Where to Get It / Format |
|---|---|---|---|
| `DATABASE_URL` | Cloud Sharing & Account Sync | 🟢 **Connected (Neon)** | Pooled PostgreSQL connection string |
| `DATABASE_URL_UNPOOLED` | Database Migrations (Drizzle ORM) | 🟢 **Connected (Neon)** | Direct PostgreSQL connection string |
| `AWS_ENDPOINT_URL_S3` | Neon S3 Object Storage Endpoint | 🟢 **Connected (Neon)** | Neon branch S3 storage endpoint URL |
| `AWS_ACCESS_KEY_ID` | Neon S3 Object Storage Access Key | 🟢 **Connected (Neon)** | Neon branch S3 access token (`nak_live_...`) |
| `AWS_SECRET_ACCESS_KEY` | Neon S3 Object Storage Secret Key | 🟢 **Connected (Neon)** | Neon branch S3 secret token (`nsk_live_...`) |
| `AWS_REGION` | Neon S3 Storage Region | 🟢 **Connected (Neon)** | `ap-southeast-1` |
| `S3_BUCKET` | Trace Bucket Name | 🟢 **Configured** | `rewind-traces` |
| `NEXT_PUBLIC_APP_URL` | Public Base URL | 🟢 **Configured** | `http://localhost:3000` (Dev) or production domain |
| `AUTH_SECRET` | Session Encryption & Auth | Optional (Accounts) | Generated random 32-byte secret (`openssl rand -hex 32`) |
| `NEXTAUTH_URL` | Canonical Site URL for Auth | Optional (Accounts) | `http://localhost:3000` (Dev) or production domain |
| `NEXT_PUBLIC_POSTHOG_KEY` | Privacy-safe Product Analytics | Optional (Post-Launch) | PostHog Cloud API Key |
| `NEXT_PUBLIC_POSTHOG_HOST` | Analytics Host | Optional (Post-Launch) | e.g. `https://us.i.posthog.com` |
| `SENTRY_DSN` | Error Monitoring | Optional (Production) | Sentry Project DSN |

---

## 3. How to Obtain Each Credential

### 3.1 Neon Serverless PostgreSQL Database
* **Why it's used:** Stores user account metadata, saved experiments library, and share tokens/ACLs with instant branching and auto-scaling.
* **How to get it:**
  1. Go to [neon.tech](https://neon.tech) and create a free account.
  2. Create a new project named `rewindverse`.
  3. In the project dashboard, select your database (default `neondb` or create `rewindverse`).
  4. Copy the **Pooled connection string** (ends with `-pooler...`) -> set as `DATABASE_URL`.
  5. Toggle off "Connection pooling" and copy the **Direct connection string** -> set as `DATABASE_URL_UNPOOLED`.

### 3.2 S3-Compatible Object Storage (Neon Object Storage or Cloudflare R2)
* **Why it's used:** Storing portable `.rvtrace` and `.rvtrace.gz` files when a user clicks "Share Public Link" or "Share to Cloud".
* **Active Provider: Neon Object Storage** (Integrated & Live Verified):
  - Provisioned in Neon Console under project branch: `late-waterfall-a1f5bte1`
  - Bucket: `rewind-traces`
  - Region: `ap-southeast-1`
  - Endpoint: `https://br-icy-sun-a1vt6wi9.storage.c-1.ap-southeast-1.aws.neon.tech`
* **Alternative Provider: Cloudflare R2** (Zero egress fees):
  1. In Cloudflare Dashboard, go to **R2 Object Storage**.
  2. Create a bucket named `rewindverse-traces`.
  3. Go to **Manage R2 API Tokens** -> Create API Token with *Admin Read & Write* permissions.
  4. Fill in `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `S3_BUCKET`.

### 3.3 Auth.js / NextAuth Session Secret
* **Why it's used:** Secures user cookies and signs session tokens.
* **How to get it:**
  Run in terminal:
  ```bash
  openssl rand -hex 32
  ```
  Or generate any secure 64-character random string.

---

## 4. Immediate Development Action Plan

1. **For running locally right now:**  
   The workspace defaults to offline / local-first mode (`NEXT_PUBLIC_APP_URL=http://localhost:3000`). No keys need to be provided to test the UI, optimizer algorithms, replay scrubber, CSV imports, or Academy.
2. **When you are ready to enable Cloud Sharing & Neon Database:**  
   Copy `.env.example` to `.env.local` inside `apps/web/` and fill in `DATABASE_URL` and S3 storage variables.

