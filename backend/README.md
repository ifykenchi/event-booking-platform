# Project: Event Booking Platform

## Project Description:

Build a full-stack event booking system that allows users to browse and book
events, and enables admins to create, manage, and monitor events and bookings.

## Core Features:

- User Features (Web & Mobile)
- Register/Login
- Browse events (by category, location, date)
- Search/filter/sort events
- View event details (date, venue, seats left, description)
- Book an event (limit booking based on availability)
- View booking history
- Admin Features (Web only)
- Login as Admin
- Create, edit, delete events
- View all bookings per event
- Dashboard (stats: bookings, revenue, popular events)

## Tech Stack

Backend: Node.js, Express.js, TypeScript, MongoDB with Mongoose Web Frontend:
Angular (Admin + User UI) Mobile App: React Native (User UI only)
Authentication: JWT Dev Tools: Postman, GitHub, VSCode Deployment (Optional):
Render (backend), Netlify (Angular), Expo Go/TestFlight (Mobile)

## 4-Week Learning & Development Plan

Each week includes: Learning goals Implementation goals Deliverables

### Week 1: Setup, Authentication, and Database Modeling

#### Learning Goals:

- Understand project requirements
- Learn Git & GitHub collaboration
- Set up Node.js, Express, and MongoDB
- Understand REST APIs
- Learn JWT-based authentication
- Learn Angular basics (components, routing)
- Learn React Native basics (navigation, components)

#### Implementation Goals:

- Backend project structure with Express + TypeScript
- Define Mongoose models: User, Event, Booking
- Implement user authentication routes (/register, /login)
- Angular login/register pages (for users and admins)
- React Native login/register screen (for users)

#### Deliverables:

- Working backend auth APIs (tested in Postman)
- MongoDB connection and seed script
- Angular and React Native login/register UI
- Role-based login (admin vs user)

### Week 2: Events CRUD and UI Integration

#### Learning Goals:

- Master CRUD operations
- Angular Reactive Forms
- Secure API routes with middleware
- Learn to fetch and display data on mobile and web

#### Implementation Goals:

- Admin: Create/Edit/Delete Events (API + Angular Forms)
- User: View all events, filter by date/category (API + UI)
- Add authentication middleware to protect routes
- Pagination (optional)

#### Deliverables:

- Events management APIs (/events, /events/:id)
- Angular admin panel for event management
- Angular user page for viewing events
- React Native screen to list events

### Week 3: Booking System

- Learning Goals:
- Learn relational data modeling (referencing in MongoDB)
- Form handling in Angular and React Native
- Error handling (seat limits, duplicates)

#### Implementation Goals:

- Booking API: POST /bookings with seat availability check
- User booking history API
- Admin: View bookings per event
- UI forms for booking an event

#### Deliverables:

- Booking models and logic
- Angular + React Native booking forms
- Booking history page for users
- Admin: table view of bookings per event

### Week 4: Dashboard, Testing, and Polishing

- Learning Goals:
- Use of aggregations in MongoDB
- Display charts/statistics (Angular)
- Learn basic testing (Postman tests or Jest for backend)
- Deployment basics (optional)

#### Implementation Goals:

##### Admin dashboard with:

- Total events
- Total bookings
- Revenue (mock price field in event or booking)
- Most booked event

- UI cleanup and responsive design
- Deploy backend and frontend (if time permits)

#### Deliverables:

- Admin dashboard stats page (Angular)
- Final working mobile app (React Native)
- Tested and documented API (Swagger or Postman)
- GitHub repo with README + setup instructions

#### Optional Enhancements (Stretch Goals)

- File upload (event images)
- Email confirmation on booking (mock or real with nodemailer)
- Search and filtering with autocomplete
- Booking cancellation and seat restoration
