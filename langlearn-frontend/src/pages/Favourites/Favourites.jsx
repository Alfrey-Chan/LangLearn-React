import { Link, useLoaderData } from "react-router-dom";
import "./Favourites.css";
import { useState } from "react";
import toast from "react-hot-toast";
import fetchApi from "../../services/api";
import VocabCard from "../../components/VocabCard/VocabCard";

const Favourites = () => {
	const favouritesData = useLoaderData();
	const [sets, setSets] = useState(favouritesData["vocabulary_sets"]);

	const handleFavouriteClick = async (setId) => {
		try {
			await fetchApi("/favourites", {
				method: "DELETE",
				body: JSON.stringify({
					id: setId,
					type: "vocabulary_set",
				}),
			});

			// Remove from local state
			setSets((prevSets) => prevSets.filter((set) => set.id !== setId));
			toast.success("お気に入りから削除しました", { id: "remove-favourite" });
		} catch (error) {
			toast.error(error.message, { id: "remove-favourite" });
		}
	};

	return (
		<div className="favourites-container main">
			<div className="favourites-header">
				<h1 className="page-title">お気に入り</h1>
				<p className="page-subtitle">{sets.length}件の単語帳</p>
			</div>

			{sets.length === 0 ? (
				<div className="empty-state">
					<div className="empty-icon">💙</div>
					<h2>お気に入りがありません</h2>
					<p>気になる単語帳にハートマークをつけて、ここに保存しましょう。</p>
					<Link to="/home" className="browse-btn">
						単語帳を見る
					</Link>
				</div>
			) : (
				<div className="vocab-grid">
					{sets.map((vocabSet) => (
						<VocabCard
							key={vocabSet.id}
							vocabSet={{ ...vocabSet, is_favourited: true }}
							onFavouriteClick={handleFavouriteClick}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default Favourites;
