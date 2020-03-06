import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Result } from './shared/result';
import { Observable, throwError, ObservableInput } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  
export class RestApiService {
    
    // Define API
    apiURL = 'http://localhost:5000';
    public pdffile:object;
    handleError: (err: any, caught: Observable<Result>) => ObservableInput<any>;
  
    constructor(private http: HttpClient) { }
    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
    }  

    getDocument(name: any):Observable<Result[]>{
        return this.http.get(this.apiURL + '/allDocuments/' + name).pipe(
            retry(1),
            catchError(this.handleError)
          )        
      } 

    getFormDocument(formData: any):Observable<Result[]>{
      return this.http.get(`http://localhost:5000/documents/?case_no=${formData.get('caseno')}&grievor=${formData.get('grievor')}&employer=${formData.get('employer')}&board=${formData.get('board')}&chair=${formData.get('chair')}&hearingDate=${formData.get('hearingDate')}&issueDate=${formData.get('issueDate')}&union=${formData.get('union')}`)
      .pipe(
            retry(1),
            catchError(this.handleError)
          )
        
    } 
}