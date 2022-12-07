import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { instructionJson } from '../models/instruction-form';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }

  base_url=environment.base_url;

  postInstructionFile(instruction:instructionJson){
    const headers = {'Content-Type': 'application/json'};
    return this.httpClient.post(this.base_url+"datacreator",JSON.stringify(instruction),{headers});
  }

  uploadSampleFile(sampleData){
    const headers = {'Content-Type': 'application/json'};
    return this.httpClient.post(this.base_url+"datacreatorhelper",JSON.stringify(sampleData),{headers});
  }

  retrieveInstructionFile(fileType:string):Observable<instructionJson>{
    //return this.httpClient.get<instructionJson>(this.base_url+"get-instruction/"+fileType);
    return this.httpClient.get<instructionJson>('assets/instruction_pnr.json');
  }
}
