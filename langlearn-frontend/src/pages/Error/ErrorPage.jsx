import { useRouteError } from "react-router-dom";

export const ErrorPage = () => {
	const error = useRouteError();

	return (
		<div className="error-page">
			<h2>Error {error.status}</h2>
			<p>{error.statusText || "Something went wrong."}</p>
		</div>
	);
};
