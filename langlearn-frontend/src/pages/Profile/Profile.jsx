import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import "./Profile.css";
import toast from "react-hot-toast";
import fetchApi from "../../services/api";

const Profile = () => {
	const profileData = useLoaderData();
	const user = profileData.user;
	const userStats = user.user_stats;

	const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
	const [selectedNative, setSelectedNative] = useState(
		user.native_language || "jp"
	);
	const [selectedLearning, setSelectedLearning] = useState(
		user.learning_language || "en"
	);

	const getLanguageDisplay = (lang) => {
		return lang === "jp" ? "日本語" : "English";
	};

	const getLanguageFlag = (lang) => {
		return lang === "jp" ? "🇯🇵" : "🇺🇸";
	};

	const handleLanguageUpdate = async () => {
		const sameLanguages = selectedLearning === selectedNative;
		if (sameLanguages) {
			toast.error("異なる言語を選択してください", { id: "same-languages" });
			return;
		}

		toast("言語設定機能は開発中です。", { id: "in-development" });

		// try {
		// 	await fetchApi("/profile/languages", {
		// 		method: "PUT",
		// 		body: JSON.stringify({
		// 			native_language: selectedNative,
		// 			learning_language: selectedLearning,
		// 		}),
		// 	});

		// 	toast.success("言語設定を更新しました", { id: "update-languages" });
		// 	setIsLanguageModalOpen(false);
		// 	// TODO:: Update app language settings
		// 	window.location.reload();
		// } catch (error) {
		// 	toast.error(error.message, { id: "update-languages" });
		// }
	};

	return (
		<div className="profile-container">
			<div className="profile-header">
				<h1 className="page-title">プロフィール</h1>
			</div>

			{/* Stats Grid */}
			<div className="stats-grid">
				<div className="stat-card">
					<div className="stat-icon">📊</div>
					<div className="stat-content">
						<span className="stat-label">平均スコア</span>
						<span className="stat-value">{userStats.average_score}%</span>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-icon">✏️</div>
					<div className="stat-content">
						<span className="stat-label">合計クイズ数</span>
						<span className="stat-value">{userStats.total_quizzes}</span>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-icon">🔥</div>
					<div className="stat-content">
						<span className="stat-label">現在の連続記録</span>
						<span className="stat-value">{userStats.current_streak}日</span>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-icon">🏆</div>
					<div className="stat-content">
						<span className="stat-label">最長連続記録</span>
						<span className="stat-value">{userStats.longest_streak}日</span>
					</div>
				</div>
			</div>

			{/* Language Settings */}
			<div className="language-section">
				<h2 className="section-title">学習言語</h2>
				<div className="language-display">
					<div className="language-item">
						<span className="language-flag">
							{getLanguageFlag(user.native_language)}
						</span>
						<span className="language-name">
							{getLanguageDisplay(user.native_language)}
						</span>
					</div>
					<div className="language-arrows">
						<span className="arrow">⇄</span>
					</div>
					<div className="language-item">
						<span className="language-flag">
							{getLanguageFlag(user.learning_language)}
						</span>
						<span className="language-name">
							{getLanguageDisplay(user.learning_language)}
						</span>
					</div>
				</div>
				<button
					className="change-language-btn"
					onClick={() => setIsLanguageModalOpen(true)}
				>
					言語設定を変更
				</button>
			</div>

			{/* Language Modal */}
			{isLanguageModalOpen && (
				<div
					className="modal-overlay"
					onClick={() => setIsLanguageModalOpen(false)}
				>
					<div className="language-modal" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h3>言語設定</h3>
							<button
								className="close-btn"
								onClick={() => setIsLanguageModalOpen(false)}
							>
								×
							</button>
						</div>

						<div className="modal-content">
							<div className="language-selector">
								<label>母語</label>
								<div className="language-options">
									<button
										className={`language-option ${
											selectedNative === "jp" ? "active" : ""
										}`}
										onClick={() => setSelectedNative("jp")}
									>
										🇯🇵 日本語
									</button>
									<button
										className={`language-option ${
											selectedNative === "en" ? "active" : ""
										}`}
										onClick={() => setSelectedNative("en")}
									>
										🇺🇸 English
									</button>
								</div>
							</div>

							<div className="language-selector">
								<label>学習言語</label>
								<div className="language-options">
									<button
										className={`language-option ${
											selectedLearning === "jp" ? "active" : ""
										}`}
										onClick={() => setSelectedLearning("jp")}
									>
										🇯🇵 日本語
									</button>
									<button
										className={`language-option ${
											selectedLearning === "en" ? "active" : ""
										}`}
										onClick={() => setSelectedLearning("en")}
									>
										🇺🇸 English
									</button>
								</div>
							</div>
						</div>

						<div className="modal-actions">
							<button
								className="cancel-btn"
								onClick={() => setIsLanguageModalOpen(false)}
							>
								キャンセル
							</button>
							<button className="save-btn" onClick={handleLanguageUpdate}>
								保存
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
