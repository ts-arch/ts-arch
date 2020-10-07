export function safeArrayGet<T>(input: Array<T>, index: number): T | undefined {
	return input[index]
}
