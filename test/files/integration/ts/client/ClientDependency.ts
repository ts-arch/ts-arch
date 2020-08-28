import { serverFunction } from "../server/ServerDependency"
import "glob"

export function someString() {
	return serverFunction()
}
