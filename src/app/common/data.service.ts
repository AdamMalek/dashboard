import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http } from "@angular/http";
import { IData } from "app/common/data";
import { Observable } from "rxjs";

@Injectable()
export class DataService {

  dataSource: string = "https://raw.githubusercontent.com/AdamMalek/TestData/master/test1.json";
  @Output() dataUpdated: EventEmitter<IData> = new EventEmitter<IData>();

  constructor(private _http: Http) { 
    this.getData();
  }

  getDataSource(): string {
    return this.dataSource;
  }

  setDataSource(dataSource: string): void {
    this.dataSource = dataSource;
    this.getData();
  }

  private getData(): void {
    if (this.dataSource == "") {
      this.dataUpdated.emit(null);
    }
    else {
      this._http.get(this.dataSource).subscribe(
        (data) => {
            this.dataUpdated.emit(data.json());
        },
        () => {
            this.dataUpdated.emit(null);
        });
    }
  }
}
