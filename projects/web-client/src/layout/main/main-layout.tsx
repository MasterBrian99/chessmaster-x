import { Box } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Header from "./components/header/header";

export default function MainLayout(): React.ReactElement {
	return (
		<Box>
			<Header />
			<Outlet />
		</Box>
	);
}
