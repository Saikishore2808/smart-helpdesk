# Smart Helpdesk

## Overview
A full-stack support ticket system with agentic AI triage. Users raise tickets, AI suggests replies, and agents finalize responses.

## Features
- User, Agent, Admin roles
- JWT authentication
- Ticket lifecycle management
- AI feedback with thumbs up/down
- Knowledge base CRUD (admin)
- Audit logs
- Real-time updates via optional SSE/WebSocket (stretch)
- Stubbed AI logic (no API keys required)

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB
- Optional: Redis / BullMQ for async triage jobs
- Docker Compose for easy setup

## Setup Instructions

### Backend
```bash
cd api
npm install
cp .env.example .env
# Set MONGO_URI, JWT_SECRET, AUTOCLOSEENABLED, CONFIDENCETHRESHOLD
node server.js
