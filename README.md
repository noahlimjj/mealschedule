# Meal Schedule App

A minimalist, aesthetic web application for tracking lunch and dinner schedules across teams. Built with React, TypeScript, and Firebase.

## Features

- **Weekly Calendar View** - Shows current week (Monday to next Monday)
- **Group Management** - Create groups with up to 10 users
- **Real-time Sync** - Changes appear instantly across all devices (with Firebase)
- **Meal Tracking** - Track lunch and dinner for each day
- **Multi-user Support** - Everyone in the group can see each other's meal schedules
- **Minimalist Design** - Clean, aesthetic interface using Satoshi font
- **Responsive Layout** - Works on desktop and mobile devices
- **Persistent Storage** - Data saved locally or in Firebase cloud

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Font:** Satoshi
- **Database:** Firebase Firestore (optional, falls back to LocalStorage)
- **Deployment:** Netlify-ready

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- (Optional) Firebase account for real-time sync

### Installation

1. Clone the repository:

```bash
git clone https://github.com/noahlimjj/mealschedule.git
cd mealschedule
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Using LocalStorage (Default)

By default, the app uses LocalStorage to save data in your browser. This works offline but data is not synced across devices.

## Using Firebase (Real-time Sync)

To enable real-time synchronization across devices:

1. Follow the detailed guide in [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
2. Create a `.env` file with your Firebase credentials
3. Update [src/main.tsx](src/main.tsx) to use `MealContextFirebase`

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for complete instructions.

## Project Structure

```
Meal_Schedule_App/
├── src/
│   ├── components/         # React components
│   │   ├── GroupSetup.tsx  # Initial group creation
│   │   ├── UserSelector.tsx # User selection interface
│   │   └── MealGrid.tsx    # Main meal tracking grid
│   ├── context/            # State management
│   │   ├── MealContext.tsx         # LocalStorage version
│   │   └── MealContextFirebase.tsx # Firebase version
│   ├── firebase/           # Firebase configuration
│   │   ├── config.ts       # Firebase initialization
│   │   └── firestore.ts    # Firestore operations
│   ├── types/              # TypeScript definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   └── dateUtils.ts    # Date handling
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── FIREBASE_SETUP.md       # Firebase setup guide
└── README.md              # This file
```

## Usage

### Creating a Group

1. When you first open the app, you'll see the group setup screen
2. Enter a group name (e.g., "Office Team")
3. Enter your name
4. Click "Create Group"

### Adding Users

1. Click the "+ Add User" button
2. Enter the user's name
3. Click "Add"
4. Repeat for up to 10 users

### Tracking Meals

1. Select your user from the user selector
2. Check or uncheck the lunch/dinner boxes for each day
3. Other users' meal selections are visible but read-only

### Viewing the Schedule

- The current day is highlighted in blue
- Each user has a color-coded indicator
- View all users' meal plans for the entire week at a glance

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

### Deploying to Netlify

1. Push your code to GitHub
2. Log in to [Netlify](https://www.netlify.com/)
3. Click "Add new site" > "Import an existing project"
4. Connect your GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. If using Firebase, add environment variables in Netlify:
   - Go to Site settings > Environment variables
   - Add all `VITE_FIREBASE_*` variables

### Other Deployment Options

This app can be deployed to:
- Vercel
- GitHub Pages
- Any static hosting service

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Switching Between LocalStorage and Firebase

Edit [src/main.tsx](src/main.tsx):

```typescript
// For LocalStorage:
import { MealProvider } from './context/MealContext.tsx'

// For Firebase:
import { MealProvider } from './context/MealContextFirebase.tsx'
```

## Future Enhancements

- [ ] User authentication
- [ ] Multiple groups per user
- [ ] Export schedule to CSV/PDF
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Custom meal types
- [ ] Recurring schedules

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions:
- Check [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for Firebase-related issues
- Open an issue on GitHub
- Review the console for error messages

## Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Font: [Satoshi](https://www.fontshare.com/fonts/satoshi)
- Database: [Firebase](https://firebase.google.com/)

---

Made with ❤️ for teams who eat together
