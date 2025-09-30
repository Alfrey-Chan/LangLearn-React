import { useContext, createContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import fetchApi from "../services/api";
import {
	GoogleAuthProvider,
	signInWithPopup,
	signInWithRedirect,
	signOut,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	sendEmailVerification,
	createUserWithEmailAndPassword,
	getAuth,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const googleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		const userCredentials = await signInWithPopup(auth, provider);

		const token = await userCredentials.user.getIdToken();
		const response = await fetchApi("/auth/firebase-login", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return { firebaseUser: userCredentials.user, apiResponse: response };
	};

	const handleExistingEmail = async (email, password) => {
		try {
			const signInResult = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = signInResult.user;

			if (!user.emailVerified) {
				await sendEmailVerification(user);
				await signOut(auth);
				return "Please check your inbox for an email verification link.";
			} else {
				await signOut(auth);
				throw new Error(
					"An account with this email already exists. Please sign in instead."
				);
			}
		} catch (error) {
			throw error;
		}
	};

	const emailSignUp = async (email, password, confirmPassword) => {
		if (password !== confirmPassword) {
			throw new Error("Passwords don't match!");
		}

		try {
			const userCredentials = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			await sendEmailVerification(userCredentials.user);
			await signOut(auth);
			return "A verification email has been sent. Please check your email.";
		} catch (error) {
			console.log(error);
			if (error.code === "auth/email-already-in-use") {
				return await handleExistingEmail(email, password);
			}
			throw error;
		}
	};

	const getAuthErrorMessage = (error) => {
		if (error.message.includes("verify your email")) {
			return error.message;
		}

		switch (error.code) {
			case "auth/invalid-credential":
			case "auth/invalid-email":
			case "auth/wrong-password":
				return "Invalid email or password. Please try again.";
			case "auth/user-not-found":
				return "No account found with this email address.";
			case "auth/too-many-requests":
				return "Too many failed attempts. Please try again later.";
			default:
				return error.message; // Use original Firebase message
		}
	};

	const emailLogin = async (email, password) => {
		try {
			const userCredentials = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);

			// handle unverified emails
			if (!userCredentials.user.emailVerified) {
				await signOut(auth);

				try {
					await sendEmailVerification(userCredentials.user);
					throw new Error(
						"Please verify your email. A verification email has been sent."
					);
				} catch (verificationError) {
					if (verificationError.code === "auth/too-many-requests") {
						throw new Error("Too many requests. Please try again later.");
					}
					throw new Error(
						"Please verify your email. Check your inbox for the verification link."
					);
				}
			}

			const token = await userCredentials.user.getIdToken();
			const response = await fetchApi("/auth/firebase-login", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return { firebaseUser: userCredentials.user, apiResponse: response };
		} catch (error) {
			throw new Error(getAuthErrorMessage(error));
		}
	};

	const logout = () => {
		signOut(auth);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});
		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{ emailSignUp, emailLogin, googleSignIn, logout, user }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
