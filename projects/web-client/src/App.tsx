import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MantineProvider } from "@mantine/core";
import { RouterProvider, type createBrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

type AppProps = { router: ReturnType<typeof createBrowserRouter> };

const App = ({ router }: AppProps): React.ReactElement | null => {
	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider>
				<RouterProvider router={router} />
			</MantineProvider>
			{/* <TanStackRouterDevelopmentTools
				router={router}
				initialIsOpen={false}
				position="bottom-right"
			/>*/}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default App;
