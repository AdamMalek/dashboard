import { Component, OnInit } from '@angular/core';
import { DataService } from "app/common/data.service";
import { IData } from "app/common/data";

@Component({
  selector: 'dashboard-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss']
})
export class DataPanelComponent implements OnInit {

  constructor(private dataService: DataService) { }

  dataSource: string;
  updating = false;

  setDataSource() {
    if (this.dataSource != "") {
      this.dataService.setDataSource(this.dataSource);
      this.updating = true;
    }
  }
  ngOnInit() {
    this.dataService.dataUpdated.subscribe(() => {
      this.dataSource = this.dataService.getDataSource();
      this.updating = false;
    });
  }

  set(i) {
    this.dataService.setDataSource("https://raw.githubusercontent.com/AdamMalek/TestData/master/test" + (i + 1) + ".json");
      this.updating = true;
  }
}
