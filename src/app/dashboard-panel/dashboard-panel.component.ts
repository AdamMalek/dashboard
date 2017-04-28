import { Component, OnInit } from '@angular/core';
import { panels } from './panels';

@Component({
  selector: 'dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.scss']
})
export class DashboardPanelComponent implements OnInit {

  constructor() { }
  panelConfig;
  ngOnInit() {
    this.panelConfig = panels;
  }
}
