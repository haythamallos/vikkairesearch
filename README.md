# Vikk Dashboard

A modern, responsive dashboard application built with HTML5, CSS3, and Express.js. Features include user authentication, real-time data visualization, and a beautiful UI design.

## Features

- 🔐 **User Authentication** - JWT-based login system with hardcoded credentials
- 📊 **Interactive Dashboard** - Real-time statistics and data visualization
- 📈 **Charts & Graphs** - Revenue and user growth charts using Chart.js
- 📱 **Responsive Design** - Mobile-friendly interface
- 🎨 **Modern UI** - Clean, professional design with smooth animations
- 🔄 **Auto-refresh** - Dashboard data updates automatically every 30 seconds

## Demo Credentials

The application comes with three pre-configured user accounts:

| Username | Password | Role |
|----------|----------|------|
| `admin`  | `admin123` | Admin |
| `user`   | `user123`  | User |
| `demo`   | `demo123`  | User |

## Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
vikk-dashboard/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styles
│   └── script.js       # Frontend JavaScript
├── server.js           # Express.js server
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## API Endpoints

- `POST /api/login` - User authentication
- `GET /api/dashboard` - Dashboard data (protected)
- `GET /api/profile` - User profile (protected)

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **Styling**: CSS Grid, Flexbox, CSS Variables

## Customization

### Adding New Users

To add new users, modify the `users` array in `server.js`:

```javascript
const users = [
  // ... existing users
  {
    id: 4,
    username: 'newuser',
    password: '$2a$10$...', // Use bcrypt to hash passwords
    role: 'user'
  }
];
```

### Modifying Dashboard Data

Update the mock data in the `/api/dashboard` endpoint in `server.js` to customize the statistics and charts.

### Styling Changes

Modify `public/styles.css` to customize colors, fonts, and layout. The application uses CSS custom properties for easy theming.

## Security Notes

⚠️ **Important**: This is a demo application with hardcoded credentials and JWT secrets. For production use:

- Store user credentials in a secure database
- Use environment variables for sensitive data
- Implement proper password hashing
- Add rate limiting and input validation
- Use HTTPS in production

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

To run the application in development mode with auto-restart:

```bash
npm run dev
```

This requires `nodemon` to be installed globally or as a dev dependency.

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, change the PORT variable in `server.js`:

```javascript
const PORT = process.env.PORT || 3001; // Change to 3001 or another port
```

### Module Not Found Errors
Ensure all dependencies are installed:

```bash
npm install
```

### Charts Not Displaying
Check the browser console for JavaScript errors and ensure Chart.js is loading properly.

## License

MIT License - feel free to use this project for learning and development purposes.

## Contributing

This is a demo project, but suggestions and improvements are welcome!


