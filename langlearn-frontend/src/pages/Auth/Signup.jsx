import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import VisibilityToggle from "../../components/VisibilityToggle";
import { UserAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const Signup = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setLoading] = useState(false);

	const navigate = useNavigate();
	const { user, emailSignUp } = UserAuth();

	const handleEmailSignup = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const result = await emailSignUp(email, password, confirmPassword);
			console.log(result);
			toast.success(result);
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user && !isLoading) navigate("/home");
	}, [user, isLoading]);

	return (
		<div className="page-center">
			<div className="container">
				<div className="auth-header">
					<h1 className="logo">EiHongo</h1>
					<h2 className="heading">Create your account</h2>
					<p className="heading-subtext">
						We'll send you a verification email.
					</p>
				</div>

				<form onSubmit={handleEmailSignup}>
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
						></input>
					</div>

					<div className="input-row">
						<div className="input-group">
							<label htmlFor="password">Password</label>
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								className="input-field"
								placeholder="Enter your password"
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

					<div className="input-row">
						<div className="input-group">
							<label htmlFor="confirm-password">Confirm password</label>
							<input
								type={showPassword ? "text" : "password"}
								id="confirm-password"
								className="input-field"
								placeholder="Re-enter your password"
								autoComplete="new-password"
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
							<VisibilityToggle
								isVisible={showPassword}
								onToggle={() => setShowPassword(!showPassword)}
							/>
						</div>
					</div>
				</form>

				<p className="forgot-password">
					By continuing, you agree to our <span className="terms">Terms </span>{" "}
					and
					<span className="terms"> Privacy Policy</span>
				</p>

				<button type="submit" className="submit-btn" disabled={isLoading}>
					{isLoading ? "Creating account..." : "Create account"}
				</button>
				<div className="footer">
					Already have an account?{" "}
					<Link to="/login">
						<span className="link">Sign in</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Signup;
