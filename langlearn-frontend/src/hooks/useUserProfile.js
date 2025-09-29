import { useState, useEffect } from "react";
import fetchApi from "../services/api";

export const useUserProfile = () => {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getProfile = async () => {
			try {
				const data = await fetchApi("/profile");
				setProfile(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		getProfile();
	}, []);

	return { profile, loading };
};
