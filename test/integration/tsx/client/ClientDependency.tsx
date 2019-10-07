import { serverFunction } from "../server/ServerDependency"

export function SomeHtml() {
	return ( <div> {serverFunction()} </div> )
}
