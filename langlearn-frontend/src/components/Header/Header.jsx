import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import "./Header.css";

const Header = () => {
	const { logout } = UserAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const hideBackBtn = [
		"/home",
		"/favourites",
		"/my-quizzes",
		"/profile",
	].includes(location.pathname);

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<header className="header">
			<div className="header-left">
				{!hideBackBtn && (
					<button className="back-btn" onClick={() => navigate(-1)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M15 18l-6-6 6-6" />
						</svg>
					</button>
				)}

				<Link to="/home" className="logo">
					EiHongo
				</Link>
			</div>
			<button
				className="signout-btn btn-secondary"
				aria-label="Sign out"
				onClick={handleLogout}
			>
				Logout
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
				>
					<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
					<polyline points="10 17 15 12 10 7" />
					<line x1="15" y1="12" x2="3" y2="12" />
				</svg>
			</button>
		</header>
	);
};

export default Header;
