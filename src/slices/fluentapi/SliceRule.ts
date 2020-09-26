import {ViolatingEdge} from "../assertions/admissibleEdges";

export interface EdgeRule {
	check(): Promise<ViolatingEdge[]>
}
