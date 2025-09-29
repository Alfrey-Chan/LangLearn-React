import "./layout.css";
import BottomNav from "../BottomNav/BottomNav";

const Layout = ({ children }) => {
	return (
		<>
			<div className="layout">{children}</div>
		</>
	);
};

export default Layout;
