import { initializeApp } from "firebase/app";
import {
	getAuth,
	setPersistence,
	browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyDWxZ_wMLKKHa0edWlBKhWoRe_K65cNGq8",
	authDomain: "langlearn-a53cd.firebaseapp.com",
	projectId: "langlearn-a53cd",
	storageBucket: "langlearn-a53cd.firebasestorage.app",
	messagingSenderId: "25224987204",
	appId: "1:25224987204:web:8bc2db10b69b0437843211",
	measurementId: "G-C8WY87KE1V",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);
