import "./MyQuizzes.css";
import { useLoaderData, useNavigate, Link } from "react-router-dom";

const MyQuizzes = () => {
	const navigate = useNavigate();
	const data = useLoaderData();
	const quizzes = data.user_quizzes_data;

	const getGradeInfo = (avgScore) => {
		if (avgScore >= 90) return { grade: "A", color: "#22c55e", label: "優秀" };
		if (avgScore >= 80) return { grade: "B", color: "#3b82f6", label: "良好" };
		if (avgScore >= 70) return { grade: "C", color: "#f59e0b", label: "普通" };
		if (avgScore >= 60)
			return { grade: "D", color: "#ef4444", label: "要改善" };
		return { grade: "F", color: "#ef4444", label: "要努力" };
	};

	const handleQuizClick = (setId) => {
		navigate(`/quiz/${setId}`);
	};

	const handleStudyClick = (setId) => {
		navigate(`/vocabulary-set/${setId}`);
	};

	return (
		<div className="my-quizzes-container main">
			<div className="my-quizzes-header">
				<h1 className="page-title">マイクイズ</h1>
				<p className="page-subtitle">
					{Array.isArray(quizzes) ? quizzes.length : 0}件のクイズ結果
				</p>
			</div>

			{quizzes.length <= 0 ? (
				<div className="empty-state">
					<div className="empty-icon">✏️</div>
					<h2>クイズ履歴がありません</h2>
					<p>単語帳でクイズを受けて、ここに結果を保存しましょう。</p>
					<Link to="/home" className="browse-btn">
						単語帳を見る
					</Link>
				</div>
			) : (
				<div className="quiz-stats-grid">
					{Array.isArray(quizzes) &&
						quizzes.map((quiz) => {
							const gradeInfo = getGradeInfo(quiz.avg_score);
							const meta = quiz.quiz;

							return (
								<div className="quiz-stat-card">
									<div className="quiz-card-header">
										<h2 className="quiz-title">{meta.title}</h2>
										<div
											className="grade-badge"
											style={{ backgroundColor: gradeInfo.color }}
										>
											<span className="grade-letter">{gradeInfo.grade}</span>
											<span className="grade-label">{gradeInfo.label}</span>
										</div>
									</div>

									<div className="stats-row">
										<div className="stat-item">
											<span className="stat-label">挑戦回数</span>
											<span className="stat-value">{quiz.attempts}回</span>
										</div>
										<div className="stat-item">
											<span className="stat-label">平均スコア</span>
											<span className="stat-value">{quiz.avg_score}％</span>
										</div>
										<div className="stat-item">
											<span className="stat-label">最高スコア</span>
											<span
												className="stat-value"
												style={{ color: getGradeInfo(quiz.best_score).color }}
											>
												{quiz.best_score}％
											</span>
										</div>
									</div>

									<div className="progress-container">
										<div className="progress-bar">
											<div
												className="progress-fill"
												style={{
													width: `${quiz.avg_score}%`,
													backgroundColor: gradeInfo.color,
												}}
											></div>
										</div>
										<span className="progress-text">{quiz.avg_score}%</span>
									</div>

									<div className="quiz-card-actions">
										<button
											className="action-btn quiz-btn"
											onClick={() => handleQuizClick(quiz.quiz_id)}
										>
											クイズを受ける
										</button>
										<button
											className="action-btn study-btn"
											onClick={() =>
												handleStudyClick(quiz.quiz.vocabulary_set_id)
											}
										>
											学習する
										</button>
									</div>
								</div>
							);
						})}
				</div>
			)}
		</div>
	);
};

export default MyQuizzes;
