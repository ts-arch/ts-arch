import {Result} from "neverthrow";
import {ViolatingFile} from "../assertions/matchingFiles";

export interface FileRule {
	check(): Promise<Result<ViolatingFile[], string>>
}
