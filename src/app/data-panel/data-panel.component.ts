import { Component, OnInit } from '@angular/core';
import { DataService } from "app/common/data.service";
import { IData } from "app/common/data";

@Component({
  selector: 'dashboard-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss']
})
export class DataPanelComponent implements OnInit {

  constructor(private dataService:DataService) { }

  dataSource:string;

  setDataSource(){
    if (this.dataSource != ""){
      this.dataService.setDataSource(this.dataSource);
    }
  }
  ngOnInit() {
    this.dataSource = this.dataService.getDataSource();
  }

  set(i){
      this.dataService.setDataSource("http://localhost:3000/test"+(i+1)+".json");
  }
}
