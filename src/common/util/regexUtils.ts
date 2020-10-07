export function matchingAllPatterns(input: string, patterns: Array<string|RegExp>): boolean {
	const matches = patterns
		.map(p => input.match(p))
		.map(m => m != null && m.length > 0)
	return matches.indexOf(false) === -1
}
