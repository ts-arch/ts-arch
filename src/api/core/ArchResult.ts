import { ArchSubject } from "./abstract/ArchSubject"

export class ArchResult {
	private results: Array<{ subject: ArchSubject; info: string; pass: boolean }> = []
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

	public addEntry(subject: ArchSubject, pass: boolean, info: string) {
		this.results.push({ subject: subject, info: info, pass: pass })
	}

	public getEntries(): Array<{ subject: ArchSubject; info: string; pass: boolean }> {
		return this.results
	}

	public hasRulePassed(): boolean {
		if (this.hasForcePassed) {
			return true
		}
		if (this.hasForceFailed) {
			return false
		}
		let result = true
		this.results.forEach(r => {
			if (!r.pass) {
				result = false
			}
		})
		return result
	}
}
