import { Noun } from "./noun/Noun"

export interface ResultEntry {
	subject: Noun
	object?: Noun
	info: string
	pass: boolean
}

export class Result {
	private entries: Array<ResultEntry> = []
	private hasForcePassed = false
	private hasForceFailed = false

	public forcePass() {
		this.hasForcePassed = true
		this.hasForceFailed = false
	}

	public forceFail() {
		this.hasForcePassed = false
		this.hasForceFailed = true
	}

	public addEntry(entry: ResultEntry) {
		this.entries.push(entry)
	}

	public getEntries(): Array<ResultEntry> {
		return this.entries
	}

	public hasRulePassed(): boolean {
		if (this.hasForcePassed) {
			return true
		}
		if (this.hasForceFailed) {
			return false
		}
		let result = true
		this.entries.forEach(r => {
			if (!r.pass) {
				result = false
			}
		})
		return result
	}
}
