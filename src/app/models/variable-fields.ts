import {mappedDetails} from './mapped-details';
export interface variableFields{
    columnType?:string,
    isMapped:string,
    columnName?:string,
	columnLength?: number,
	columnIndex?:string,
    domain?:string,
    mappedDetails?:mappedDetails,
    sampleData?:string,
    dateFormat?:string,
	startDate?:string,
	decrement?:string,
    increment?:string,
    checkFlag?:boolean
}