import { useState } from "react";
import "./Pagination.css";

const Pagination = ({ data, itemsPerPage, renderFunction }) => {
	const [currentPage, setCurrentPage] = useState(1);

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentPageData = data.slice(startIndex, endIndex);
	const totalPages = Math.ceil(data.length / itemsPerPage);

	return (
		<>
			{renderFunction(currentPageData)}
			<div className="pagination">
				<button
					className="prev-btn"
					onClick={() => setCurrentPage(currentPage - 1)}
					disabled={currentPage <= 1}
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<polyline points="15,18 9,12 15,6" />
					</svg>
				</button>
				{Array.from({ length: totalPages }, (_, index) => (
					<button
						className={`pagination-btn ${
							currentPage === index + 1 ? "page-active" : ""
						}`}
						key={index}
						onClick={() => setCurrentPage(index + 1)}
					>
						{index + 1}
					</button>
				))}
				<button
					className="next-btn"
					onClick={() => setCurrentPage(currentPage + 1)}
					disabled={currentPage >= totalPages}
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<polyline points="9,18 15,12 9,6" />
					</svg>
				</button>
			</div>
		</>
	);
};

export default Pagination;
