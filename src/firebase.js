import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoM4eb4csJ6L1PPGBNSDJHjOqCsCEK8HQ",
  authDomain: "yatraone-5e946.firebaseapp.com",
  projectId: "yatraone-5e946",
  storageBucket: "yatraone-5e946.firebasestorage.app",
  messagingSenderId: "483032869217",
  appId: "1:483032869217:web:f393f6fa801077de0f7d20"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;