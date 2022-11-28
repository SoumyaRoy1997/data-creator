import {variableFields} from './variable-fields'

export interface instructionJson{
    sampleFilename:string,
	fileType:string,
	fileLocation:string,
	outputFolder:string,
	outputFilename:string,
	folders:string,
	files:string,
	records:string,
	indent?:string
	isFileLocal?:string,
	sampleFileHeader?:string,
    variableRecords?:variableFields[]
}