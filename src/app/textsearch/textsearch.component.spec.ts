import { textsearchComponent } from './textsearch.component';
import { RestApiService } from '../app.services';
import { Result } from '../shared/result';
import { ChangeDetectorRef } from '@angular/core';
import { Observable, from } from 'rxjs';

describe('AppComponent', () => {
  let component: textsearchComponent;
  let service: RestApiService;
  let cdRef: ChangeDetectorRef;

  beforeEach(() => {
    service = new RestApiService(null);
    component = new textsearchComponent(service, cdRef);
  });

  it('should set results property with the items returned from the server', () => {
    // Arrange - Setup
    const results: Result[] = [
      {
        case_no: "255-17", 
        cases_cited: "255-17", 
        date_issued: "2017-05-19", 
        employer: "Community Safety and Correctional Services", 
        file_name: "Judicial Review Application 255-17.pdf", 
        grievor: " ", 
        judicial_review: " ", 
        pdf_path: "http://localhost:4200/assets/pdf/1975/Judicial Review Application 255-17.pdf", 
        union: "OPSEU", 
        year: "2017"
      }
    ];

    spyOn(service, 'getDocument').and.callFake(() => {
      return from([results]);
    });

    // Act - Make the actual call
    component.getData(); 

    // Assert - Check and report whether the test is pass or fail
    expect(component.pdffile).toEqual(results);
  });
})