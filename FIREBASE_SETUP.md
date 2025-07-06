# 🔥 Firebase Setup Guide for Global Leaderboard

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "snake-game-leaderboard")
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Add Web App

1. In your Firebase project, click the web icon (</>) 
2. Register app with nickname (e.g., "snake-game-web")
3. Copy the configuration object

## Step 3: Update Firebase Config

Replace the placeholder values in `src/firebase.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 4: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

## Step 5: Set Up Security Rules

In Firestore Database → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document} {
      allow read: if true;  // Anyone can read leaderboard
      allow write: if true; // Anyone can write scores (for demo)
    }
  }
}
```

## Step 6: Test the Setup

1. Run your app: `npm start`
2. Play a game and check if scores are saved
3. Check Firebase Console → Firestore Database to see data

## 🔒 Production Security (Optional)

For production, update Firestore rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document} {
      allow read: if true;
      allow write: if request.resource.data.score is int 
                   && request.resource.data.score > 0
                   && request.resource.data.playerName is string
                   && request.resource.data.playerName.size() > 0
                   && request.resource.data.playerName.size() <= 50;
    }
  }
}
```

## 🚀 Deploy to Production

1. Build your app: `npm run build`
2. Deploy to Firebase Hosting:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

## 📊 Monitor Usage

- Check Firebase Console → Usage and billing
- Monitor Firestore Database → Usage
- Set up alerts for high usage

## 🎯 Features Now Available

✅ **Global Leaderboard**: Scores from players worldwide  
✅ **Real-time Updates**: See new scores instantly  
✅ **Persistent Data**: Scores stored in cloud database  
✅ **Scalable**: Handles unlimited players  
✅ **Secure**: Firebase handles security and scaling  

## 🔧 Troubleshooting

**Error: "Firebase: Error (auth/unauthorized)"**
- Check if Firestore rules allow read/write
- Verify API key is correct

**Error: "Firebase: Error (firestore/unavailable)"**
- Check internet connection
- Verify project ID is correct

**Scores not appearing:**
- Check browser console for errors
- Verify Firestore collection name is "leaderboard"
- Check if database is in test mode

## 📈 Next Steps

1. **Add Authentication**: Require login to submit scores
2. **Rate Limiting**: Prevent spam submissions
3. **Data Validation**: Ensure score integrity
4. **Analytics**: Track game statistics
5. **Multiplayer**: Real-time competitive play

Your snake game now has a global leaderboard! 🐍🏆 