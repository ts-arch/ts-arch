export class RegexFactory {
	public static fileNameMatcher(name: string) { return ".*" + name + ".(ts|js)" }
	public static folderMatcher(folder: string) { return ".*\\\\" + folder + "\\\\.*" }
}
