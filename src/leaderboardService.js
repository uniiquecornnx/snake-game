import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

const LEADERBOARD_COLLECTION = 'leaderboard';

// Add a new score to the leaderboard
export const addScore = async (walletAddress, score) => {
  try {
    const docRef = await addDoc(collection(db, LEADERBOARD_COLLECTION), {
      walletAddress: walletAddress,
      playerName: walletAddress, // Keep for backward compatibility
      score: score,
      timestamp: serverTimestamp(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    });
    console.log('Score added with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding score: ', error);
    throw error;
  }
};

// Get the top scores (for initial load)
export const getTopScores = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, LEADERBOARD_COLLECTION), 
      orderBy('score', 'desc'), 
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const scores = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      scores.push({
        id: doc.id,
        playerName: data.playerName,
        score: data.score,
        date: data.date,
        time: data.time,
        timestamp: data.timestamp
      });
    });
    
    return scores;
  } catch (error) {
    console.error('Error getting scores: ', error);
    throw error;
  }
};

// Subscribe to real-time leaderboard updates
export const subscribeToLeaderboard = (callback, limitCount = 10) => {
  try {
    const q = query(
      collection(db, LEADERBOARD_COLLECTION), 
      orderBy('score', 'desc'), 
      limit(limitCount)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const scores = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        scores.push({
          id: doc.id,
          playerName: data.playerName,
          score: data.score,
          date: data.date,
          time: data.time,
          timestamp: data.timestamp
        });
      });
      callback(scores);
    });
  } catch (error) {
    console.error('Error subscribing to leaderboard: ', error);
    throw error;
  }
};

// Check if a score is a new high score
export const isNewHighScore = async (score) => {
  try {
    const topScores = await getTopScores(1);
    return topScores.length === 0 || score > topScores[0].score;
  } catch (error) {
    console.error('Error checking high score: ', error);
    return false;
  }
};

// Get player's best score
export const getPlayerBestScore = async (playerName) => {
  try {
    const q = query(
      collection(db, LEADERBOARD_COLLECTION),
      orderBy('score', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    let bestScore = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.playerName === playerName && data.score > bestScore) {
        bestScore = data.score;
      }
    });
    
    return bestScore;
  } catch (error) {
    console.error('Error getting player best score: ', error);
    return 0;
  }
}; 