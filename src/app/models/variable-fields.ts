import {mappedDetails} from './mapped-details';
export interface variableFields{
    columnType:string,
    isMapped:string,
    columnName?:string,
	columnLength?: number,
	columnIndex?:string,
    domain?:string,
    mappedDetails?:mappedDetails,
}