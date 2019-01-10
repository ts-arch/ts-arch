import { Filter } from "../filter/Filter"
import { EmptyFilter } from "../filter/EmptyFilter"
import { FilesFilter } from "../filter/FilesFilter"
import { SubjectFilterStarter } from "../lang/SubjectFilterStarter"
import { SubjectFilterAccessor } from "../lang/SubjectFilterAccessor"
import { ObjectFilterAccessor } from "../lang/ObjectFilterAccessor"
import { ObjectFilterStarter } from "../lang/ObjectFilterStarter"
import { Buildable } from "./Buildable"
import { RuleAccessor } from "../lang/RuleAccessor"
import { Checkable } from "../checks/Checkable"
import { WithNameMatchingFilter } from "../filter/WithNameMatchingFilter"
import { WithPathMatchingFilter } from "../filter/WithPathMatching"
import { FilterAccessor } from "../lang/FilterAccessor"
import { HaveComplexityLowerThanStrategy } from "../checks/HaveComplexityLowerThanStrategy"
import { CheckStrategy } from "../checks/CheckStrategy"
import { HaveSubjectsStrategy } from "../checks/HaveSubjectsStrategy"
import { MatchNameStrategy } from "../checks/MatchNameStrategy"
import { Rule } from "../Rule"

export class RuleBuilder
	implements
		SubjectFilterStarter,
		ObjectFilterStarter,
		FilterAccessor<ObjectFilterAccessor & SubjectFilterAccessor>, // TODO check if this works correctly. before there were both accessors separatly
		RuleAccessor,
		Buildable {
	public static defineThat(): SubjectFilterStarter {
		return new RuleBuilder()
	}

	private subjectFilter: Filter = new EmptyFilter()
	private objectFilter: Filter = new EmptyFilter()
	private isNegated = false
	private currentlyBuildingFilter: Filter = this.subjectFilter
	private currentCheckStrategy?: CheckStrategy

	public build(): Checkable {
		if (this.currentCheckStrategy) {
			this.finalizeObjectFilter()
			return new Rule(
				this.subjectFilter,
				this.objectFilter,
				this.isNegated,
				this.currentCheckStrategy
			)
		} else {
			throw new Error("No Checking Strategy selected")
		}
	}

	public files(): SubjectFilterAccessor & ObjectFilterAccessor {
		this.currentlyBuildingFilter = new FilesFilter(this.currentlyBuildingFilter)
		return this
	}

	public withName(expected: string): SubjectFilterAccessor & ObjectFilterAccessor {
		this.currentlyBuildingFilter = new FilesFilter(this.currentlyBuildingFilter)
		return this
	}

	public withNameMatching(regex: RegExp): SubjectFilterAccessor & ObjectFilterAccessor {
		this.currentlyBuildingFilter = new WithNameMatchingFilter(
			this.currentlyBuildingFilter,
			regex
		)
		return this
	}

	public withNamePrefix(prefix: string): SubjectFilterAccessor & ObjectFilterAccessor {
		this.currentlyBuildingFilter = new WithNameMatchingFilter(
			this.currentlyBuildingFilter,
			new RegExp(prefix + ".+.($|\\n)")
		)
		return this
	}

	public withNameSuffix(suffix: string): SubjectFilterAccessor & ObjectFilterAccessor {
		this.currentlyBuildingFilter = new WithNameMatchingFilter(
			this.currentlyBuildingFilter,
			new RegExp(".+." + suffix + "($|\\n)")
		)
		return this
	}

	public withoutNamePrefix(prefix: string): SubjectFilterAccessor & ObjectFilterAccessor {
		this.currentlyBuildingFilter = new WithNameMatchingFilter(
			this.currentlyBuildingFilter,
			new RegExp(prefix + ".+.($|\\n)"),
			true
		)
		return this
	}

	public withoutNameSuffix(suffix: string): SubjectFilterAccessor & ObjectFilterAccessor {
		this.currentlyBuildingFilter = new WithNameMatchingFilter(
			this.currentlyBuildingFilter,
			new RegExp(".+." + suffix + "($|\\n)"),
			true
		)
		return this
	}

	public withoutNameMatching(regex: RegExp): SubjectFilterAccessor & ObjectFilterAccessor {
		this.currentlyBuildingFilter = new WithNameMatchingFilter(
			this.currentlyBuildingFilter,
			regex,
			true
		)
		return this
	}

	public withPathMatching(regex: RegExp): SubjectFilterAccessor & ObjectFilterAccessor {
		this.currentlyBuildingFilter = new WithPathMatchingFilter(
			this.currentlyBuildingFilter,
			regex
		)
		return this
	}

	public should(): RuleAccessor {
		return this
	}

	public shouldNot(): RuleAccessor {
		this.isNegated = true
		return this
	}

	public haveComplexityLowerThan(value: number): Buildable {
		this.finalizeSubjectFilter()
		this.currentCheckStrategy = new HaveComplexityLowerThanStrategy(value)
		return this
	}

	private finalizeSubjectFilter() {
		this.subjectFilter = this.currentlyBuildingFilter
	}

	private finalizeObjectFilter() {
		this.objectFilter = this.currentlyBuildingFilter
	}

	public haveSubjects(): Buildable {
		this.finalizeSubjectFilter()
		this.currentCheckStrategy = new HaveSubjectsStrategy()
		return this
	}

	public matchName(regex: RegExp): Buildable {
		this.finalizeSubjectFilter()
		this.currentCheckStrategy = new MatchNameStrategy(regex)
		return this
	}

	public dependOn(): ObjectFilterStarter {
		this.currentlyBuildingFilter = this.objectFilter
		this.currentCheckStrategy = undefined // TODO
		throw new Error("Method not implemented.")
		return this
	}
}
