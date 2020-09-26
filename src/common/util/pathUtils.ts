export function normalizeWindowsPaths(input: string): string {
	return input.replace(/\\/g, "/")
}
