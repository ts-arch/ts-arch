import { generateRule } from "./generateRules"

describe("generateRules", () => {
	it("generates positves rules", () => {
		const data = `
@startuml
 component [controllers]
 component [services]
 [controllers] --> [services]
@enduml
    `
		const rules = generateRule(data)

		expect(rules).toEqual({
			rules: [{ source: "controllers", target: "services" }],
			containedNodes: ["controllers", "services"]
		})
	})

	it("generates more complex rules", () => {
		const data = `
@startuml
 component [controllers]
 component [services]
 component [facades]
 [controllers] --> [services]
 [services] --> [facades]
@enduml
    `
		const rules = generateRule(data)

		expect(rules.rules).toContainEqual({ source: "controllers", target: "services" })
		expect(rules.rules).toContainEqual({ source: "services", target: "facades" })
	})
})
