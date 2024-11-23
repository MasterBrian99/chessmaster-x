import { render, screen } from "@testing-library/react";
import App from "./App";
import router from "./router/index.tsx";
import { describe, it } from "vitest";
describe("App", () => {
	it("renders the App component", () => {
		render(<App router={router} />);

		screen.debug(); // prints out the jsx in the App component unto the command line
	});
});
