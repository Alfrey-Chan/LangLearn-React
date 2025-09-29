import { useLoaderData } from "react-router-dom";
import "./VocabularyEntry.css";

const VocabularyEntry = () => {
	const entryData = useLoaderData();
	console.log(entryData);
	return (
		<div className="vocabulary-entry">
			<div className="vocabulary-header">
				<h1 className="vocabulary-word">{entryData.word}</h1>
				{Array.isArray(entryData.part_of_speech) ? (
					entryData.part_of_speech.map((speech, index) => (
						<span className="part-of-speech" key={index}>
							{speech}
						</span>
					))
				) : (
					<span className="part-of-speech">{entryData.part_of_speech}</span>
				)}
			</div>

			<div className="vocabulary-section">
				<h2>意味 (Meanings)</h2>
				<ul className="meanings-list">
					{entryData.meanings.map((meaning, index) => (
						<li key={index} className="meaning-item">
							<p className="meanings-short">{meaning.short}</p>
							<p className="meanings-long">{meaning.long}</p>
						</li>
					))}
				</ul>
			</div>

			<div className="vocabulary-section">
				<h2>例文 (Example Sentences)</h2>
				<div className="examples-list">
					{entryData.sentence_examples.map((example, index) => (
						<div key={index} className="example-item">
							<p className="example-english">{example.sentence_original}</p>
							<p className="example-japanese">{example.sentence_translated}</p>
						</div>
					))}
				</div>
			</div>

			{entryData.additional_notes && (
				<div className="vocabulary-section">
					<h2>追加情報 (Additional Notes)</h2>
					<p className="additional-notes">{entryData.additional_notes}</p>
				</div>
			)}
		</div>
	);
};

export default VocabularyEntry;
