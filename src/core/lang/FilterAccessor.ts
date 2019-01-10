export interface FilterAccessor<R> {
	withName(expected: string): R
	withNameMatching(regex: RegExp): R
	withNamePrefix(prefix: string): R
	withNameSuffix(suffix: string): R
	withoutNamePrefix(prefix: string): R
	withoutNameSuffix(suffix: string): R
	withoutNameMatching(regex: RegExp): R
	withPathMatching(regex: RegExp): R
}
