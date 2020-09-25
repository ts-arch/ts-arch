import {Result} from "neverthrow";
import {ViolatingEdge} from "../assertions/admissibleEdges";

export interface EdgeRule {
	check(): Promise<Result<ViolatingEdge[], string>>
}
