# NexusV2 Frontend

This is the Next.js/React frontend repository for the NexusV2 project. It contains the complete user interface, component library, state management (Pinia/Zustand), and real-time WebSocket integrations (Echo/Reverb).

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
npm install
# or
yarn install
```

### Environment Setup
Copy the example environment file and configure it:
```bash
cp .env.example .env.local
```
Ensure your `NEXT_PUBLIC_API_URL` points to the NexusV2 Backend API.

### Development Server
```bash
npm run dev
```

## 🏗️ Architecture
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS + Custom Design System Tokens
- **State**: Centralized store for Contacts, Workflows, and Agents
- **Real-time**: Laravel Echo Integration

## 🤖 AI Development Guidelines (Antigravity/Cursor)
When asking AI to modify this repository:
1. Always reference `Docs/FrontEnd/Architecture_Overview.md` for context.
2. Ensure components are strictly typed with TypeScript.
3. Keep logic decoupled from the UI components.
