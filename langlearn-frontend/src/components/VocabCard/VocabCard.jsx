import { Link } from "react-router-dom";
import "./VocabCard.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import fetchApi from "../../services/api";

const VocabCard = ({ vocabSet, onFavouriteClick }) => {
	const [activeClass, setActiveClass] = useState("");
	const [isFavourited, setIsFavourited] = useState(false);

	const handleFavouriteClick = async () => {
		// If custom handler provided (e.g., Favourites page), use it
		if (onFavouriteClick) {
			onFavouriteClick(vocabSet.id);
			return;
		}

		// Default behavior (e.g., Home page)
		const methodType = isFavourited ? "DELETE" : "POST";
		const toastMessage = isFavourited ? "お気に入りから削除しました" : "お気に入りに追加しました";

		try {
			await fetchApi(`/favourites`, {
				method: methodType,
				body: JSON.stringify({
					id: vocabSet.id,
					type: "vocabulary_set",
				}),
			});

			// Update local states
			const newFavouriteState = !isFavourited;
			setIsFavourited(newFavouriteState);
			setActiveClass(newFavouriteState ? "active" : "");

			toast.success(toastMessage, { id: "toggle-favourite" });
		} catch (error) {
			toast.error(error.message, { id: "toggle-favourite" });
		}
	};

	useEffect(() => {
		// If is_favourited is undefined, assume it's favourited (for favourites page)
		// Otherwise use the actual value (for home page)
		const favouritedState = vocabSet.is_favourited !== undefined ? vocabSet.is_favourited : true;
		setIsFavourited(favouritedState);

		const activeClassName = favouritedState ? "active" : "";
		setActiveClass(activeClassName);
	}, [vocabSet.is_favourited]);

	return (
		<div className="vocab-card-component" key={vocabSet.id}>
			<div className="card-image">
				<img
					src={vocabSet.image_url}
					alt={vocabSet.title}
					onError={(e) => {
						e.target.src =
							"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGN0ZCIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiNEMUQ1REIiLz4KPHN2Zz4=";
					}}
				/>

				<button
					className={`favourite-btn ${activeClass}`}
					onClick={handleFavouriteClick}
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
					</svg>
				</button>

				<div className="category-tag">{vocabSet.category}</div>
			</div>

			<div className="card-content">
				<h2 className="set-title">{vocabSet.title}</h2>
				{vocabSet.title_translated && (
					<p className="set-title-translated">{vocabSet.title_translated}</p>
				)}
				<div className="set-meta">
					<span className="entries">
						{vocabSet.vocabulary_entries_count || vocabSet.entries} entries
					</span>
					<span className="rating">★ {vocabSet.rating}</span>
				</div>
				<div className="card-actions">
					<Link to={`/vocabulary-set/${vocabSet.id}`} className="study-btn">
						学習する
					</Link>
					<Link to={`/quiz/${vocabSet.id}`} className="quiz-btn">
						クイズ
					</Link>
				</div>
			</div>
		</div>
	);
};

export default VocabCard;
