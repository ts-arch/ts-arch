import { FileSubjectFactory } from "../src/api/core/subject/FileSubjectFactory"

export const generatefileMock = (base, dir) =>
	jest.fn<File>(() => {
		return {
			parsedPath: {
				base: base,
				dir: dir
			}
		}
	})()

export const generateFileSubjectMock = (base, dir) =>
	FileSubjectFactory.buildFromFile(generatefileMock(base, dir))

export const generateAnimalSubjectsMock = () => [
	generateFileSubjectMock("DogService", "C://project/src/service"),
	generateFileSubjectMock("DogController", "C://project/src/controller"),
	generateFileSubjectMock("DogModel", "C://project/src/model"),
	generateFileSubjectMock("CatController", "C://project/src/controller"),
	generateFileSubjectMock("CatFactory", "C://project/src/factory")
]
