import { SourceFile } from "typescript"
import { FileFactory } from "../src/core/noun/FileFactory"

export const generatefileMock = fileName =>
	jest.fn<SourceFile>(() => {
		return {
			fileName: fileName
		}
	})()

export const generateFileSubjectMock = fileName =>
	FileFactory.buildFromSourceFile(generatefileMock(fileName))

export const generateAnimalSubjectsMock = () => [
	generateFileSubjectMock("C://project/src/service/DogService"),
	generateFileSubjectMock("C://project/src/controller/DogController"),
	generateFileSubjectMock("C://project/src/model/DogModel"),
	generateFileSubjectMock("C://project/src/controller/CatController"),
	generateFileSubjectMock("C://project/src/factory/CatFactory")
]
