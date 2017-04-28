import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { D3, D3Service, Selection } from 'd3-ng2-service';
import { IData } from "app/common/data";

@Component({
  selector: 'dashboard-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() data: IData;
  @Input() dataProperty: string;

  d3: D3;
  id = "panel-" + Math.ceil(Math.random() * 9999999999999999);

  constructor(private element: ElementRef, d3Service: D3Service) {
    this.d3 = d3Service.getD3();
  }

  ngOnInit() {
    console.log(this.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"] != null && !changes["data"].firstChange) {
      this.data = changes["data"].currentValue;
      this.refreshData();
    }
  }

  refreshData() {
    this.drawLegend();
    this.drawLegend();
  }

  drawChart(){
    
  }

  drawLegend() {
    let legend = this.getLegend();
    legend.html("");
    if (this.data) {
      var list = legend.append("ul");
      this.data.labels.forEach((l) => {
        list.append("li").text(l);
      });
    }
  }

  private getChart() { return this.d3.select("." + this.id + " .chart-area"); }
  private getLegend() { return this.d3.select("." + this.id + " .legend-area"); }
}
