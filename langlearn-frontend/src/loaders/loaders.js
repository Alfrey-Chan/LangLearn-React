import fetchApi from "../services/api";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { redirect } from "react-router-dom";

// High order function to ensure loaders are only fetching if authenticated
const withAuth = (loaderFunction) => {
	return async (args) => {
		const user = await waitForAuth();
		if (!user) throw redirect("/login");
		return loaderFunction(args);
	};
};

// Helper function to wait for auth
const waitForAuth = () => {
	return new Promise((resolve) => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			unsubscribe();
			resolve(user);
		});
	});
};

// Home Page Loader
export const homeLoader = withAuth(async ({ params }) => {
	await waitForAuth();

	try {
		const data = await fetchApi("/vocabulary-sets");
		return data;
	} catch (error) {
		console.log(error);
		throwResponse("Home Loader", error.statusCode);
	}
});

// Vocabulary Set Page Loader
export const vocabularySetLoader = async ({ params }) => {
	await waitForAuth();

	try {
		const data = await fetchApi(`/vocabulary-sets/${params.id}`);
		return data;
	} catch (error) {
		console.log(error);
		throwResponse("Vocabulary Set Loader", error.statusCode);
	}
};

// Quiz Page Loader
export const quizLoader = async ({ params }) => {
	await waitForAuth();

	try {
		const data = await fetchApi(`/quizzes/${params.id}`);
		return data;
	} catch (error) {
		console.log(error);
		throwResponse("Quiz Loader", error.statusCode);
	}
};

// Favourites Page Loader
export const favouriteLoader = async ({ params }) => {
	await waitForAuth();

	try {
		const data = await fetchApi("/favourites/");
		return data;
	} catch (error) {
		console.log(error);
		throwResponse("Favourite Loader", error.statusCode);
	}
};

// My Quizzes Page Loader
export const myQuizzesLoader = async ({ params }) => {
	await waitForAuth();

	try {
		const data = await fetchApi("/my-quizzes/");
		return data;
	} catch (error) {
		console.log(error);
		throwResponse("My Quizzes Loader", error.statusCode);
	}
};

// Profile Loader
export const profileLoader = async ({ params }) => {
	await waitForAuth();

	try {
		const data = await fetchApi("/profile");
		return data;
	} catch (error) {
		console.log(error);
		throwResponse("My Profile Loader", error.statusCode);
	}
};

// Entry Loader
export const entryLoader = async ({ params }) => {
	await waitForAuth();

	try {
		const data = await fetchApi(`/vocabulary-entries/${params.id}`);
		return data;
	} catch (error) {
		throwResponse("Entry Loader", error.statusCode);
	}
};

const throwResponse = (loaderType, statusCode) => {
	switch (statusCode) {
		case 400:
			throw new Response(`${loaderType}: Bad Request.`, { status: 400 });
		case 401:
			throw new Response(`${loaderType}: Unauthorized.`, { status: 401 });
		case 403:
			throw new Response(
				`${loaderType}: You don't have permission to access this`,
				{ status: 403 }
			);
		case 404:
			throw new Response(`${loaderType}: Not found.`, { status: 404 });
		case 429:
			throw new Response(
				`${loaderType}: Too many requests, please try again later`,
				{ status: 429 }
			);
		case 500:
			throw new Response(`${loaderType}: Server error`, { status: 500 });
	}
};
