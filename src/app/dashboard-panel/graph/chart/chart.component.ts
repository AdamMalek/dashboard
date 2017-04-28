import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dashboard-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() dataProperty: string;

  canvasId: string = "chart-canvas";
  canvas: HTMLCanvasElement;
  height: number;
  width: number;
  ctx: CanvasRenderingContext2D;
  initialized: boolean = false;

  ngOnInit() {
    this.refreshData();
    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"] != null && this.initialized) {
      this.data = changes["data"].currentValue;
      this.refreshData();
      this.initialized = true;
    }
  }

  refreshData() {
    console.log(this.data);
  }

}
