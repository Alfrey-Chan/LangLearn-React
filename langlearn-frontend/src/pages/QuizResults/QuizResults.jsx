import { useLocation, Navigate, Link } from "react-router-dom";
import QuestionRenderer from "../../components/QuestionRenderer/QuestionRenderer";
import "./QuizResults.css";

const QuizResults = () => {
	const { state } = useLocation();
	const quizId = state?.quizId;
	const results = state?.results.results;
	console.log(results);

	if (!results || !quizId) {
		return <Navigate to="/home" replace />;
	}

	const renderQuestions = () => {
		const questions = results.questions;

		console.log(questions);

		return questions.map((question, index) => (
			<div key={question.id || index}>
				{QuestionRenderer.renderQuestionResult(question, index + 1)}
			</div>
		));
	};

	return (
		<div className="quiz-container">
			<div className="results-header">
				<span className="header-text">結果</span>
				<span className="score">
					{results.score} / {results.totalPossible} 点 ({results.percentage}%)
				</span>
			</div>

			<div className="results-main">{renderQuestions()}</div>
			<div className="action-btns">
				<Link to={`/quiz/${quizId}`}>
					<button className="action-btn retake-btn">もう一度</button>
				</Link>
				<Link to={`/vocabulary-set/${quizId}`}>
					<button className="action-btn vocab-btn">単語帳へ</button>
				</Link>
			</div>
		</div>
	);
};

export default QuizResults;
