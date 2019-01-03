import resolve from "rollup-plugin-node-resolve"
import builtins from "rollup-plugin-node-builtins"
import commonjs from "rollup-plugin-commonjs"
import sourceMaps from "rollup-plugin-sourcemaps"
import camelCase from "lodash.camelcase"
import typescript from "rollup-plugin-typescript2"
import json from "rollup-plugin-json"

const pkg = require("./package.json")

const libraryName = "tsarch"

export default {
	// circular dependencies occur in some node modules, they are allowed so the warning may be disabled
	onwarn: function(message) {
		if (message.code === "CIRCULAR_DEPENDENCY") {
			return
		}
		console.error(message)
	},
	input: `src/${libraryName}.ts`,
	output: [
		{ file: pkg.main, name: camelCase(libraryName), format: "umd", sourcemap: true },
		{ file: pkg.module, format: "es", sourcemap: true }
	],
	// Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
	external: [],
	watch: {
		include: "src/**"
	},
	plugins: [
		// Allow json resolution
		json(),
		// Compile TypeScript files
		typescript({ useTsconfigDeclarationDir: true }),
		// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
		commonjs({
			namedExports: {
				// left-hand side can be an absolute path, a path
				// relative to the current directory, or the name
				// of a module in node_modules
				"typescript-parser": ["TypeScriptParser"]
			}
		}),
		// shim node builtins
		builtins(),
		// Allow node_modules resolution, so you can use 'external' to control
		// which external modules to include in the bundle
		// https://github.com/rollup/rollup-plugin-node-resolve#usage
		resolve({
			browser: false
		}),
		// Resolve source maps to the original source
		sourceMaps()
	]
}
