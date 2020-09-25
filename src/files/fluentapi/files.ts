import {extractGraph} from "../../common/extraction/extractGraph"
import {err, ok, Result} from "neverthrow"
import {gatherRegexMatchingViolations, ViolatingFile} from "../assertions/matchingFiles";
import {projectToNodes} from "../processing/project";
import {matchingAllPatterns} from "../../common/util/regexUtils";

export function filesOfProject(tsConfigFilePath?: string): FileConditionBuilder {
	return new FileConditionBuilder(tsConfigFilePath)
}

export class FileConditionBuilder {
	constructor(readonly tsConfigFilePath?: string) {}

	public matchingPattern(pattern: string): FilesShouldCondition { // TODO Regex data type for regex literals
		return FileShouldConditionFactory.matchingPattern(this, pattern)
	}

	public withName(name: string): FilesShouldCondition {
		return FileShouldConditionFactory.withName(this, name)
	}

	public inFolder(folder: string): FilesShouldCondition {
		return FileShouldConditionFactory.inFolder(this, folder)
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
		return FileShouldConditionFactory.matchingPattern(this.fileCondition, pattern, this.patterns)
	}

	public withName(name: string): FilesShouldCondition {
		return FileShouldConditionFactory.withName(this.fileCondition, name, this.patterns)
	}

	public inFolder(folder: string): FilesShouldCondition {
		return FileShouldConditionFactory.inFolder(this.fileCondition, folder, this.patterns)
	}
}

class FileShouldConditionFactory {
	public static matchingPattern(fileCondition: FileConditionBuilder, pattern: string, patterns: string[] = []): FilesShouldCondition {
		return new FilesShouldCondition(fileCondition, [...patterns, pattern])
	}

	public static withName(fileCondition: FileConditionBuilder, name: string, patterns: string[] = []): FilesShouldCondition {
		return new FilesShouldCondition(fileCondition, [...patterns, ".*" + name + ".(ts|js)"])
	}

	public static inFolder(fileCondition: FileConditionBuilder, folder: string, patterns: string[] = []): FilesShouldCondition {
		return new FilesShouldCondition(fileCondition, [...patterns, ".*\\\\" + folder + "\\\\.*"])
	}
}

export class MatchPatternFileConditionBuilder {
	constructor(readonly filesShouldCondition: FilesShouldCondition,
				readonly isNegated: boolean) {}

	public matchPattern(pattern: string): MatchPatternFileCondition {
		return new MatchPatternFileCondition(this, pattern)
	}

	public beInFolder(folder: string): MatchPatternFileCondition {
		return new MatchPatternFileCondition(this, ".*\\\\" + folder + "\\\\.*")
	}
}

export class MatchPatternFileCondition {
	constructor(
		readonly matchPatternFileConditionBuilder: MatchPatternFileConditionBuilder,
		readonly pattern: string
	) {}

	public async check(): Promise<Result<ViolatingFile[], string>> {
		const graph = await extractGraph(
			this.matchPatternFileConditionBuilder.filesShouldCondition.fileCondition.tsConfigFilePath
		)

		if (graph.isErr()) {
			return err(graph.error)
		}

		const projectedNodes = projectToNodes(graph._unsafeUnwrap())

		// TODO where should this part happen?
		let preFiltered = projectedNodes
			.filter((node) => matchingAllPatterns(node.label,
				this.matchPatternFileConditionBuilder.filesShouldCondition.patterns))

		const violations = gatherRegexMatchingViolations(preFiltered, this.pattern, this.matchPatternFileConditionBuilder.isNegated)

		return ok(violations)
	}
}
