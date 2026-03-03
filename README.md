<div align="center">
  <img src="https://img.shields.io/badge/Identity%20Reconciliation-Engine-4F46E5?style=for-the-badge" alt="Identity Reconciliation Engine" />
</div>

<h1 align="center">BiteSpeed: Identity Reconciliation</h1>

<div align="center">
  <p>
    <strong>A high-performance microservice to seamlessly track, consolidate, and link customer footprints across multiple channels.</strong>
  </p>
  <h3><a href="https://bite-speed-ten-bice.vercel.app/">⮑ View Live Interactive UI Demo</a></h3>
  
  <p align="center">
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript" /></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-7.0-white?style=flat-square&logo=prisma" alt="Prisma" /></a>
    <a href="https://neon.tech/"><img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql" alt="PostgreSQL" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" /></a>
  </p>
</div>

<hr />

## 🌟 The Problem
Meet Dr. Emmett Brown (Doc). Doc is hopelessly stuck in 2023 and is buying parts for his time machine from "FluxKart.com". To avoid drawing attention, Doc uses different emails and phone numbers for each purchase. 

FluxKart wants to provide a deeply personalized experience for Doc, but his scattered contact information makes it impossible to recognize him as a single loyal customer. This microservice bridges that gap by identifying and keeping track of a customer's identity across multiple purchases.

## ✨ Features
- **Intelligent Linking:** Automatically identifies returning customers based on partial matching of `email` or `phoneNumber`.
- **Primary vs. Secondary Resolution:** Dynamically determines the oldest contact as the "Primary" root identity and attaches newer identities as "Secondary" nodes.
- **Cross-Linking:** Smartly merges isolated customer chains if a new request provides connecting information (e.g., merging two previously distinct "Primary" nodes).
- **Interactive UI:** A highly premium, beautifully animated Next.js frontend to visually test the engine in real-time.
- **Robust API:** A production-ready `/api/identify` REST endpoint built on Next.js App Router and Prisma ORM.

---

## 🚀 Live Demo & API Specs

### **[⮑ View Live Interactive UI Demo](https://bite-speed-ten-bice.vercel.app/)**

The core functionality is exposed via a REST endpoint:

### `POST /api/identify`

**Request Payload (JSON)**
Receives an HTTP POST request with a JSON body. At least one field is required.

```json
{
  "email": "doc@hillvalley.edu",
  "phoneNumber": "123456"
}
```

**Successful Response (`200 OK`)**
Returns a consolidated contact JSON payload.

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["doc@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456", "987654"],
    "secondaryContactIds": [23, 45]
  }
}
```

---

## 🛠️ Tech Stack Architecture
1. **Frontend Landing Page:** Built with React, Next.js, and strictly standard `lucide-react` icons. Features bespoke Tailwind CSS `@theme` and custom `@keyframes` for premium visual dynamics, glassmorphism, and neon glows.
2. **Backend Engine:** Handled via Next.js Route Handlers (`src/app/api/...`).
3. **Database Layer:** A Serverless PostgreSQL Database hosted on [Neon](https://neon.tech/).
4. **ORM Adapter:** Leveraging **Prisma v7**, configured correctly with `@prisma/adapter-pg` driver adapters to circumvent legacy Vercel connection limits.

---

## 💻 Running Locally

To run the application on your own machine:

### 1. Clone & Install dependencies
```bash
git clone https://github.com/Echohint/bite-speed.git
cd bite-speed
npm install
```

### 2. Configure Environment variables
Create a `.env` file in the root directory and provide your PostgreSQL connection string:
```bash
DATABASE_URL="postgresql://user:password@host.aws.neon.tech/neondb?sslmode=require"
```

### 3. Sync Database Schema
Run Prisma database push and generate the Prisma Client using the v7 Adapter methodology:
```bash
npx prisma db push
npx prisma generate
```

### 4. Boot the Server!
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the Premium Identifying UI or to send CURL requests to `http://localhost:3000/api/identify`.

---

## 🧪 Quick Test Cases (cURL)

**1. Create a New Root Customer**
```bash
curl -X POST http://localhost:3000/api/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "lorraine@hillvalley.edu", "phoneNumber": "123456"}'
```

**2. Attach a Secondary Email**
```bash
curl -X POST http://localhost:3000/api/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "mcfly@hillvalley.edu", "phoneNumber": "123456"}'
```

**3. Merge Two Disconnected Nodes**
```bash
# First isolated customer
curl -X POST http://localhost:3000/api/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "919191"}'

# Second isolated customer
curl -X POST http://localhost:3000/api/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "biffsucks@hillvalley.edu", "phoneNumber": "717171"}'

# THE MERGE (Provide email of #1 and phone of #2)
curl -X POST http://localhost:3000/api/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "717171"}'
```

<div align="center">
  <p><i>Engineered for the Bitespeed Backend Task.</i></p>
</div>
