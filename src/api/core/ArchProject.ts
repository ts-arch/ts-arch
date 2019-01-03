import { ArchSubject } from "./abstract/ArchSubject"

export class ArchProject {
	constructor(private subjects: ArchSubject[] = []) {}

	public addSubject(subject: ArchSubject) {
		this.subjects.push(subject)
	}

	public getSubjects(): ArchSubject[] {
		return this.subjects
	}
}
