import { serverFunction } from "../server/ServerDependency"

export function someString() {
	return serverFunction()
}
