import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDocs, deleteDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

let app: any;
let db: any;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error("🔥 Error crítico al inicializar Firebase. Posiblemente faltan variables de entorno en Vercel:", error);
}

export interface MessageRecord {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
}

export const memory = {
  async saveMessage(userId: string | number, role: "user" | "assistant" | "system" | "tool", content: string): Promise<void> {
    try {
      await addDoc(collection(db, "conversation_history"), {
        user_id: String(userId),
        role,
        content,
        created_at: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error saving message to Firebase: ", e);
    }
  },

  async getHistory(userId: string | number, limitCount: number = 20): Promise<MessageRecord[]> {
    try {
      const q = query(
        collection(db, "conversation_history"),
        where("user_id", "==", String(userId)),
        orderBy("created_at", "desc"),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const rows: MessageRecord[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        rows.push({
          role: data.role as "user" | "assistant" | "system" | "tool",
          content: data.content,
        });
      });
      // Return chronologically
      return rows.reverse();
    } catch (e) {
      console.error("Error retrieving history from Firebase: ", e);
      return [];
    }
  },

  async clearHistory(userId: string | number): Promise<void> {
    try {
      const q = query(
        collection(db, "conversation_history"),
        where("user_id", "==", String(userId))
      );
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(docSnapshot => 
        deleteDoc(docSnapshot.ref)
      );
      
      await Promise.all(deletePromises);
    } catch (e) {
      console.error("Error clearing history in Firebase: ", e);
    }
  }
};
