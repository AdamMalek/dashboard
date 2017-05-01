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
      this.dataService.setDataSource("https://raw.githubusercontent.com/AdamMalek/TestData/master/test"+(i+1)+".json");
  }

  json:string="dsa";

  generate(){
    // let data:IData = {
    //   labels: ["test1","test2","test3"],
    //   timestamp: Date.now(),
    //   data: [
    //     {
    //       date: new Date('2017-01-01'),
    //       installations: [1,2,3],
    //       revenue: [10,20,30]
    //     }
    //   ]
    // };

    // this.json = JSON.stringify(data);

  }
}
