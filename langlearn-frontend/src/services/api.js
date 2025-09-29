import { auth } from "./firebase";

// const API_BASE_URL = "https://langlearn-api-production.up.railway.app/api";
const API_BASE_URL = "http://127.0.0.1:8000/api";
const getAuthToken = async () => {
	const user = auth.currentUser;
	if (!user) return null;

	try {
		return await user.getIdToken();
	} catch (error) {
		console.error("Failed to retrieve ID token: ", error);
		return null;
	}
};

const fetchApi = async (endpoint, options = {}) => {
	const token = await getAuthToken();

	const config = {
		method: options.method || "GET",
		headers: {
			"Content-Type": "application/json",
			...(token && { Authorization: `Bearer ${token}` }),
			...options.headers,
		},
		...options,
	};

	const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

	if (!response.ok) {
		throw new Error(`API Error: ${response.status} => ${response.statusText}`);
	}

	return response.json();
};

export default fetchApi;
