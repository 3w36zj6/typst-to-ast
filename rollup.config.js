import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
	input: "src/ts/index.ts",
	output: {
		file: "dist/bundle.js",
		format: "cjs",
	},
	plugins: [resolve(), typescript({ tsconfig: "./tsconfig.json" }), commonjs()],
};
