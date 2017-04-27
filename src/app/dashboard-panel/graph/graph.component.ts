import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dashboard-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  @Input() icon:string;
  @Input() header:string;
  @Input() summaryText:string;
  @Input() buttonText:string;
  @Input() additionalHtml:string;
  sum:number= 123423;

  constructor() { }

  ngOnInit() {
  }

}