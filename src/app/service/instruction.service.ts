import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class InstructionService {
    private subject = new Subject();
 
    sendInstruction(instruction) {
        this.subject.next(instruction);
    }
 
    clearInstruction() {
        this.subject.next();
    }
 
    getInstruction(): Observable<any> {
        return this.subject.asObservable();
    }
}