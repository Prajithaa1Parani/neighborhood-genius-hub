# 🔄 The Exchange — Hyperlocal Skill Exchange Platform

A full-stack web application that enables community members to discover, share, and exchange skills with neighbors in their local area. Built as a **Data Structures & Algorithms (DSA)** project demonstrating real-world application of core CS concepts.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Demo Credentials](#demo-credentials)
- [Pages & Routes](#pages--routes)
- [AI Chat Integration](#ai-chat-integration)
- [DSA Concepts Used](#dsa-concepts-used)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

**The Exchange** is a hyperlocal skill exchange platform where users can:
- Browse and discover skills offered by neighbors
- Initiate skill exchange sessions
- Communicate with exchange partners via real-time AI-powered chat
- Track active skill exchanges and progress
- Build a community reputation through reviews and ratings

The platform operates on a **barter-based economy** — users exchange skills instead of money, promoting community building and lifelong learning.

---

## ✨ Features

### 🔐 Authentication System
- Demo login with pre-configured credentials
- Session persistence via `localStorage`
- Protected routes with automatic redirects
- Auto-fill button for quick demo access

### 📊 Dashboard
- **Stats Overview**: Skills exchanged count, hours earned tracker
- **Active Exchanges**: Real-time progress bars for ongoing exchanges
- **Local Discovery**: Recommended skills from nearby community members
- **Quick Actions**: Direct navigation to market and chat

### 🏪 Skill Market
- **Search**: Real-time text search across skill titles and tags
- **Category Filtering**: Filter by categories (Technology, Cooking, Music, etc.)
- **Skill Cards**: Visual cards with instructor info, ratings, distance, and difficulty level
- **Tag System**: Multi-tag classification for each skill

### 💬 AI-Powered Chat
- **Character-Specific AI**: Each contact replies as a unique persona with domain expertise
- **Streaming Responses**: Real-time typing effect using Server-Sent Events (SSE)
- **Conversation History**: Full message history tracking per conversation
- **Online Status**: Visual indicators for user availability
- **Profiles include**: Elena Vance (Gardening), David Kim (React Dev), Priya Nair (Thai Cuisine), Sarah Chen (UI/UX), Jean Pierre (Music/Pasta)

### 👤 User Profile
- Bio, location, and join date
- Verification badges
- Skills offered and skills needed
- Community reviews with star ratings
- Logout functionality

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | TanStack Start v1 (React 19, SSR) |
| **Styling** | Tailwind CSS v4 with semantic design tokens |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Build Tool** | Vite 7 |
| **Backend** | Lovable Cloud (Supabase) |
| **AI Gateway** | Lovable AI Gateway (Google Gemini) |
| **Edge Functions** | Deno-based serverless functions |
| **Deployment** | Cloudflare Workers (Edge) |
| **Language** | TypeScript (strict mode) |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AppLayout.tsx          # Header + Bottom Navigation
│   └── ui/                    # shadcn/ui component library
├── hooks/
│   └── use-mobile.tsx         # Responsive breakpoint hook
├── integrations/
│   └── supabase/              # Backend client & types (auto-generated)
├── lib/
│   ├── auth-context.tsx       # Authentication context provider
│   ├── mock-data.ts           # Data models & demo dataset
│   └── utils.ts               # Utility functions (cn, etc.)
├── routes/
│   ├── __root.tsx             # Root layout (HTML shell, AuthProvider)
│   ├── index.tsx              # Entry redirect (auth-based routing)
│   ├── login.tsx              # Login page with demo credentials
│   ├── dashboard.tsx          # Main dashboard with stats & exchanges
│   ├── market.tsx             # Skill marketplace with search & filters
│   ├── chat.tsx               # AI-powered messaging system
│   └── profile.tsx            # User profile with reviews
├── styles.css                 # Design system tokens (oklch colors)
├── router.tsx                 # TanStack Router configuration
└── routeTree.gen.ts           # Auto-generated route tree

supabase/
└── functions/
    └── chat-reply/
        └── index.ts           # AI chat edge function (streaming SSE)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- A Lovable account (for Cloud backend)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd the-exchange

# Install dependencies
bun install

# Start development server
bun run dev
```

The app will be available at `http://localhost:8080`

---

## 🔑 Demo Credentials

| Field | Value |
|-------|-------|
| **Email** | `marcus@exchange.demo` |
| **Password** | `demo1234` |

> 💡 Click the **"Auto-fill Demo"** button on the login page for instant access.

---

## 📱 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Index | Auth-based redirect to dashboard or login |
| `/login` | Login | Authentication with demo credentials |
| `/dashboard` | Dashboard | Stats, active exchanges, skill discovery |
| `/market` | Skill Market | Browse, search, and filter skills |
| `/chat` | Messages | AI-powered conversations with partners |
| `/profile` | Profile | User info, reviews, skills, and settings |

---

## 🤖 AI Chat Integration

The chat system uses an **Edge Function** (`supabase/functions/chat-reply/index.ts`) that:

1. Receives the conversation history and character name
2. Selects a character-specific system prompt with domain expertise
3. Sends the request to the **Lovable AI Gateway** (Google Gemini model)
4. Streams the response back via **Server-Sent Events (SSE)**
5. The frontend parses the SSE stream and renders tokens in real-time

### Character Profiles

| Character | Expertise | Personality |
|-----------|-----------|-------------|
| **Elena Vance** | Urban Gardening, Hydroponics | Warm, enthusiastic, uses gardening metaphors |
| **David Kim** | React, Tailwind CSS, Web Dev | Patient, methodical, uses coding analogies |
| **Priya Nair** | Thai & South Asian Cuisine | Enthusiastic about food, shares recipe ideas |
| **Sarah Chen** | UI/UX, Motion Design | Creative, detail-oriented, loves animation |
| **Jean Pierre** | Guitar, Artisan Pasta | Laid-back, artistic, connects music & cooking |

---

## 🧠 DSA Concepts Used

> See **[DSA_CONCEPTS.md](./DSA_CONCEPTS.md)** for a detailed breakdown of all Data Structures and Algorithms used in this project with code references and complexity analysis.

**Summary of DSA topics covered:**
- Hash Maps / Dictionaries
- Arrays & Dynamic Arrays
- Linear Search & Filtering
- String Matching Algorithms
- Graph Concepts (User Network)
- Queue (Message Ordering)
- State Machines (Auth Flow)
- Tree Structures (Component Hierarchy)

---

## 🔮 Future Enhancements

- [ ] Real-time messaging with WebSocket/Realtime subscriptions
- [ ] Persistent chat history in database
- [ ] User registration and email verification
- [ ] Skill posting form for listing new skills
- [ ] Booking/scheduling system for exchanges
- [ ] Geolocation-based skill discovery
- [ ] Review and rating system (write reviews)
- [ ] Push notifications for new messages
- [ ] Image sharing in chat
- [ ] Skill matching algorithm (recommendation engine)

---

## 👥 Authors

Built as a **DSA Course Project** demonstrating practical application of data structures and algorithms in a real-world full-stack web application.

---

## 📄 License

This project is built for educational purposes as part of a DSA course project.
