import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { instructionJson } from '../models/instruction-form';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }

  base_url=environment.base_url;
  helper_url=environment.base_helper_url;

  postInstructionFile(instruction:instructionJson){
    const headers = {'Content-Type': 'application/json'};
    return this.httpClient.post(this.base_url,JSON.stringify(instruction),{headers});
  }

  uploadSampleFile(sampleData){
    const headers = {'Content-Type': 'application/json'};
    return this.httpClient.post(this.helper_url,JSON.stringify(sampleData),{headers});
  }
}
