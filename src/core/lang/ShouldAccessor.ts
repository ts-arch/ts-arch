import { RuleAccessor } from "./RuleAccessor"
export interface ShouldAccessor {
	should(): RuleAccessor
	shouldNot(): RuleAccessor
}
