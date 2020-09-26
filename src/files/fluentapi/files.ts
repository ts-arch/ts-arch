import {extractGraph} from "../../common/extraction/extractGraph"
import {gatherRegexMatchingViolations} from "../assertions/matchingFiles";
import {projectToNodes} from "../processing/project";
import {RegexFactory} from "../domain/RegexFactory";
import {Checkable} from "../../common/fluentapi/checkable";
import {Violation} from "../../common/fluentapi/violation";

export function filesOfProject(tsConfigFilePath?: string): FileConditionBuilder {
	return new FileConditionBuilder(tsConfigFilePath)
}

export class FileConditionBuilder {
	constructor(readonly tsConfigFilePath?: string) {}

	public matchingPattern(pattern: string): FilesShouldCondition {
		return new FilesShouldCondition(this, [pattern])
	}

	public withName(name: string): FilesShouldCondition {
		return new FilesShouldCondition(this, [RegexFactory.fileNameMatcher(name)])
	}

	public inFolder(folder: string): FilesShouldCondition {
		return new FilesShouldCondition(this, [RegexFactory.folderMatcher(folder)])
	}
}

export class FilesShouldCondition {
	constructor(readonly fileCondition: FileConditionBuilder, readonly patterns: string[]) {}

	public should(): MatchPatternFileConditionBuilder {
		return new MatchPatternFileConditionBuilder(this, false)
	}
	public shouldNot(): MatchPatternFileConditionBuilder {
		return new MatchPatternFileConditionBuilder(this, true)
	}

	public matchingPattern(pattern: string): FilesShouldCondition {
		return new FilesShouldCondition(this, [...this.patterns, pattern])
	}

	public withName(name: string): FilesShouldCondition {
		return new FilesShouldCondition(this, [...this.patterns, RegexFactory.fileNameMatcher(name)])
	}

	public inFolder(folder: string): FilesShouldCondition {
		return new FilesShouldCondition(this, [...this.patterns, RegexFactory.folderMatcher(folder)])
	}
}

export class MatchPatternFileConditionBuilder {
	constructor(readonly filesShouldCondition: FilesShouldCondition,
				readonly isNegated: boolean) {}

	public matchPattern(pattern: string): MatchPatternFileCondition {
		return new MatchPatternFileCondition(this, pattern)
	}

	public beInFolder(folder: string): MatchPatternFileCondition {
		return new MatchPatternFileCondition(this, RegexFactory.folderMatcher(folder))
	}
}

export class MatchPatternFileCondition implements Checkable {
	constructor(
		readonly matchPatternFileConditionBuilder: MatchPatternFileConditionBuilder,
		readonly pattern: string
	) {}

	public async check(): Promise<Violation[]> {
		const graph = await extractGraph(
			this.matchPatternFileConditionBuilder.filesShouldCondition.fileCondition.tsConfigFilePath
		)

		const projectedNodes = projectToNodes(graph)

		return gatherRegexMatchingViolations(projectedNodes,
			this.pattern,
			this.matchPatternFileConditionBuilder.filesShouldCondition.patterns,
			this.matchPatternFileConditionBuilder.isNegated)
	}
}
