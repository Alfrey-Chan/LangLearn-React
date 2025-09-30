import { NavLink, useLocation } from "react-router-dom";
import "./BottomNav.css";
import { UserAuth } from "../../contexts/AuthContext";

const BottomNav = () => {
	const { logout } = UserAuth();

	const location = useLocation();
	const fromSection = location.state?.from;

	const isHome =
		location.pathname === "/home" ||
		fromSection === "home" ||
		(!fromSection &&
			(location.pathname.startsWith("/vocabulary-set") ||
				location.pathname.startsWith("/vocabulary-entry")));

	const isFavourites =
		location.pathname === "/favourites" || fromSection === "favourites";

	const isQuizzes =
		location.pathname === "/my-quizzes" || fromSection === "quizzes";

	const isProfile =
		location.pathname === "/profile" || fromSection === "profile";

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<div className="nav">
				<div className="navbar-main-portion">
					<h1 className="navbar-main-portion__logo">EiHongo</h1>
					<NavLink to="/home" className={`nav-item ${isHome ? "active" : ""}`}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
							<polyline points="9,22 9,12 15,12 15,22" />
						</svg>
						<span className="link-label">Home</span>
					</NavLink>
					<NavLink
						to="/favourites"
						className={`nav-item ${isFavourites ? "active" : ""}`}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path
								d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0
					  0-7.78z"
							/>
						</svg>
						<span className="link-label">Favourites</span>
					</NavLink>
					<NavLink
						to="/my-quizzes"
						className={`nav-item ${isQuizzes ? "active" : ""}`}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
							<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
						</svg>
						<span className="link-label">Quizzes</span>
					</NavLink>
					<NavLink
						to="/profile"
						className={`nav-item ${isProfile ? "active" : ""}`}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
							<circle cx="12" cy="7" r="4" />
						</svg>
						<span className="link-label">Profile</span>
					</NavLink>
				</div>

				<div className="nav-item logout">
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
				</div>
			</div>
		</>
	);
};

export default BottomNav;
