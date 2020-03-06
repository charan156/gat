import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient } from '@angular/common/http'; 
import { RestApiService } from '../app.services';
import { Result } from '../shared/result';
import { MdbTablePaginationComponent, MdbTableDirective, MdbTableService } from 'node_modules/angular-bootstrap-md/';


@Component({
  selector: 'app-searchform',
  templateUrl: './searchform.component.html',
  styleUrls: ['./searchform.component.css']
})

export class SearchformComponent implements OnInit {
  @ViewChild(MdbTablePaginationComponent, { static: false }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: false }) mdbTable: MdbTableDirective;  

  form: FormGroup;
  public pdffile:object = [];
  public previous:object = [];
  public searchText: string = '';
  constructor(public fb: FormBuilder, public restApi: RestApiService, private cdRef: ChangeDetectorRef) {
    this.form = fb.group({
      caseno: [''],
      grievor: [''], 
      employer: [''],  
      board: [''],
      chair: [''],
      hearingDate: [''],
      issueDate: [''],
      union: ['']
    })
  }

  @HostListener('input') oninput() { this.searchItems(); }

  ngOnInit() {  
  }   

  submitForm() {
    var formData: any = new FormData(); 
    formData.append("caseno", this.form.get('caseno').value);
    formData.append("grievor", this.form.get('grievor').value);   
    formData.append("employer", this.form.get('employer').value);
    formData.append("board", this.form.get('board').value);
    formData.append("chair", this.form.get('chair').value);
    formData.append("hearingDate", this.form.get('hearingDate').value);
    formData.append("issueDate", this.form.get('issueDate').value);
    formData.append("union", this.form.get('union').value);  
    return this.restApi.getFormDocument(formData).subscribe((data: Result[]) => {
      //@ts-ignore
      this.pdffile = data;
      console.log(this.pdffile);
      this.mdbTable.setDataSource(this.pdffile); 
      this.pdffile = this.mdbTable.getDataSource();    
      this.previous = this.mdbTable.getDataSource();
      this.mdbTablePagination.setMaxVisibleItemsNumberTo(10);
      this.mdbTablePagination.calculateFirstItemIndex();
      this.mdbTablePagination.calculateLastItemIndex();
      this.cdRef.detectChanges(); 
    });    
  }

    searchItems() {
    const previ = this.mdbTable.getDataSource();
    if (!this.searchText) {
    this.mdbTable.setDataSource(this.previous); 
    this.pdffile = this.mdbTable.getDataSource(); 
    }
    if (this.searchText) { 
    this.pdffile = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['union','employer','case_no','grievor','date_issued','file_name','cases_cited']);
    this.mdbTable.setDataSource(previ);
      }
     }  

}
