import { FilterAccessor } from "./FilterAccessor"
import { ShouldAccessor } from "./ShouldAccessor"
export interface SubjectFilterAccessor
	extends FilterAccessor<SubjectFilterAccessor>,
		ShouldAccessor {}
