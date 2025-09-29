import { useLoaderData } from "react-router-dom";
import "./Home.css";
import { useEffect, useState } from "react";
import VocabCard from "../../components/VocabCard/VocabCard";

const Home = () => {
	const [activeCategory, setActiveCategory] = useState("全て");
	const [activeVocabSets, setActiveVocabSets] = useState([]);
	const vocabularySets = useLoaderData();

	useEffect(() => {
		setActiveVocabSets(vocabularySets);
	}, []);

	const handleCategoryFilter = (category) => {
		setActiveCategory(category);

		if (category === "全て") {
			setActiveVocabSets(vocabularySets);
		} else {
			setActiveVocabSets(
				vocabularySets.filter((set) => set.category === category)
			);
		}
	};

	return (
		<div className="main">
			<div className="Home__container">
				<div className="category-scroll" role="tablist" aria-label="Categories">
					{[
						{ label: "全て", icon: "🌐", isActive: true },
						{ label: "外出と活動", icon: "🏃‍♂️", isActive: false },
						{ label: "日常生活とルーティン", icon: "☕", isActive: false },
						{ label: "場所と旅行", icon: "✈️", isActive: false },
						{ label: "人と人間関係", icon: "👥", isActive: false },
						{ label: "学習", icon: "📚", isActive: false },
					].map(({ label, icon, isActive }) => (
						<button
							key={label}
							role="tab"
							aria-selected={activeCategory === label ? "true" : "false"}
							className={`category ${activeCategory === label ? "active" : ""}`}
							onClick={() => handleCategoryFilter(label)}
						>
							<span className="icon" aria-hidden="true">
								{icon}
							</span>
							<span className="label">{label}</span>
						</button>
					))}
				</div>
				<div className="Home__divider"></div>
				<div
					className="vocab-grid tab-content"
					role="tabpanel"
					aria-labelledby="categories"
				>
					{activeVocabSets.map((set) => (
						<VocabCard key={set.id} vocabSet={set} from="home" />
					))}
				</div>
			</div>
		</div>
	);
};

export default Home;
