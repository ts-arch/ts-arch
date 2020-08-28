import * as path from "path"

export class NormalizedPath {
	private _path: string

	constructor(path: string) {
		this._path = path.normalize(path)
	}

	get path(): string {
		return this._path
	}

	set path(value: string) {
		this._path = path.normalize(value)
	}
}
