import {MapFunction} from "../../common/processing/project";

export function perInternalEdge(): MapFunction {
	return (edge) => {
		if(edge.external === false) {
			return { sourceLabel: edge.source, targetLabel: edge.target };
		}
	}
}

export function perEdge(): MapFunction {
	return (edge) => {
		return { sourceLabel: edge.source, targetLabel: edge.target };
	}
}
