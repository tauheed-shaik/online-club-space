# Online Club Space

Online Club Space is a fully functional web application built on the MERN stack (MongoDB, Express, React, Node.js) that helps people discover, manage, and book exclusive club events. 

## Features
- **User Authentication:** Registration and Login functionality with securely hashed passwords using `bcrypt` and handled via `JWT`.
- **Event Discovery:** Filter and search through various events based on the amount of guests, destination, or dates.
- **Premium UI & UX:** Aesthetic layout using custom-built glassmorphism design, vibrant color overlays, seamless transition animations, and a responsive structure.
- **Booking System:** Dynamic booking capability validating availability bounds including time slots and maximum group size.
- **Reviews & Ratings:** Ability for users to comment, leave visual star ratings, and read others' impressions on upcoming or past events.
- **Admin Dashboard:** Access-restricted dashboard granting capabilities to add, edit, or delete events, additionally checking registered bookings and their statuses.

## Tech Stack
**Frontend:**
* React.js
* React Router DOM
* CSS Modules (Custom Vanilla CSS, Responsive & Animations enabled)

**Backend:**
* Node.js
* Express.js 
* MongoDB / Mongoose

**Authentication & Security:**
* JWT (JSON Web Tokens)
* bcrypt.js

## Quick Start & Installation 

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tauheed-shaik/online-club-space.git
   cd online-club-space
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup:**
   ```bash
   cd ./client
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file within the `server` directory containing the following:
   ```env
   # SERVER SPECIFIC 
   PORTNO=8000
   
   # MONGODB CONNECTION STRING
   MONGODB_URL=your_mongo_url_here
   
   # JSON WEB TOKEN SECRET
   JWT_SECRET_KEY=any_complex_secret_string
   ```

5. **Start Application:**
   Run the backend first inside `/server`:
   ```bash
   npm start
   ```
   Run the frontend application in another terminal inside `/client`:
   ```bash
   npm run dev
   ```

## Admin Access
An admin panel is available (`/admin`) protecting critical database management endpoints. Only user accounts provided with an `admin` role parameter in your MongoDB can view this tab. 

**Default Gen:**
```text
Email: admin@club.com
Password: admin123
```

## Authors
Designed and Developed by the **Developer**. 

---
*If you have any feedback or come across bugs, please reach out or open a pull request!*
