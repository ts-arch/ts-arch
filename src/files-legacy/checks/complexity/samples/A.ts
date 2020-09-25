// =13
export class A {
	// =10
	public firstMethod() {
		console.log("a") // +1
		console.log("b") // +1
		const something = "b" // +1
		if (something === "b") {
			// +1
			console.log("c") // +1
		} else {
			console.log("else") // +1
		}
		switch (something) {
			case "b": // +1
				return console.log("e") // +1
			default:
				// +1
				return console.log("f") // +1
		}
	}

	// =3
	public secondMethod() {
		console.log("a") // +1
		console.log("b") // +1
		this.firstMethod() // +1
	}
}
