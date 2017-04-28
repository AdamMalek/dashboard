import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DataPanelComponent } from './data-panel/data-panel.component';
import { DashboardPanelComponent } from './dashboard-panel/dashboard-panel.component';
import { DataService } from "app/common/data.service";
import { GraphComponent } from './dashboard-panel/graph/graph.component';
import { ChartComponent } from "app/dashboard-panel/graph/chart/chart.component";
import { D3Service } from "d3-ng2-service";

@NgModule({
  declarations: [
    AppComponent,
    DataPanelComponent,
    DashboardPanelComponent,
    GraphComponent,
    ChartComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [DataService, D3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
