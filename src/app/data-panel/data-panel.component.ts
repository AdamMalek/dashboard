import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dashboard-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss']
})
export class DataPanelComponent implements OnInit {

  constructor() { }

  dataSource:string;

  ngOnInit() {
    
  }

}
