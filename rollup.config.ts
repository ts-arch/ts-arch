import typescript from "rollup-plugin-typescript2"

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
		{ file: pkg.module, format: "es", sourcemap: true }
	],
	watch: {
		include: "src/**"
	},
	external: [ 'path', 'fs', 'typescript' ],
	plugins: [
		typescript()
	]
}
