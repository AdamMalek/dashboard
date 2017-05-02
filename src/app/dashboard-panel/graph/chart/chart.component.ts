import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { D3, D3Service, Selection } from 'd3-ng2-service';
import { IData } from "app/common/data";
import * as _ from 'lodash';

@Component({
  selector: 'dashboard-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() data: IData;
  @Input() dataProperty: string;
  @Input() chartType: string = "bar";
  drawChart: () => void;

  d3: D3;
  id = "panel-" + Math.ceil(Math.random() * 9999999999999999);

  constructor(private element: ElementRef, d3Service: D3Service) {
    this.d3 = d3Service.getD3();
  }

  ngOnInit() {
    switch (this.chartType) {
      case "bar":
        this.drawChart = this.drawBarChart;
        break;
      case "line":
        this.drawChart = this.drawLineChart;
        break;
      default:
        console.log("invalid chart type");
        this.drawChart = () => { };
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"] != null && !changes["data"].firstChange) {
      this.data = changes["data"].currentValue;
      this.refreshData();
    }
  }

  refreshData() {
    let canvas = this.getChart();
    if (!canvas.empty()) {
      this.drawLegend();
      this.drawAxis();
      this.drawChart();
    }
  }

  drawAxis() {
    let d3 = this.d3;
    let canvas = this.getChart();

    let scale = this.getScale();
    let max = scale.range()[1];

    scale.range([max, 0]);

    let axis = d3.axisLeft(this.getScale())
      .ticks(1)
      .tickFormat((d) => {
        return (max - <number>d).toString();
      });
    canvas.select("g.axis").call(axis).selectAll("line").remove();
  }

  drawLineChart() {

  }

  getScale() {
    let d3 = this.d3;
    let canvas = this.getChart();

    let height = +canvas.attr("height");
    let width = +canvas.attr("width");
    let flatData: number[] = _.flatten(this.data.data.map(x => <number[]>x[this.dataProperty]));
    let max = d3.max(flatData);

    return d3.scaleLinear()
      .domain([0, max])
      .range([0, height]);
  }

  drawBarChart() {
    let d3 = this.d3;

    let screen = this.getCanvas();
    let canvas = this.getChart();
    let height = +screen.attr("height");
    let width = +screen.attr("width");
    let flatData = _.flatten(this.data.data.map(x => <number[]>x[this.dataProperty]));
    let max = d3.max(flatData);
    let scale = this.getScale();

    let group = canvas.selectAll("g.group")
      .data(this.data.data);

    //odstep miedzy grupami w px
    let groupSpacing = 5;
    //odstep miedzy slupkami w grupie w px
    let rectSpacing = 3;
    //lewy margines
    let chartMargin = 40;
    let dataLen = this.data.data.map(x => x[this.dataProperty].length);
    let rectNr = d3.max(dataLen) * dataLen.length;
    let rectWidth = (0.8 * width) / rectNr;
    rectWidth = _.clamp(rectWidth, 0, 40);
    //szerokosc pojedynczej grupy (szerokosc slupkow + odstepy miedzy nimi)
    let groupWidth = (rectWidth + rectSpacing) * d3.max(dataLen) - rectSpacing;

    //utworzenie grupy (każda grupa to zbiór wartości na dany tydzień)
    let rect = group.enter()
      .append("g")
      .attr("class", "group")
      .attr("transform", (d, i) => "translate(" + (chartMargin + i * (groupWidth + groupSpacing)) + ",10)")
      .selectAll("rect")
      .data(d => <number[]>d[this.dataProperty]);

    // utworzenie słupka w nowo utworzonej grupie
    rect.enter()
      .append("rect")
      .attr("width", rectWidth)
      .attr("x", (d, i) => i * (rectWidth + rectSpacing))
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", (d, i) => this.data.colors[i])
      .transition()
      .attr("y", (d, i) => height - scale(d))
      .attr("height", (d) => scale(d));

    // update wartosci slupka
    group
      .attr("transform", (d, i) => "translate(" + (chartMargin + i * (groupWidth + groupSpacing)) + ",10)")
      .selectAll("rect")
      .data(d => <number[]>d[this.dataProperty])
      .transition()
      .attr("width", rectWidth)
      .attr("y", (d, i) => height - scale(<number>d))
      .attr("height", (d) => scale(<number>d))
      .attr("fill", (d, i) => this.data.colors[i]);

    // usuniecie slupka z grupy (np tydzien 1 -> [1,2,3], tydzien 2-> [1,2], ponizsze wykona sie dla slupka 3)
    group.selectAll("rect")
      .data(d => <number[]>d[this.dataProperty])
      .exit()
      .transition()
      .attr("fill", "black")
      .attr("y", height)
      .attr("height", 0)
      .remove();

    // utworzenie slupka w istniejacej grupie (np tydzien 1 -> [1,2], tydzien 2-> [1,2,3], ponizsze wykona sie dla slupka 3)
    group.selectAll("rect")
      .data(d => <number[]>d[this.dataProperty])
      .enter()
      .append("rect")
      .attr("width", rectWidth)
      .attr("x", (d, i) => i * (rectWidth + rectSpacing))
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", (d, i) => this.data.colors[i])
      .transition()
      .attr("y", (d, i) => height - scale(d))
      .attr("height", (d) => scale(d));

    //usuniecie grupy
    group.exit()
      .selectAll("rect")
      .transition()
      .attr("fill", "black")
      .attr("height", 10)
      .attr("y", height)
    group.exit().transition().remove();

  }

  drawLegend() {
    let legend = this.getLegend();
    legend.html("");
    if (this.data) {
      var list = legend.append("svg").attr("height", "40");
      for (let i = 0; i < this.data.labels.length; i++) {
        var color = this.data.colors[i];
        var label = this.data.labels[i];
        let x = 15 + 70 * i;
        let y = 15;
        let item = list.append("svg").attr("text-align", "center");
        item.append("circle").attr("cx", x).attr("cy", 15).attr("r", 5).attr("fill", color);
        item.append("text").attr("x", x + 10).attr("y", 20).attr("fill", "black").text(label);
      }
    }
  }

  private getCanvas() { return this.d3.select("." + this.id + " .chart-area svg"); }
  private getChart() { return this.d3.select("." + this.id + " .chart-area .chart"); }
  private getLegend() { return this.d3.select("." + this.id + " .legend-area"); }
}
