import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import { AuthContextProvider } from "./contexts/AuthContext";
import Protected from "./components/Protected";
import {
	favouriteLoader,
	homeLoader,
	myQuizzesLoader,
	quizLoader,
	vocabularySetLoader,
	profileLoader,
	entryLoader,
} from "./loaders/loaders";
import { ErrorPage } from "./pages/Error/ErrorPage";
import Layout from "./components/Layout/Layout";
import Header from "./components/Header/Header";
import BottomNav from "./components/BottomNav/BottomNav";
import VocabularySet from "./pages/VocabularySet/VocabularySet";
import Quiz from "./pages/Quiz/Quiz";
import QuizResults from "./pages/QuizResults/QuizResults";
import Favourites from "./pages/Favourites/Favourites";
import MyQuizzes from "./pages/MyQuizzes/MyQuizzes";
import Profile from "./pages/Profile/Profile";
import VocabularyEntry from "./pages/VocabularyEntry/VocabularyEntry";

// Create router with loaders
const router = createBrowserRouter([
	{
		path: "/",
		element: <Navigate to="/home" replace />,
	},
	{
		path: "/home",
		element: (
			<Protected>
				<Header />
				<Layout>
					<Home />
					<BottomNav />
				</Layout>
			</Protected>
		),
		loader: homeLoader,
		errorElement: <ErrorPage />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/signup",
		element: <Signup />,
	},
	{
		path: "/vocabulary-set/:id",
		element: (
			<Protected>
				<Header />
				<Layout>
					<VocabularySet />
				</Layout>
				<BottomNav />
			</Protected>
		),
		loader: vocabularySetLoader,
		errorElement: <ErrorPage />,
	},
	{
		path: "/vocabulary-entry/:id",
		element: (
			<Protected>
				<Header />
				<Layout>
					<VocabularyEntry />
				</Layout>
				{/* <BottomNav /> */}
			</Protected>
		),
		loader: entryLoader,
		errorElement: <ErrorPage />,
	},
	{
		path: "/quiz/:id",
		element: (
			<Protected>
				<Header />
				<Quiz />
			</Protected>
		),
		loader: quizLoader,
		errorElement: <ErrorPage />,
	},
	{
		path: "/quiz-results/",
		element: (
			<Protected>
				<Header />
				<QuizResults />
			</Protected>
		),
	},
	{
		path: "/favourites",
		element: (
			<Protected>
				<Header />
				<Layout>
					<Favourites />
					<BottomNav />
				</Layout>
			</Protected>
		),
		loader: favouriteLoader,
		errorElement: <ErrorPage />,
	},
	{
		path: "/my-quizzes",
		element: (
			<Protected>
				<Header />
				<Layout>
					<MyQuizzes />
					<BottomNav />
				</Layout>
			</Protected>
		),
		loader: myQuizzesLoader,
		errorElement: <ErrorPage />,
	},
	{
		path: "/profile",
		element: (
			<Protected>
				<Header />
				<Layout>
					<Profile />
				</Layout>
				<BottomNav />
			</Protected>
		),
		loader: profileLoader,
		errorElement: <ErrorPage />,
	},
]);

function App() {
	return (
		<AuthContextProvider>
			<RouterProvider router={router} />
			<Toaster
				position="top-center"
				toastOptions={{
					duration: 7000,
				}}
			/>
		</AuthContextProvider>
	);
}

export default App;
