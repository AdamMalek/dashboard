import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http } from "@angular/http";

@Injectable()
export class DataService {

  dataSource: string = "";
  @Output() sourceChanged:EventEmitter<string> = new EventEmitter<string>(); 

    constructor(private _http: Http) { }

  getDataSource(): string {
    return this.dataSource;
  }

  setDataSource(dataSource: string): void {
    this.dataSource = dataSource;
    this.sourceChanged.emit(dataSource);
  }

  getData() {
    
  }
}
