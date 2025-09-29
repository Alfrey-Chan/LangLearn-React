import { useState } from "react";

const VisibilityToggle = ({ isVisible, onToggle }) => {
	return (
		<button
			type="button"
			className={`visibility-toggle ${isVisible ? "active" : ""}`}
			onClick={onToggle}
			aria-label={isVisible ? "Hide password" : "Show password"}
		>
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				{isVisible ? (
					// Hidden eye (eye-off) - show when password is visible
					<>
						<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
						<circle cx="12" cy="12" r="3" />
					</>
				) : (
					// Normal eye - show when password is hidden
					<>
						<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z" />
						<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-6.84-6.84z" />
						<path d="M1 1l22 22" />
					</>
				)}
			</svg>
		</button>
	);
};

export default VisibilityToggle;
