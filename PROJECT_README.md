# Nature Vision - Color Vision Enhancement App

A beautiful, nature-themed mobile-responsive web application that helps users enhance their color vision through personalized cone sensitivity testing and adaptive color rendering.

## 🌿 Features

### 1. **Cone Contrast Test**
- Scientifically designed test to measure L-cone (red), M-cone (green), and S-cone (blue) sensitivities
- Interactive color matching and pattern recognition questions
- Results displayed as percentage scores (0-100%)

### 2. **Adaptive Color Rendering**
- Personalized color adjustments based on your unique cone sensitivity profile
- Real-time color adaptation algorithm
- Visual before/after comparison in the Color Simulator

### 3. **Performance Test Games**
- **Color Match Game**: Find the matching color as quickly as possible
- **Pattern Recognition**: Identify all tiles with matching colors
- 30-second timed challenges with scoring
- Track improvement over time

### 4. **User Dashboard**
- View your cone sensitivity results
- Track performance statistics
- Monitor improvement rate
- Quick access to all features

### 5. **Color Simulator**
- Preview how colors adapt to your vision profile
- Toggle between original and adapted views
- Nature scene demonstrations
- Real-time color adjustments

## 🎨 Nature Theme Design

The app features a beautiful nature-inspired color palette:
- **Forest Green** (#2D5016, #4A7C23, #6BA539)
- **Sky Blue** (#87CEEB, #4A90A4)
- **Earth Tones** (#8B7355, #C2B280)
- **Sunrise/Sunset** (#FFB347, #FF6B6B)

## 🚀 Technology Stack

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Framer Motion for animations
- Lucide React for icons
- Tailwind CSS for styling

### Backend
- FastAPI (Python)
- MongoDB for data storage
- Pydantic for data validation
- uvicorn as ASGI server

## 📱 Mobile Responsive

- Fully responsive design works on all devices
- Touch-friendly interface
- Optimized for mobile, tablet, and desktop

## 🔬 Color Vision Science

The app uses scientifically-based algorithms to:
1. Measure cone sensitivity through contrast testing
2. Calculate personalized color adjustments
3. Apply adaptive rendering based on user's visual profile

### Cone Sensitivity Interpretation
- **L-Cone (Red)**: Measures sensitivity to long wavelengths (red)
- **M-Cone (Green)**: Measures sensitivity to medium wavelengths (green)
- **S-Cone (Blue)**: Measures sensitivity to short wavelengths (blue)

### Adaptive Algorithm
- If L-cone < 50%: Reduce red reliance, increase contrast
- If M-cone < 50%: Fine-tune green shades for better separation
- If S-cone < 50%: Shift away from blue-yellow differentiations

## 📊 API Endpoints

### Users
- `POST /api/users` - Create new user
- `GET /api/users/{user_id}` - Get user details
- `GET /api/users` - Get all users

### Cone Tests
- `POST /api/cone-tests` - Save cone test results
- `GET /api/cone-tests/{user_id}` - Get all tests for user
- `GET /api/cone-tests/{user_id}/latest` - Get latest test

### Performance Tests
- `POST /api/performance-tests` - Save performance test
- `GET /api/performance-tests/{user_id}` - Get all tests
- `GET /api/performance-tests/{user_id}/stats` - Get statistics

### Color Adaptation
- `POST /api/color-adaptation` - Get adaptation recommendations

## 🎮 Game Mechanics

### Color Match Game
- 10 rounds of color matching
- 30-second time limit
- +10 points for correct match
- -2 points for incorrect match

### Pattern Recognition Game
- 10 rounds of pattern identification
- Select all matching colored tiles
- +5 points per correct selection
- +20 bonus for perfect round

## 💾 Data Storage

User data is stored in MongoDB with the following collections:
- **users**: User profiles
- **cone_tests**: Cone sensitivity test results with timestamps
- **performance_tests**: Performance test scores and timing

## 🌐 Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/api
- API Docs: http://localhost:8001/docs

## 🔧 Development

### Start Services
```bash
sudo supervisorctl restart all
```

### Check Status
```bash
sudo supervisorctl status
```

### View Logs
```bash
# Backend logs
tail -f /var/log/supervisor/backend.out.log

# Frontend logs
tail -f /var/log/supervisor/frontend.out.log
```

## 📝 Future Enhancements

- Multiple language support
- More test variations
- Social sharing of improvements
- Downloadable reports
- Advanced color blindness simulations
- Multiplayer game modes

## 🎯 User Journey

1. **Landing**: Create account or sign in
2. **Cone Test**: Complete 9-question calibration test
3. **Dashboard**: View results and access features
4. **Simulator**: Preview adapted colors
5. **Performance Tests**: Play games to test improvement
6. **Track Progress**: Monitor statistics over time

---

Built with ❤️ and inspired by nature 🌳
