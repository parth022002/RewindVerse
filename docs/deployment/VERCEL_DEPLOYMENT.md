# RewindVerse — Vercel Deployment & Production Guide

This guide details how to deploy **RewindVerse** on Vercel with zero-configuration monorepo support, client-side privacy boundaries, and optional Neon Cloud integrations.

---

## 1. Quick Deploy (1-Click GitHub Integration)

1. Navigate to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** → **"Project"**.
2. Select your repository: `parth022002/RewindVerse`.
3. Vercel automatically detects the **pnpm monorepo** and Next.js configuration from `vercel.json`.

---

## 2. Monorepo Project Settings on Vercel

You can deploy using either of two standard approaches:

### Option A: Root Deployment (Default & Recommended)
* **Root Directory:** `./` (Leave default repository root)
* **Framework Preset:** `Next.js`
* **Build Command:** `pnpm build` (or `pnpm run vercel-build`)
* **Output Directory:** `apps/web/.next` *(automatically configured via root `vercel.json`)*
* **Install Command:** `pnpm install`

### Option B: Dedicated Subdirectory Deployment
* **Root Directory:** `apps/web`
* **Framework Preset:** `Next.js`
* **Build Command:** `next build` *(handled automatically by Vercel)*
* **Output Directory:** `.next`
* **Install Command:** `pnpm install` *(run from root workspace context)*

---

## 3. Environment Variables Configuration

Set these in **Project Settings** → **Environment Variables** on Vercel:

| Variable Name | Required? | Example Value | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | **Recommended** | `https://your-domain.vercel.app` | Base URL used for OpenGraph cards and canonical share links. |
| `DATABASE_URL` | *Optional* | `postgresql://user:pass@ep-xyz.aws.neon.tech/neondb?sslmode=require` | Neon Serverless PostgreSQL pooled connection string for cloud trace sharing. |
| `DATABASE_URL_UNPOOLED` | *Optional* | `postgresql://user:pass@ep-xyz.aws.neon.tech/neondb?sslmode=require` | Direct connection for migrations (`drizzle-kit`). |
| `AWS_ENDPOINT_URL_S3` | *Optional* | `https://<project-id>.storage.region.aws.neon.tech` | S3-compatible Object Storage endpoint for raw RVTS binary trace persistence. |
| `AWS_ACCESS_KEY_ID` | *Optional* | `your-s3-access-key` | Object Storage access key. |
| `AWS_SECRET_ACCESS_KEY` | *Optional* | `your-s3-secret-key` | Object Storage secret access key. |
| `S3_BUCKET` | *Optional* | `rewindverse-traces` | Bucket name for serialized replay runs. |

> **Note on Client-Side Privacy:**  
> All core features — **Data Lab**, **Algorithm Forge**, **Fit Lab**, **3D Visualizations**, **Replay Engine**, and **54 Catalog Algorithms** — function 100% locally in the browser with zero cloud credentials required. Cloud database and S3 variables are only utilized for public cross-user trace sharing (`/api/traces/share`).

---

## 4. Automatic Build & Verification Matrix

Every push to your production branch (`main`) triggers the Vercel build pipeline:
1. `pnpm install` hydrates the workspace lockfile (`pnpm-lock.yaml`).
2. Transpiles shared monorepo packages (`@rewindverse/rvts`, `@rewindverse/rewindml`, `@rewindverse/replay-engine`, `@rewindverse/diagnostics`).
3. Compiles all 41 static pages, dynamic endpoints, and API routes.
4. Generates immutable production bundles with security headers (`nosniff`, `DENY`, `strict-origin-when-cross-origin`).

---

## 5. Post-Deployment Health Verification

After deployment, verify that all systems are operational:
* **Health API Check:** `https://your-domain.vercel.app/api/health` → returns `{"status":"healthy","service":"rewindverse-api"}`
* **Cloud Status Check:** `https://your-domain.vercel.app/api/cloud/status` → reports live connectivity for Neon PostgreSQL and Object Storage.
* **Fit Lab:** `https://your-domain.vercel.app/studio/fit-lab` → verify 5-fold cross validation and dataset auto-hydration.
* **Data Lab:** `https://your-domain.vercel.app/studio/data` → verify CSV/TSV/JSON client-side parsing and schema profiling.
* **Algorithm Catalog:** `https://your-domain.vercel.app/studio/algorithms` → verify 54 verified algorithms with LaTeX equations.

