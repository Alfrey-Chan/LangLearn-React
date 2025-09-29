import "./QuestionRenderer.css";

// Shared question renderer for both Quiz and QuizResults
const QuestionRenderer = {
	// Common question display components
	renderQuestionHeader: (
		question,
		questionNumber,
		pointsAwarded,
		possiblePoints
	) => {
		const typeLabels = {
			multiple_choice: "Multiple Choice",
			fill_blank: "Fill in the Blank",
			translation: "Translation",
			sentence_creation: "Sentence Building",
			word_rearrangement: "Unscramble",
		};

		return (
			<div className="question-header">
				<div className="question-header-left">
					<span className="question-number">Q{questionNumber}</span>
					<span className="type-tag">{typeLabels[question.type]}</span>
				</div>
				<div className="question-header-right">
					<span className="question-score">
						<span className="points-awarded">{pointsAwarded}</span>/
						{possiblePoints}点
					</span>
				</div>
			</div>
		);
	},

	renderQuestionText: (question) => {
		// Format question text based on type
		if (question.type === "translation") {
			return (
				<p className="question">
					<span className="translation-mondai mondai">
						以下の文を英語に翻訳してください:
					</span>
					「{question.question}」
				</p>
			);
		}

		return <p className="question">{question.question}</p>;
	},

	// For Quiz component - interactive version
	renderMultipleChoiceInteractive: (
		question,
		selectedOption,
		onOptionClick
	) => {
		const typeLabels = {
			multiple_choice: "Multiple Choice",
			fill_blank: "Fill in the Blank"
		};

		return (
			<>
				<div className="type-tag">{typeLabels[question.type]}</div>
				<p className="question">
					<span className="mondai">問題：</span>
					{question.question}
				</p>
				<div className="mc-options">
					{question.options.map((option, index) => (
						<button
							key={index}
							className={`option ${
								selectedOption === option ? "selected" : ""
							}`}
							onClick={() => onOptionClick(option)}
						>
							{option}
						</button>
					))}
				</div>
			</>
		);
	},

	renderFillBlankInteractive: (question, value, onChange) => {
		const typeLabels = {
			fill_blank: "Fill in the Blank",
			translation: "Translation",
			sentence_creation: "Sentence Building"
		};

		const instructions = {
			translation: "",
			fill_blank: "空欄に適切な単語を入力してください。",
			sentence_creation: "",
		};

		return (
			<>
				<div className="type-tag">{typeLabels[question.type]}</div>
				{instructions[question.type] && (
					<p className="instruction">{instructions[question.type]}</p>
				)}
				{question.type === "translation" ? (
					<p className="question">
						<span className="translation-mondai mondai">
							以下の文を英語に翻訳してください:
						</span>
						「{question.question}」
					</p>
				) : (
					<p className="question">
						<span className="mondai">問題：</span>
						{question.question}
					</p>
				)}
				<input
					type="text"
					className="fill-input"
					value={value || ""}
					onChange={onChange}
					placeholder="入力してください。"
					autoComplete="off"
				/>
			</>
		);
	},

	renderWordRearrangementInteractive: (
		question,
		constructedSentence,
		availableWords,
		onWordClick
	) => {
		return (
			<>
				<div className="type-tag">Unscramble</div>
				<p className="question">
					<span className="mondai">問題：</span>
					{question.question}
				</p>
				<div className="construct-output">
					{constructedSentence.map((word, index) => (
						<span
							key={index}
							className="word"
							onClick={() => onWordClick("constructed", word, index)}
						>
							{word}
						</span>
					))}
				</div>
				<div className="word-bank">
					{availableWords.map((word, index) => (
						<span
							key={index}
							className="word"
							onClick={() => onWordClick("available", word, index)}
						>
							{word}
						</span>
					))}
				</div>
			</>
		);
	},

	// For QuizResults component - display only version
	renderMultipleChoiceResult: (question, questionNumber) => {
		const isCorrect = question.is_correct;
		const userAnswer = question.user_answer;
		const pointsAwarded = isCorrect ? 1 : 0;
		const pointsTotal = 1;

		return (
			<div className="question-result">
				{QuestionRenderer.renderQuestionHeader(
					question,
					questionNumber,
					pointsAwarded,
					pointsTotal
				)}
				<span className="mondai">問題：</span>
				{QuestionRenderer.renderQuestionText(question)}

				<div className="mc-options-result">
					{question.options.map((option, index) => {
						let className = "option-result";

						if (option === question.correct_answer) {
							className += " correct-option";
						}
						if (option === userAnswer && !isCorrect) {
							className += " user-incorrect";
						}
						if (option === userAnswer && isCorrect) {
							className += " user-correct";
						}

						return (
							<div key={index} className={className}>
								{option}
								{option === question.correct_answer && (
									<span className="check-mark">✓</span>
								)}
								{option === userAnswer &&
									option !== question.correct_answer && (
										<span className="x-mark">✗</span>
									)}
							</div>
						);
					})}
				</div>

				<div className="answer-summary">
					<div className="user-answer">
						<span className="answer-summary-tag">あなたの回答:</span>{" "}
						{userAnswer}
					</div>
					<div className="correct-answer">
						<span className="answer-summary-tag">正解</span>:{" "}
						{question.correct_answer}
					</div>
					<div
						className={`result-status ${isCorrect ? "correct" : "incorrect"}`}
					>
						{isCorrect ? "正解" : "不正解"} ({pointsAwarded}/{pointsTotal}点)
					</div>
				</div>
			</div>
		);
	},

	renderFillBlankResult: (question, questionNumber) => {
		const pointsAwarded = question.feedback.points_awarded;
		const pointsTotal = question.feedback.points_total;

		let resultStatus;
		let statusClass;

		if (pointsAwarded === pointsTotal) {
			resultStatus = `正解 (${pointsAwarded}/${pointsTotal}点)`;
			statusClass = "correct";
		} else if (pointsAwarded === 0) {
			resultStatus = `不正解 (${pointsAwarded}/${pointsTotal}点)`;
			statusClass = "incorrect";
		} else {
			resultStatus = `部分正解 (${pointsAwarded}/${pointsTotal}点)`;
			statusClass = "partial";
		}

		return (
			<div className="question-result">
				{QuestionRenderer.renderQuestionHeader(
					question,
					questionNumber,
					pointsAwarded,
					pointsTotal
				)}
				{QuestionRenderer.renderQuestionText(question)}

				<div className="answer-summary">
					<div className="user-answer">
						<span className="answer-summary-tag">あなたの回答:</span> "
						{question.user_answer}"
					</div>
					<div className={`result-status ${statusClass}`}>{resultStatus}</div>
				</div>

				{question.feedback && (
					<div className="feedback-section">
						<h4>解説</h4>
						<p>
							{typeof question.feedback === "string"
								? question.feedback
								: question.feedback.feedback}
						</p>

						{question.feedback.alternatives &&
							question.feedback.alternatives.length > 0 && (
								<>
									<h4>他の正解例</h4>
									<ul className="alternatives">
										{question.feedback.alternatives.map((alt, index) => (
											<li key={index} className="alternative-sentence">
												{typeof alt === "string" ? alt : alt.sentence}
											</li>
										))}
									</ul>
								</>
							)}
					</div>
				)}
			</div>
		);
	},

	renderWordRearrangementResult: (question, questionNumber) => {
		const isCorrect = question.is_correct;
		const pointsTotal = question.points;
		const pointsAwarded = isCorrect ? pointsTotal : 0;

		return (
			<div className="question-result">
				{QuestionRenderer.renderQuestionHeader(
					question,
					questionNumber,
					pointsAwarded,
					pointsTotal
				)}
				{QuestionRenderer.renderQuestionText(question)}

				<div className="word-arrangement-result">
					<div className="user-sentence">
						あなたの回答: "{question.user_answer}"
					</div>
					<div className="correct-sentence">
						正解: "{question.correct_answer}"
					</div>
				</div>

				<div className={`result-status ${isCorrect ? "correct" : "incorrect"}`}>
					{isCorrect ? "正解" : "不正解"} ({pointsAwarded}/{pointsTotal}点)
				</div>
			</div>
		);
	},

	// Main render function for results
	renderQuestionResult: (question, questionNumber) => {
		switch (question.type) {
			case "multiple_choice":
			case "fill_blank":
				return QuestionRenderer.renderMultipleChoiceResult(
					question,
					questionNumber
				);
			case "translation":
			case "sentence_creation":
				return QuestionRenderer.renderFillBlankResult(question, questionNumber);
			case "word_rearrangement":
				return QuestionRenderer.renderWordRearrangementResult(
					question,
					questionNumber
				);
			default:
				return <div>Unknown question type: {question.type}</div>;
		}
	},
};

export default QuestionRenderer;
