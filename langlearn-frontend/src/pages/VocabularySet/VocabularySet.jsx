import { useState, useEffect } from "react";
import { useUserProfile } from "../../hooks/useUserProfile";
import "./VocabularySet.css";
import { useLoaderData, Link, useLocation } from "react-router-dom";
import fetchApi from "../../services/api";
import toast from "react-hot-toast";
import Pagination from "../../components/Pagination/Pagination";

const VocabularySet = () => {
	// TODO:: outline stars with user_rating
	const vocabSetData = useLoaderData();
	const location = useLocation();
	const fromSection = location.state?.from || 'home';
	const { profile, isLoading } = useUserProfile();
	const [isHovering, setIsHovering] = useState(false);
	const [hoverIndex, setHoverIndex] = useState(0);
	const [views, setViews] = useState(vocabSetData.views);
	const [rating, setRating] = useState(parseFloat(vocabSetData.rating));
	const [totalRatings, setTotalRatings] = useState(
		parseInt(vocabSetData.total_ratings)
	);
	const [isFavourited, setIsFavourited] = useState(vocabSetData.isFavourited);

	const STARS = 5;
	const calculateReviewStars = (rating) => {
		const roundedToHalf = Math.round(rating * 2) / 2;
		const fullStars = Math.floor(roundedToHalf);
		const hasHalfStar = !Number.isInteger(roundedToHalf);

		return [fullStars, hasHalfStar];
	};
	const [fullStars, hasHalfStar] = calculateReviewStars(rating);

	const handleFavourite = async (method, favouriteType, itemId) => {
		try {
			const res = await fetchApi(`/favourites`, {
				method: method,
				body: JSON.stringify({
					id: itemId,
					type: favouriteType,
				}),
			});
			setIsFavourited(method === "POST");
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleRate = async (rating) => {
		try {
			const res = await fetchApi(`/vocabulary-sets/${vocabSetData.id}/rate`, {
				method: "POST",
				body: JSON.stringify({
					rating: rating,
				}),
			});
			console.log(res);
			setRating(parseFloat(res.average_rating).toFixed(1));
			setTotalRatings(parseInt(res.total_ratings));
		} catch (error) {
			toast.error(error.message);
		}
	};

	const getStarClassName = (index) => {
		if (isHovering) {
			return index <= hoverIndex ? "star-fill" : "star-empty";
		}

		let starClassName = "star-empty";

		if (index <= fullStars - 1) {
			starClassName = "star-fill";
		} else if (hasHalfStar && index === fullStars) {
			starClassName = "star-half";
		}

		return starClassName;
	};

	const renderStars = () => {
		const jsx = Array.from({ length: STARS }, (_, index) => (
			<button
				key={index}
				className={`star-btn ${getStarClassName(
					index,
					hoverIndex,
					isHovering
				)} btn`}
				onMouseEnter={() => {
					setHoverIndex(index);
					setIsHovering(true);
				}}
				onMouseLeave={() => {
					setIsHovering(false);
				}}
				onClick={() => handleRate(index + 1)}
			>
				★
			</button>
		));
		return jsx;
	};

	const renderEntries = (renderData) => {
		return renderData.map((entry, index) => (
			<Link to={`/vocabulary-entry/${entry.id}`} state={{ from: fromSection }} key={index}>
				<div className="entry-card">
					<div className="row">
						<div className="row-left">
							<p className="entry-word">{entry.word}</p>
							<span className="part-of-speech">
								[
								{typeof entry.part_of_speech === "string"
									? entry.part_of_speech
									: entry.part_of_speech.join("/")}
								]
							</span>
						</div>
						{/* <div className="action-btns">
                            <button
                                className={`entry-favourite-btn action-btn ${
                                    isFavourited === true ? "active" : ""
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleFavourite(
                                        isFavourited ? "DELETE" : "POST",
                                        "vocabulary_entry",
                                        entry.id
                                    );
                                }}
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
                            </button>
                        </div> */}
					</div>
					<p className="entry-meaning">{entry.meanings[0].short}</p>
				</div>
			</Link>
		));
	};

	useEffect(() => {
		(async () => {
			const res = await fetchApi(
				`/vocabulary-sets/${vocabSetData.id}/increment-views`,
				{
					method: "POST",
				}
			);
			setViews(res.views);
		})();
	}, []);

	return (
		<div className="vocabulary-set__container main">
			<div className="vocabulary-set-header">
				<img
					className="vocabulary-set-image"
					src={`${vocabSetData.image_url}`}
					alt={`${vocabSetData.title} vocabulary set image`}
				/>
				<button
					className={`favourite-btn ${isFavourited === true ? "active" : ""}`}
					onClick={() =>
						handleFavourite(
							isFavourited ? "DELETE" : "POST",
							"vocabulary_set",
							vocabSetData.id
						)
					}
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
				</button>
			</div>

			<section className="main-content">
				<h2 className="title">{vocabSetData.title}</h2>

				<div className="row">
					<p className="entries-count">
						{vocabSetData.vocabulary_entries.length} entries
					</p>

					<div className="reviews">
						<div className="review__stars">{renderStars()}</div>
						<span className="reviews__count">
							{rating} ({totalRatings} reviews)
						</span>
					</div>

					<div className="views-info">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							<path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
						</svg>
						<span className="view-count">{views} views</span>
					</div>
				</div>

				<Link to={`/quiz/${vocabSetData.id}`}>
					<button className="take-quiz-btn">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="lucide lucide-clipboard-pen-line-icon lucide-clipboard-pen-line"
						>
							<rect width="8" height="4" x="8" y="2" rx="1" />
							<path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5" />
							<path d="M16 4h2a2 2 0 0 1 1.73 1" />
							<path d="M8 18h1" />
							<path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
						</svg>
						Quiz
					</button>
				</Link>

				<div className="tags-container">
					{vocabSetData.tags.map((tag) => (
						<span className="tag" key={tag.id}>
							{tag.tag_jp}
						</span>
					))}
				</div>
			</section>

			<Pagination
				data={vocabSetData.vocabulary_entries}
				itemsPerPage={5}
				renderFunction={renderEntries}
			/>
		</div>
	);
};

export default VocabularySet;
