import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DataService } from "app/common/data.service";
import { IData, IChartData } from "app/common/data";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'dashboard-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, OnDestroy {
  @Input() icon: string;
  @Input() header: string;
  @Input() summaryText: string;
  @Input() buttonText: string;
  @Input() additionalHtml: string;
  @Input() dataProperty: string;

  dataTimestamp: number = 0;
  dataSub: Subscription;
  chartData: IData;
  value: number = 0;
  fakeTimestamp:boolean = true;

  constructor(private dataService: DataService) { }

  refreshData() {
    if (this.chartData) {
      this.value = 0;
      for (let data of this.chartData.data) {
        var items: any[] = data[this.dataProperty];
        if (items) {
          for (let v of items) {
            this.value += v;
          }
        }
      }
    }
    else {
      this.value = 0;
    }
  }

  ngOnInit() {
    this.dataSub = this.dataService.dataUpdated.subscribe((data) => {
      let d = data as IData;

      if (d) {
        if (this.fakeTimestamp){
        //symuluje dostarczenie nowszych danych niż aktualne
        d.timestamp = Date.now();
        }

        if (this.dataTimestamp < d.timestamp) {
          this.chartData = d;
          this.refreshData();
          this.dataTimestamp = d.timestamp;
        }
      }
    })
    this.refreshData();
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }
}
