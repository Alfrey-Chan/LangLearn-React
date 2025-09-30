import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./Quiz.css";
import shuffleArray from "../../utilities/utils";
import fetchApi from "../../services/api";
import toast from "react-hot-toast";
import QuestionRenderer from "../../components/QuestionRenderer/QuestionRenderer";

const Quiz = () => {
	// Quiz question states
	const [questionIndex, setQuestionIndex] = useState(0);
	const [questions, setQuestions] = useState([]);
	const [isLast, setIsLast] = useState(false);

	// User answers for MC/fill in the blank, translation
	const [selectedOptions, setSelectedOptions] = useState({}); // mc and fill in the blank questions
	const [fillAnswer, setFillAnswer] = useState({}); // translation questions

	// User answer for unscramble questions
	const [originalWordOrder, setOriginalWordOrder] = useState("");
	const [availableWords, setAvailableWords] = useState([]);
	const [constructedSentence, setConstructedSentence] = useState([]);
	const [isUnscrambleQuestion, setIsUnscrambleQuestion] = useState(false);

	// For Toast messages depending on submit state or if there's an error
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const quizData = useLoaderData();
	const navigate = useNavigate();

	// Constants (must add up to NUMBER_OF_QUESTIONS)
	const NUMBER_OF_QUESTIONS = 12;
	const NUM_MC_QUESTIONS = 4;
	const NUM_FILL_QUESTIONS = 3;
	const NUM_TRANSLATION_QUESTIONS = 2;
	const NUM_SENTENCE_CREATION_QUESTIONS = 2;
	const NUM_SCRAMBLE_QUESTIONS = 1;

	const renderQuestion = () => {
		const question = questions[questionIndex];

		if (!question) {
			return <div>Loading...</div>;
		}

		switch (question["type"]) {
			case "multiple_choice":
			case "fill_blank":
				return renderMultipleChoice(question);
			case "translation":
			case "sentence_creation":
				return renderFillBlank(question);
			case "word_rearrangement":
				return renderWordRearrangement(question);
			default:
				return null;
		}
	};

	const renderMultipleChoice = (question) => {
		return QuestionRenderer.renderMultipleChoiceInteractive(
			question,
			selectedOptions[questionIndex],
			(option) => {
				setSelectedOptions((prev) => ({
					...prev,
					[questionIndex]: option,
				}));
			}
		);
	};

	const renderFillBlank = (question) => {
		return QuestionRenderer.renderFillBlankInteractive(
			question,
			fillAnswer[questionIndex],
			(e) =>
				setFillAnswer((prev) => ({
					...prev,
					[questionIndex]: e.target.value,
				}))
		);
	};

	const renderWordRearrangement = (question) => {
		return QuestionRenderer.renderWordRearrangementInteractive(
			question,
			constructedSentence,
			availableWords,
			(type, word, index) => {
				if (type === "available") {
					moveWordToConstruct(word, index);
				} else {
					moveWordBack(word, index);
				}
			}
		);
	};

	const moveWordToConstruct = (word, index) => {
		setConstructedSentence((prev) => [...prev, word]);
		setAvailableWords((prev) => prev.filter((_, i) => i !== index));
	};

	const moveWordBack = (word, index) => {
		setAvailableWords((prev) => [...prev, word]);
		setConstructedSentence((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (questionsToSubmit = questions) => {
		console.log("Submitting Quiz...");
		setIsSubmitting(true);
		toast.loading("クイズを提出中。。。", { id: "submit-quiz" });

		try {
			const response = await fetchApi("/submit-quiz", {
				method: "POST",
				body: JSON.stringify({ questions: questionsToSubmit }),
			});

			toast.success("提出完了！", { id: "submit-quiz" });
			console.log(response);
			navigate("/quiz-results", {
				state: {
					results: response,
					quizId: quizData.id,
				},
			});
		} catch (error) {
			toast.error("提出に失敗しました。", { id: "submit-quiz" });
			setIsSubmitting(false);
		}
	};

	const resetStates = () => {
		setError("");
		setAvailableWords([]);
		setConstructedSentence([]);
		setOriginalWordOrder([]);
		setIsUnscrambleQuestion(false);
	};

	const handleNextQuestion = () => {
		let currentAnswer;
		const currentQuestion = questions[questionIndex];

		if (
			currentQuestion.type === "multiple_choice" ||
			currentQuestion.type === "fill_blank"
		) {
			currentAnswer = selectedOptions[questionIndex];
		} else if (
			currentQuestion.type === "translation" ||
			currentQuestion.type === "sentence_creation"
		) {
			currentAnswer = fillAnswer[questionIndex]?.trim();
		} else if (currentQuestion.type === "word_rearrangement") {
			currentAnswer = constructedSentence.join(" ");
		}

		if (currentAnswer) {
			const updatedQuestions = questions.map((q, index) =>
				index === questionIndex ? { ...q, user_answer: currentAnswer } : q
			);

			setQuestions(updatedQuestions);

			if (isLast) {
				if (availableWords.length > 0) {
					setError("回答してください。");
					return;
				}

				handleSubmit(updatedQuestions);
				return;
			}

			console.log("Moving to next question");
			resetStates();
			setQuestionIndex(questionIndex + 1);
		} else {
			setError("回答してください。");
		}
	};

	const randomizeQuestions = () => {
		const shuffled = shuffleArray(
			Object.values(quizData.questions).slice(0, NUMBER_OF_QUESTIONS)
		); // 12 random questions

		const tempQuestions = [];
		let startIndex = 0;

		const mcQuestions = shuffled.slice(
			startIndex,
			(startIndex += NUM_MC_QUESTIONS)
		);
		mcQuestions.forEach((question) => {
			const mcQuestion = question.multiple_choice[0];
			tempQuestions.push({
				...mcQuestion,
				options: shuffleArray(mcQuestion.options),
			});
		});

		const fillQuestions = shuffled.slice(
			startIndex,
			(startIndex += NUM_FILL_QUESTIONS)
		);
		fillQuestions.forEach((question) => {
			const fillQuestion = question.fill_blank[0];
			tempQuestions.push({
				...fillQuestion,
				options: shuffleArray(fillQuestion.options),
			});
		});

		const translateQuestions = shuffled.slice(
			startIndex,
			(startIndex += NUM_TRANSLATION_QUESTIONS)
		);
		translateQuestions.forEach((question) =>
			tempQuestions.push(shuffleArray(question.translation)[0])
		);

		const sentenceCreationQuestions = shuffled.slice(
			startIndex,
			(startIndex += NUM_SENTENCE_CREATION_QUESTIONS)
		);
		sentenceCreationQuestions.forEach((question) =>
			tempQuestions.push(shuffleArray(question.sentence_creation)[0])
		);

		const wordRearrangementQuestions = shuffled.slice(
			startIndex,
			(startIndex += NUM_SCRAMBLE_QUESTIONS)
		);
		wordRearrangementQuestions.forEach((question) =>
			tempQuestions.push({
				...shuffleArray(question.word_rearrangement)[0],
				word_bank: shuffleArray(question.word_rearrangement)[0].word_bank.map(
					(word) => word.toLowerCase()
				),
			})
		);

		setQuestions(tempQuestions);
	};

	useEffect(() => {
		document.body.classList.add("quiz-page");
		randomizeQuestions();
		return () => document.body.classList.remove("quiz-page");
	}, []);

	useEffect(() => {
		const question = questions[questionIndex];
		setIsLast(questionIndex === questions.length - 1);

		if (question?.type === "word_rearrangement") {
			const shuffled = shuffleArray(question.word_bank);
			setAvailableWords(shuffled);
			setOriginalWordOrder(shuffled);
			setConstructedSentence([]);
			setIsUnscrambleQuestion(true);
		}
	}, [questionIndex, questions]);

	return (
		<div className="quiz-container main">
			<div className="progress">
				<div
					className="progress__bar"
					style={{
						width: `${Math.round(
							((questionIndex + 1) / NUMBER_OF_QUESTIONS) * 100
						)}%`,
					}}
				></div>
				<div className="progress__text">
					Question {questionIndex + 1} out of {NUMBER_OF_QUESTIONS}
				</div>
			</div>

			<div className="question-card">
				{renderQuestion()}
				{error && <div className="feedback wrong">{error}</div>}
				<div className="action-btns">
					{isUnscrambleQuestion && (
						<button
							className="reset-btn action-btn"
							onClick={() => {
								setAvailableWords([...originalWordOrder]);
								setConstructedSentence([]);
							}}
						>
							リセット
						</button>
					)}
					<button
						className="next-question-btn action-btn"
						onClick={handleNextQuestion}
						disabled={isSubmitting}
					>
						{isLast ? "完了" : "次へ"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Quiz;
