# 🏛️ Civic Management System

A comprehensive digital platform designed to revolutionize civic engagement and municipal administration through three interconnected applications: **Civic Worker Dashboard**, **Department Management System**, and **Social Media Platform**.

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Applications](#applications)
  - [1. Civic Worker Dashboard](#1-civic-worker-dashboard)
  - [2. Department Management System](#2-department-management-system)
  - [3. Social Media Platform](#3-social-media-platform)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Civic Management System is a modern, scalable solution that bridges the gap between citizens, civic workers, and municipal departments. It provides real-time task management, citizen engagement, performance tracking, and comprehensive reporting capabilities.

### Key Objectives
- **Streamline Municipal Operations**: Efficient task assignment and tracking
- **Enhance Citizen Engagement**: Direct communication and issue reporting
- **Improve Transparency**: Real-time updates and progress tracking
- **Gamify Civic Work**: Performance-based rewards and leaderboards
- **Data-Driven Decisions**: Comprehensive analytics and reporting

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Backend                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Firestore   │ │ Auth        │ │ Cloud Storage       │   │
│  │ Database    │ │ Service     │ │ (Images/Files)      │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│ Civic Worker   │   │ Department      │   │ Social Media   │
│ Dashboard      │   │ Management      │   │ Platform       │
│ (Next.js)      │   │ (Next.js)       │   │ (React+Vite)   │
└────────────────┘   └─────────────────┘   └────────────────┘
```

## 📱 Applications

### 1. Civic Worker Dashboard

**Location**: `/civic-task-app`

A mobile-first Progressive Web App designed for field workers to manage tasks, report progress, and engage with citizens.

#### Key Features
- **Task Management**: View, accept, and complete assigned tasks
- **Real-time Updates**: Live task status and priority changes
- **Citizen Interaction**: Direct communication with issue reporters
- **Performance Tracking**: Personal metrics and achievement system
- **Offline Capability**: Work without internet connectivity
- **Geolocation**: GPS-based task verification and routing

#### User Roles
- **Field Workers**: Complete tasks, update status, communicate
- **Supervisors**: Monitor team performance, assign tasks
- **Citizens**: Report issues, track progress, provide feedback

#### Core Components
```
app/
├── dashboard/          # Main dashboard with metrics
├── task/[id]/         # Individual task management
├── profile/           # User profile and settings
├── achievements/      # Gamification and rewards
├── chat/             # Communication system
├── reports/          # Issue reporting
└── leaderboard/      # Performance rankings
```

### 2. Department Management System

**Location**: `/civicdepartment`

A comprehensive administrative dashboard for municipal departments to oversee operations, manage resources, and analyze performance.

#### Key Features
- **Multi-Department Support**: Water, Sanitation, Roads, Electricity
- **Task Assignment**: Intelligent task distribution and prioritization
- **Real-time Monitoring**: Live dashboards with KPIs and metrics
- **Resource Management**: Equipment, personnel, and budget tracking
- **Analytics & Reporting**: Comprehensive data visualization
- **Escalation Management**: Automated issue escalation workflows
- **User Management**: Role-based access control

#### User Roles
- **Department Heads**: Strategic oversight and decision making
- **Supervisors**: Operational management and team coordination
- **Administrators**: System configuration and user management
- **Analysts**: Data analysis and reporting

#### Core Modules
```
app/
├── monitoring/        # Real-time dashboard and KPIs
├── task-management/   # Task creation and assignment
├── analytics/         # Data visualization and insights
├── reports/          # Comprehensive reporting system
├── escalation/       # Issue escalation workflows
├── user-management/  # Personnel and role management
├── gamification/     # Performance incentives
└── admin/           # System administration
```

### 3. Social Media Platform

**Location**: `/user`

A citizen-centric social platform that enables community engagement, issue reporting, and civic participation through social features.

#### Key Features
- **Social Feed**: Community posts and civic discussions
- **Issue Reporting**: Photo-based problem reporting with geolocation
- **Progress Tracking**: Real-time updates on reported issues
- **Community Engagement**: Comments, likes, and social interactions
- **Gamification**: Citizen participation rewards and badges
- **Map Integration**: Interactive city map with issue visualization
- **Real-time Chat**: Direct communication with authorities

#### User Experience
- **Citizens**: Report issues, engage with community, track progress
- **Community Leaders**: Moderate discussions, highlight issues
- **Civic Enthusiasts**: Participate in civic activities and campaigns

#### Core Features
```
src/
├── components/
│   ├── Home.jsx          # Social feed and main interface
│   ├── Dashboard.jsx     # Personal dashboard and metrics
│   ├── CreatePost.jsx    # Issue reporting and content creation
│   ├── Profile.jsx       # User profile and achievements
│   └── Championship.jsx  # Gamification and leaderboards
├── Map/
│   └── Map.jsx          # Interactive city map
├── Explore/
│   └── SearchPage.jsx   # Content discovery and search
└── follow/
    ├── follow.jsx       # Social connections
    └── following.jsx    # Following management
```

## 🛠️ Technology Stack

### Frontend Technologies
- **Next.js 14**: React framework with App Router (Worker & Department apps)
- **React 19**: Modern React with hooks and context (Social Media app)
- **Vite**: Fast build tool and development server
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Modern icon library

### Backend & Database
- **Firebase**: Complete backend-as-a-service
  - **Firestore**: NoSQL document database
  - **Authentication**: User management and security
  - **Cloud Storage**: File and image storage
  - **Cloud Functions**: Serverless backend logic
  - **Hosting**: Web application deployment

### Maps & Location
- **Leaflet**: Interactive maps and geolocation
- **React Leaflet**: React integration for maps
- **Google Maps API**: Advanced mapping features
- **OpenCage API**: Geocoding and reverse geocoding

### UI/UX Libraries
- **Recharts**: Data visualization and charts
- **Lottie React**: Smooth animations
- **React Router**: Client-side routing
- **React Hook Form**: Form management
- **Sonner**: Toast notifications

### Development Tools
- **ESLint**: Code linting and quality
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes
- **Vercel Analytics**: Performance monitoring

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** or **pnpm** package manager
- **Firebase Account** with project setup
- **Git** for version control
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Demo_SIH_project-main
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable the following services:
   - Authentication (Email/Password, Google)
   - Firestore Database
   - Cloud Storage
   - Hosting (optional)

3. Create a `.env.local` file in each app directory with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Install Dependencies

#### Civic Worker Dashboard
```bash
cd civic-task-app
npm install
# or
pnpm install
```

#### Department Management System
```bash
cd civicdepartment
npm install
# or
pnpm install
```

#### Social Media Platform
```bash
cd user
npm install
# or
pnpm install
```

### 4. Database Setup

Run the setup scripts to initialize Firestore with sample data:

```bash
# In civicdepartment directory
node lib/setup-users.js
node lib/store-departments.js

# In civic-task-app directory
node create-water-user.js
node add-water-dept.js
```

### 5. Start Development Servers

#### Civic Worker Dashboard
```bash
cd civic-task-app
npm run dev
# Runs on http://localhost:3000
```

#### Department Management System
```bash
cd civicdepartment
npm run dev
# Runs on http://localhost:3001
```

#### Social Media Platform
```bash
cd user
npm run dev
# Runs on http://localhost:5173
```

## ⚙️ Configuration

### Firestore Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tasks are readable by assigned workers and department members
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource.data.assignedTo == request.auth.uid || 
         request.auth.token.role in ['supervisor', 'admin']);
    }
    
    // Posts are publicly readable, writable by authenticated users
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules

Configure Cloud Storage security:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📖 Usage

### For Citizens (Social Media Platform)

1. **Register/Login**: Create account or sign in
2. **Report Issues**: Use camera to capture and report problems
3. **Track Progress**: Monitor status of reported issues
4. **Engage**: Participate in community discussions
5. **Earn Rewards**: Gain points and badges for civic participation

### For Civic Workers (Worker Dashboard)

1. **Login**: Access with worker credentials
2. **View Tasks**: Check assigned tasks and priorities
3. **Update Status**: Mark progress and completion
4. **Communicate**: Chat with supervisors and citizens
5. **Track Performance**: Monitor personal metrics and achievements

### For Department Staff (Management System)

1. **Login**: Access with department credentials
2. **Monitor Operations**: View real-time dashboards
3. **Assign Tasks**: Create and distribute work orders
4. **Analyze Data**: Generate reports and insights
5. **Manage Resources**: Oversee personnel and equipment

## ✨ Features

### 🎮 Gamification System
- **Points & Badges**: Reward system for all user types
- **Leaderboards**: Competitive rankings and achievements
- **Challenges**: Special civic engagement activities
- **Progress Tracking**: Visual progress indicators

### 📊 Analytics & Reporting
- **Real-time Dashboards**: Live KPIs and metrics
- **Performance Analytics**: Individual and team statistics
- **Trend Analysis**: Historical data and patterns
- **Custom Reports**: Configurable reporting system

### 🗺️ Location Services
- **Interactive Maps**: City-wide issue visualization
- **GPS Tracking**: Location-based task verification
- **Route Optimization**: Efficient task scheduling
- **Geofencing**: Location-based notifications

### 💬 Communication System
- **Real-time Chat**: Instant messaging between users
- **Push Notifications**: Important updates and alerts
- **Status Updates**: Automated progress notifications
- **Feedback System**: Citizen satisfaction surveys

## 📚 API Documentation

### Authentication Endpoints
```javascript
// Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Register
POST /auth/register
{
  "email": "user@example.com",
  "password": "password",
  "role": "citizen|worker|supervisor|admin"
}
```

### Task Management
```javascript
// Get tasks
GET /tasks?status=pending&assignedTo=userId

// Update task
PUT /tasks/:taskId
{
  "status": "in_progress|completed",
  "notes": "Progress update"
}

// Create task
POST /tasks
{
  "title": "Fix streetlight",
  "description": "Streetlight not working",
  "priority": "high|medium|low",
  "assignedTo": "workerId"
}
```

### Social Features
```javascript
// Create post
POST /posts
{
  "content": "Issue description",
  "images": ["image1.jpg"],
  "location": { "lat": 22.7196, "lng": 75.8577 }
}

// Get feed
GET /posts?limit=20&offset=0
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all apps work together seamlessly

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Implement responsive design
- Optimize for performance
- Maintain accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for general questions
- **Email**: Contact the development team

## 🚀 Deployment

### Production Build

```bash
# Build all applications
cd civic-task-app && npm run build
cd ../civicdepartment && npm run build
cd ../user && npm run build
```

### Deployment Options

1. **Vercel** (Recommended for Next.js apps)
2. **Firebase Hosting**
3. **Netlify**
4. **AWS Amplify**
5. **Docker Containers**

### Environment Variables

Ensure all production environment variables are properly configured:
- Firebase configuration
- API keys
- Database URLs
- Storage buckets
- Authentication domains

---

**Built with ❤️ for Smart India Hackathon 2025**

*Empowering citizens, streamlining governance, building smarter cities.*
