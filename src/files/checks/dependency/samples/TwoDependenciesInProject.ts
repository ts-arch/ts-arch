import { DependOnStrategy } from "../DependOnStrategy"
import { HaveComplexityLowerThanStrategy } from "../../complexity/HaveComplexityLowerThanStrategy"

export class TwoDependenciesInProject {
	private a: number

	constructor() {
		this.a = 2
		const b = new DependOnStrategy({ js: false, declarations: true, nodeModules: true })
		const c = new HaveComplexityLowerThanStrategy(2)
	}
}
