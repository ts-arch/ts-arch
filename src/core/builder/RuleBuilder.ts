import { Filter } from "../filter/Filter"
import { EmptyFilter } from "../filter/EmptyFilter"
import { FilesFilter } from "../filter/typing/FilesFilter"
import { SubjectFilterStarter } from "../lang/SubjectFilterStarter"
import { SubjectFilterAccessor } from "../lang/SubjectFilterAccessor"
import { ObjectFilterAccessor } from "../lang/ObjectFilterAccessor"
import { ObjectFilterStarter } from "../lang/ObjectFilterStarter"
import { Buildable } from "../lang/Buildable"
import { RuleAccessor } from "../lang/RuleAccessor"
import { Checkable } from "../lang/Checkable"
import { WithNameMatchingFilter } from "../filter/naming/WithNameMatchingFilter"
import { WithPathMatchingFilter } from "../filter/naming/WithPathMatchingFilter"
import { FilterAccessor } from "../lang/FilterAccessor"
import { HaveComplexityLowerThanStrategy } from "../checks/complexity/HaveComplexityLowerThanStrategy"
import { CheckStrategy } from "../checks/CheckStrategy"
import { HaveSubjectsStrategy } from "../checks/count/HaveSubjectsStrategy"
import { MatchNameStrategy } from "../checks/naming/MatchNameStrategy"
import { Rule } from "../Rule"
import { DependOnStrategy } from "../checks/dependency/DependOnStrategy"

export class RuleBuilder
	implements
		SubjectFilterStarter,
		ObjectFilterStarter,
		FilterAccessor<ObjectFilterAccessor & SubjectFilterAccessor>,
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
			regex,
			false
		)
		return this
	}

	public withoutPathMatching(regex: RegExp): SubjectFilterAccessor & ObjectFilterAccessor {
		this.currentlyBuildingFilter = new WithPathMatchingFilter(
			this.currentlyBuildingFilter,
			regex,
			true
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
		this.finalizeSubjectFilter()
		this.currentlyBuildingFilter = this.objectFilter
		this.currentCheckStrategy = new DependOnStrategy()
		return this
	}
}
