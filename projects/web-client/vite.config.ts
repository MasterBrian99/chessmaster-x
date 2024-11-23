import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},

	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		css: true,
		globals: true,
	},
});
