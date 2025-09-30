import { useEffect, useState } from "react";
import { UserAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";
import "../../index.css";
import VisibilityToggle from "../../components/VisibilityToggle";
import toast from "react-hot-toast";

const Login = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { googleSignIn, emailLogin, user } = UserAuth();
	const navigate = useNavigate();

	const handleGoogleSignIn = async () => {
		try {
			const result = await googleSignIn();
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const handleEmailSignIn = async (email, password) => {
		setIsLoading(true);

		try {
			const result = await emailLogin(email, password);
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (user && !isLoading) {
			navigate("/");
		}
	}, [user, isLoading]);

	return (
		<div className="page-center">
			<div className="container">
				<div className="auth-header">
					<h1 className="logo">EiHongo</h1>
					<h2 className="heading">Sign in</h2>
					<p className="heading-subtext">
						Choose a provider or use email & password
					</p>
					<button className="auth-provider-btn" onClick={handleGoogleSignIn}>
						<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
							<path
								fill="#FFC107"
								d="M43.6 20.5H42V20H24v8h11.3C33.7 31.7 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.4 5.1 29.5 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.5 0 20-7.6 20-21 0-1.2-.1-2.3-.4-3.5z"
							/>
							<path
								fill="#FF3D00"
								d="M6.3 14.7l6.6 4.8C14.7 16.9 18.9 14 24 14c3 0 5.8 1.1 7.9 3l5.7-5.7C34.4 7.1 29.5 5 24 5 16.3 5 9.6 9.4 6.3 14.7z"
							/>
							<path
								fill="#4CAF50"
								d="M24 43c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 33.8 26.7 35 24 35c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.4 38.6 16.1 43 24 43z"
							/>
							<path
								fill="#1976D2"
								d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.8-4.8 7-9.3 7-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.4 38.6 16.1 43 24 43c10.5 0 20-7.6 20-21 0-1.2-.1-2.3-.4-3.5z"
							/>
						</svg>
						Continue with Google
					</button>

					<button
						className="auth-provider-btn apple"
						onClick={() => {
							toast("Apple sign in coming soon!");
						}}
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-hidden="true"
						>
							<path d="M16.365 1.43c0 1.14-.476 2.202-1.23 2.98-.79.816-2.08 1.45-3.17 1.37-.144-1.1.454-2.23 1.21-3 .79-.81 2.16-1.39 3.19-1.35zM21.5 17.23c-.61 1.41-.9 2.04-1.69 3.29-1.1 1.68-2.66 3.78-4.58 3.79-1.07.01-1.35-.71-3.06-.71-1.71 0-2.02.71-3.09.72-1.93.02-3.42-1.89-4.52-3.56-3.11-4.72-3.44-10.26-1.52-13.19C4.13 5.63 5.77 4.63 7.6 4.61c1.89-.02 3.09 1.01 4.65 1.01 1.55 0 2.51-1.01 4.66-1 1.52 0 3.13.83 4.1 2.25-3.6 1.98-3.02 7.1.49 9.36z" />
						</svg>
						Continue with Apple
					</button>
				</div>

				<div className="divider">or</div>

				<form>
					<div className="input-row">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							className="input-field"
							placeholder="eihongo@example.com"
							autoComplete="username"
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="input-row">
						<div className="input-group">
							<label htmlFor="password">Password</label>
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								className="input-field"
								placeholder="Password"
								autoComplete="current-password"
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<VisibilityToggle
								isVisible={showPassword}
								onToggle={() => setShowPassword(!showPassword)}
							/>
						</div>
					</div>
				</form>
				<p className="forgot-password">Forgot password?</p>
				<button
					className="submit-btn"
					onClick={() => handleEmailSignIn(email, password)}
				>
					Sign in
				</button>
				<div className="footer">
					Don't have an account?{" "}
					<Link to="/signup">
						<span className="link">Sign up</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
