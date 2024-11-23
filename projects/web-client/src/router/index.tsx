import MainLayout from "@/layout/main/main-layout";
import SignPage from "@/pages/auth/sign-page";
import HomePage from "@/pages/home/home-page";
import { createBrowserRouter, Outlet } from "react-router-dom";

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				path: "/",
				element: <HomePage />,
			},
		],
	},
	{
		path: "auth",
		element: <Outlet />,
		children: [
			{
				path: "sign-in",
				element: <SignPage />,
			},
		],
	},
]);

export default router;
