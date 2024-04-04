import SignPage from "@/pages/auth/sign-page";
import Home from "@/pages/Home";
import { createBrowserRouter, Outlet } from "react-router-dom";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
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
