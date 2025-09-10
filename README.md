# CyberGuard - Cybersecurity Awareness Game

A modern web application that teaches cybersecurity through interactive games and scenarios.

## Features

- **Interactive Learning**: Hands-on cybersecurity games and simulations
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Modern dark theme with mobile-first approach
- **Game Hub**: Multiple cybersecurity learning modules
- **Progress Tracking**: User progress and achievement system (coming soon)

## Tech Stack

### Frontend
- **Next.js 13+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cyberguard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/cyberguard
   
   # JWT Secrets (change these in production!)
   JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
   
   # Environment
   NODE_ENV=development
   
   # Server
   PORT=3001
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # If using local MongoDB
   mongod
   
   # Or if using MongoDB as a service
   sudo systemctl start mongod
   ```

5. **Run the application**
   
   **Option 1: Run both frontend and backend together**
   ```bash
   npm run dev:full
   ```
   
   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Backend server
   npm run dev:server
   
   # Terminal 2 - Frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Health Check
- `GET /api/health` - Server health status

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── login/             # Login page
│   ├── play-hub/          # Game hub page
│   ├── signup/            # Registration page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── hero-section.tsx  # Hero component
│   └── navigation.tsx    # Navigation component
├── hooks/                # Custom React hooks
│   └── use-auth.ts       # Authentication hook
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   └── utils.ts         # Utility functions
├── server/               # Backend server
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Server utilities
│   └── app.js           # Express app
└── public/              # Static assets
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Access tokens (15min) + Refresh tokens (7 days)
- **HTTP-Only Cookies**: Secure refresh token storage
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Server-side validation with express-validator
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet.js**: Security headers

## Development

### Adding New Games

1. Create game component in `components/games/`
2. Add route in `app/games/[gameId]/`
3. Update Play Hub with new game card
4. Implement game logic and scoring

### Database Models

The User model includes:
- Basic profile information (name, email)
- Authentication data (password hash, refresh token)
- User preferences and progress tracking
- Role-based access control

## Deployment

### Frontend (Vercel/Netlify)
1. Build the Next.js app: `npm run build`
2. Deploy to your preferred platform
3. Update CORS settings in backend

### Backend (Railway/Heroku/DigitalOcean)
1. Set up MongoDB Atlas or cloud database
2. Configure environment variables
3. Deploy Express server
4. Update frontend API URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@cyberguard.com or create an issue in the repository.