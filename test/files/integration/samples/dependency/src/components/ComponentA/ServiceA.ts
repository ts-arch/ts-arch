import {ServiceB} from "@components/ComponentB/ServiceB";

export class ServiceA {
	useB(b: ServiceB) {
		b.doStuff()
	}
}
