import { Component, OnInit, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RestApiService } from '../app.services';
import * as _ from "lodash";
import { Result } from '../shared/result';
import { MdbTablePaginationComponent, MdbTableDirective, MdbTableService } from 'node_modules/angular-bootstrap-md/';

@Component({
  selector: 'app-textsearch',
  templateUrl: './textsearch.component.html',
  styleUrls: ['./textsearch.component.css'],
}) 

export class textsearchComponent implements OnInit {  
  @ViewChild(MdbTablePaginationComponent, { static: false }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: false }) mdbTable: MdbTableDirective;  

  public name:string = '';
  public pdffile: object = [];  
  public previous: object = [];
  public searchText: string = '';
  constructor( public restApi: RestApiService, private cdRef: ChangeDetectorRef){}

  @HostListener('input') oninput() { this.searchItems(); }
 
  onNameKeyUp(event:any){ 
    this.name = event.target.value;
  } 

  ngOnInit () {
  }

  arrUnique(arr: any) {
    var cleaned = [];
    arr.forEach(function(itm:any) {
      var unique = true;
      cleaned.forEach(function(itm2) {
        if (_.isEqual(itm, itm2)) unique = false;
        });
        if (unique)  cleaned.push(itm);
        });
    return cleaned;
  }

  getData(){
   return this.restApi.getDocument(this.name).subscribe((data: Result[]) => {
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