# Digital Wallet Frontend

![Digital-Wallet-System-Frontend Screenshot](https://res.cloudinary.com/djx2qopcz/image/upload/v1757256676/Digital-Wallet-System-Frontend_zyrvbq.png)

## 🎯 Project Overview

This project is a secure, role-based, and user-friendly frontend application for a Digital Wallet System, similar to bKash or Nagad, built using React.js, Redux Toolkit, RTK Query, and TypeScript. It consumes a backend API (mocked or provided) to enable seamless financial operations and wallet management for Users, Agents, and Admins. The application features a responsive UI, polished UX, role-based dashboards, and a public landing section accessible without login.

The codebase follows best practices for modularity, reusability, and clean code. It includes robust state management, API integration, form validations, data visualizations, toast notifications, and a guided tour for new users.

## Live Site

[Visit Digital Wallet Live Site](https://digital-wallet-system-frontend.vercel.app)

## Backend Link

[Visit Digital Wallet Backend Link](https://digital-wallet-system-backend-two.vercel.app/)


## Admin Credentials

- **Email**: admin@example.com
- **Password**: Admin123!


## Agent Credentials

- **Email**: agent@exam.com
- **Password**: Agent123!


## User Credentials

- **Email**: user@example.com
- **Password**: User123!

## Features

- **Public Landing Section**
 -Home Page: Polished landing page with a sticky, theme-colored navigation bar, a hero banner with tagline and call-to-action buttons, and a matching footer. Includes skeleton loading, smooth transitions, and responsiveness.
 - About Page: Details the service’s story, mission, and team.
 - Features Page: Showcases wallet features with visuals/icons.
 - Contact Page: Simulated inquiry form submission.
 - FAQ Page: Common questions and answers.

**Authentication**
- Login with JWT-based authentication.
- Registration with role selection (User or Agent).
- Role-based redirection after login.
- Persisted authentication state (remains logged in after refresh).
- Logout functionality.

**User Dashboard**
- Displays wallet balance, quick actions, and recent transactions.
- Supports deposit, withdrawal, and sending money to other users (search by phone/email).
- Transaction history with pagination and filtering by type/date range.
- Profile management for updating name, phone, and password.

**Agent Dashboard**
- Shows cash-in/out summary and recent activity.
- Allows adding or withdrawing money from a user’s wallet.
- Displays all transactions handled by the agent.
- Profile management for updating personal info and password.

**Admin Dashboard**
- Provides an overview of total users, agents, transaction count, and volume.
- Manages users (view, block/unblock) and agents (approve, suspend).
- Displays all transactions with advanced filters and pagination.
- Profile management for updating admin account settings.

**General Features**
- Role-Based Navigation: Different menus for each role.
- Loading & Error Handling: Global loading indicators and error handling.
- Form Validations: Ensures required fields, numeric checks, and positive amounts.
- Data Visualization: Dynamic cards, bar charts, pie charts, and tables.
- Toast Notifications: Success/error messages using a toast library.
- Guided Tour: 5-step tour using react-joyride, highlighting key features (navigation, stats, charts, table filters, theme toggle). Runs once for new users with a "Restart Tour" option in settings.

**UI/UX Considerations**
- Fully responsive design for all devices.
- Consistent margins, spacing, and typography.
- Clear color theme with no clashing combinations (light/dark mode support).
- Lazy-loading and skeleton loaders for performance.
- Accessibility standards met.
- Realistic data used for a professional finish.


## Technology Stack

**Frontend**
- React: UI library for building components.
- React Router: For navigation and routing.
- Redux Toolkit & RTK Query: State management and API integration.
- TypeScript: Type-safe JavaScript for better maintainability.
- Tailwind CSS: Utility-first CSS framework for styling.
- react-joyride: For guided tour functionality.
- Toast Library: For success/error notifications.


## 📦 Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- npm 
- Git

### 🔧 Installation
1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd digital-wallet-frontend

2. **Install Dependencies:**

   ```bash
   npm install
3. **Set Up Environment Variables:
Create a `.env` file in the project root and add the following variables:**

   ```bash
   VITE_API_BASE_URL=http://localhost:5000/api/v1
    ```

4. **Run the Application:**

   ```bash
   npm run dev
   ````

5. Access the app at http://localhost:3000.



### Future Improvements
- Add pricing page with subscription tiers.
- Implement commission history for agents.
- Allow admins to adjust system fees/limits.
- Enhance data visualizations with more interactive charts.
- Add multi-language support for accessibility.
- Add Notification System.


