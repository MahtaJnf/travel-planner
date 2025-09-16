# 🌍 Travel Planner

A comprehensive full-stack travel planning application that helps users discover destinations worldwide with detailed weather forecasts, stunning photos, and the ability to save their favorite cities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Project Structure](#project-structure)

## 🔍 Overview

Travel Planner is a modern web application built with Next.js and Express.js that allows users to:

- **Search destinations** - Find any city or country worldwide
- **View weather data** - Get current conditions and 5-day forecasts
- **Browse photos** - See beautiful destination imagery
- **Manage favorites** - Save and organize favorite destinations
- **User accounts** - Personal favorite lists tied to user accounts

The application features a clean, modern Material-UI design with a centralized theme system and responsive layout that works seamlessly across all devices.

## ✨ Features

### 🎯 Core Features
- **Real-time city search** with intelligent destination lookup
- **Weather integration** with current conditions and forecasts
- **Photo galleries** featuring destination imagery
- **Favorites management** with CRUD operations
- **User authentication** system with secure password hashing
- **Responsive design** optimized for desktop, tablet, and mobile

### 🎨 UI/UX Features
- **Modern Material-UI design** with custom theme system
- **Smooth animations** and hover effects
- **Loading states** and error handling
- **Image carousels** with fallback handling
- **Gradient backgrounds** and glassmorphism effects
- **Dark/light theme support** ready

### 🔧 Technical Features
- **Full-stack TypeScript** for type safety
- **Prisma ORM** with PostgreSQL database
- **React Query** for efficient data fetching and caching
- **Docker containerization** for easy development setup
- **Nx monorepo** for organized code structure
- **RESTful API** with Express.js backend

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.1.4 (React 18.3.1)
- **UI Library**: Material-UI (MUI) v6.4.8
- **State Management**: React Query v5.74.4 + Jotai v2.12.3
- **Styling**: Emotion (CSS-in-JS) with custom theme system
- **Charts**: MUI X-Charts v7.28.0
- **Maps**: React Leaflet v4.2.1
- **Image Carousels**: React Slick v0.30.3

### Backend
- **Framework**: Express.js v4.21.2
- **Language**: TypeScript v5.8.2
- **Database**: PostgreSQL with Prisma ORM v6.8.2
- **Authentication**: Argon2 password hashing v0.44.0
- **CORS**: Enabled for cross-origin requests

### Development Tools
- **Monorepo**: Nx v20.6.2
- **Package Manager**: npm
- **Database Tools**: Docker Compose for PostgreSQL
- **Linting**: ESLint with TypeScript support
- **Testing**: Vitest + Playwright

### External APIs
- **Weather Data**: Integrated weather API for forecasts
- **Image Service**: Photo fetching for destinations
- **Geolocation**: Country and city information

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │───▶│  Express API    │───▶│   PostgreSQL    │
│   (Port 4200)   │    │  (Port 3333)    │    │   (Docker)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Material-UI     │    │ Prisma ORM      │    │ User Sessions   │
│ React Query     │    │ TypeScript      │    │ Favorites       │
│ Custom Theme    │    │ CORS            │    │ User Accounts   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v18+ 
- **Docker** and Docker Compose
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd travel-planner
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/travel_planner"
```

### 4. Database Setup
```bash
# Start PostgreSQL with Docker
npm run db:up

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database (optional)
npm run db:seed
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Option 1: Run Both Services Together
```bash
npm run dev:all
```
This starts both client (port 4200) and server (port 3333) simultaneously.

#### Option 2: Run Services Separately
```bash
# Terminal 1 - Start the backend server
npm run dev:server

# Terminal 2 - Start the frontend client
npm run dev:client
```

### Access the Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3333

### Database Management
```bash
# Start database
npm run db:up

# Stop database
npm run db:down

# Reset database (removes all data)
npm run db:reset
```

## 🗄 Database

### Schema Overview
The application uses PostgreSQL with Prisma ORM and includes:

#### Tables
1. **Users** - User accounts with email and hashed passwords
2. **Favorites** - User's saved destinations with city and country info
3. **Sessions** - User authentication sessions

#### Key Features
- **User authentication** with secure password hashing
- **Cascade deletion** - removing users removes their favorites and sessions
- **Unique constraints** - prevents duplicate favorites per user
- **Indexing** - optimized queries for user lookups

### Database Commands
```bash
# View database in Prisma Studio
npx prisma studio

# Reset and reseed database
npm run db:reset && npm run db:seed

# Apply schema changes
npm run prisma:migrate
```

## 🔌 API Endpoints

### Weather Endpoints
- `GET /api/v1/weather?city={city}` - Current weather
- `GET /api/v1/weather/forecast?city={city}` - 5-day forecast

### Images Endpoints  
- `GET /api/v1/images?city={city}` - Destination photos

### Location Endpoints
- `GET /api/v1/country?code={countryCode}` - Country information
- `GET /api/v1/tourist?city={city}` - Tourist information

### Favorites Endpoints
- `GET /api/v1/favorites?user_id={userId}` - Get user favorites
- `POST /api/v1/favorites` - Add to favorites
- `DELETE /api/v1/favorites/{id}` - Remove from favorites

## 🛠 Development

### Project Structure
```
travel-planner/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable UI components  
│   │   ├── hooks/         # Custom React hooks
│   │   └── types/         # TypeScript type definitions
├── server/                # Express.js backend
│   ├── src/
│   │   ├── controllers/   # API route handlers
│   │   ├── routes/        # Express routes
│   │   └── main.ts        # Server entry point
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migration files
├── docker-compose.yml    # PostgreSQL database setup
└── package.json          # Root dependencies and scripts
```

### Code Style & Architecture

#### Frontend Patterns
- **Custom hooks** for API calls with React Query
- **Centralized theme system** with Material-UI
- **Responsive design** with sx props and breakpoints
- **Error boundaries** and loading states
- **Type-safe** API calls with TypeScript

#### Backend Patterns
- **RESTful API design** with Express.js
- **Prisma ORM** for type-safe database queries
- **Error handling** middleware
- **CORS configuration** for cross-origin requests
- **Modular route structure**

### Key Implementation Highlights

#### 🎨 Theme System
- **Centralized color palette** with custom gradients
- **Alpha color variations** for consistent opacity
- **No hardcoded colors** outside theme definitions
- **TypeScript theme augmentation** for type safety

#### 🔄 State Management  
- **React Query** for server state with caching
- **Jotai** for client state management
- **Custom hooks** for API integration
- **Optimistic updates** for better UX

#### 📱 Responsive Design
- **Mobile-first approach** with Material-UI breakpoints
- **Flexible grid system** for various screen sizes
- **Touch-friendly interactions** for mobile devices
- **Progressive enhancement** for desktop features

## 🔄 What's Been Implemented

### ✅ Completed Features
1. **Full-stack application setup** with Nx monorepo
2. **Database design** with Prisma and PostgreSQL
3. **User favorites system** with CRUD operations
4. **Weather integration** with current and forecast data
5. **Image galleries** with carousel functionality
6. **Responsive UI** with Material-UI components
7. **Search functionality** with URL parameter handling
8. **Theme system** completely centralized and type-safe
9. **Error handling** and loading states throughout
10. **Docker development environment** for easy setup

### 🔄 Current State
- **Multi-user support** with database relationships
- **Modern UI/UX** with smooth animations and interactions
- **Type-safe development** throughout the stack
- **Production-ready architecture** with proper separation of concerns

### 🔮 Potential Enhancements
- **User authentication UI** (login/register pages)
- **Flight booking integration** (placeholder exists)
- **Advanced search filters** (date ranges, weather conditions)
- **Social features** (sharing favorites, reviews)
- **Offline support** with service workers
- **Push notifications** for weather alerts

---

**Built with ❤️ for travelers worldwide** 🌍