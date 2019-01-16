import { DependOnStrategy } from "../DependOnStrategy"
import { HaveComplexityLowerThanStrategy } from "../../HaveComplexityLowerThanStrategy"

export class TwoDependenciesInProject {
	private a: number

	constructor() {
		this.a = 2
		const b = new DependOnStrategy()
		const c = new HaveComplexityLowerThanStrategy(2)
	}
}
