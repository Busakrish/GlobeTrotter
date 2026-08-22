# 🌍 GlobeTrotter

> **Work in Progress 🚧**

GlobeTrotter is a full-stack travel planning web application that helps users create personalized multi-city itineraries, organize activities, manage travel budgets, securely store travel documents, and share travel plans with others.

This repository is currently under active development for the Hackathon.

---

## 🚧 Project Status

**Current Stage:** Planning & Development

We are currently designing the application architecture, UI, database schema, backend APIs, and frontend components.

---

## ✨ Planned Features

* 🔐 User Authentication (Login & Signup)
* 🧳 Create and Manage Trips
* 🤖 AI / Smart Recommendation Engine (Intelligent destination, activity, dining & itinerary suggestions tailored to user vibe, budget, and travel history)
* 🗺️ Multi-City Itinerary Builder
* 📍 City Search & Destination Discovery
* 🎯 Activity Planner
* 💰 Budget & Expense Breakdown
* 📅 Calendar / Timeline View
* 📁 Document Vault for Secure Travel Docs
* 🌐 Shareable Public Itineraries
* 👤 User Profile & Settings

---

## 🛠️ Planned Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Frontend       | React + Vite + Tailwind CSS         |
| Backend        | Node.js + Express.js                |
| Database       | MongoDB / Persistent DataStore      |
| AI / Engine    | Smart Recommendation Engine         |
| Authentication | JWT + bcrypt                        |
| Charts         | Chart.js / Recharts                 |

---

## 🤖 AI / Smart Recommendation Engine Overview

The recommendation engine uses a hybrid approach (AI generation + database-filtered scoring) to deliver personalized travel plans:

1. **User Travel Persona:** Captures traveler vibes (*Adventure, Cultural, Relaxation, Foodie, Nightlife*), group types (Solo, Couple, Family, Friends), and trip pace.
2. **Smart Destination & Activity Matching:** Generates tailored recommendations and optimized day-by-day itineraries based on preferences and real-time inputs.
3. **Budget-Aware Suggestions:** Dynamically matches activities, stays, and dining options within the user's selected budget tier (Budget, Moderate, Luxury).
4. **Interactive Customization:** Allows users to swap, regenerate, or customize recommendations with one click.

---

## 📁 Project Structure

```text
GlobeTrotter/
├── globetrotter/
│   ├── src/          # Frontend React Components & Pages
│   └── backend/      # Express API & AI Services
├── docs/             # Technical Design & Specifications
└── README.md
```

---

## 👥 Team

| Member           | Responsibility       |
| ---------------- | -------------------- |
| **Jeny Thesiya** | Frontend Development |
| **Archi Tala**   | Backend Development  |
| **Busa Krish**   | Frontend Development |
| **Yuvraj Zala**  | Backend Development  |

---

## 📌 Note

* Project setup instructions
* Database schema
* API documentation
* Folder structure
* Screenshots and UI preview
* Deployment guide
