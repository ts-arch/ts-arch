export interface TSArchConfig {
	ignore: IgnoreConfig;
}
export interface IgnoreConfig {
	declarations: boolean;
	nodeModules: boolean;
	js: boolean;
}
