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

  //odstep miedzy grupami w px
  groupSpacing = 5;
  //odstep miedzy slupkami w grupie w px
  rectSpacing = 3;
  //lewy margines
  chartMargin = 5;
  rectWidth;
  pointRadius = 5;
  groupWidth;

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
    if (changes["data"].currentValue != null && !changes["data"].firstChange) {
      this.data = changes["data"].currentValue;
      this.refreshData();
    }
  }

  refreshData() {
    let canvas = this.getChart();
    if (!canvas.empty()) {
      this.calculateSizes();
      this.drawLegend();
      this.drawAxis();
      this.drawChart();
    }
  }

  drawAxis() {
    let axis = this.getAxis();

    axis.selectAll("g").remove();
    let width = +axis.attr("width");
    let height = +axis.attr("height") - 20;

    let max = this.getScale().domain()[1];

    let yAxis = axis.append("g").attr("class", "y-axis");

    yAxis.append("line")
      .attr("x1", 20)
      .attr("y1", 0)
      .attr("x2", 20)
      .attr("y2", height)
      .attr("style", "stroke:#888;stroke-width:1;shape-rendering:crispEdges");

    yAxis.append("line")
      .attr("x1", 20)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("style", "stroke:#888;stroke-width:1;shape-rendering:crispEdges");

    yAxis.append("line")
      .attr("x1", 20)
      .attr("y1", height / 2)
      .attr("x2", width)
      .attr("y2", height / 2)
      .attr("style", "stroke:#888;stroke-width:1;shape-rendering:crispEdges");

    yAxis.append("line")
      .attr("x1", 20)
      .attr("y1", height)
      .attr("x2", width)
      .attr("y2", height)
      .attr("style", "stroke:#888;stroke-width:1;shape-rendering:crispEdges");

    yAxis.append("text")
      .text(max)
      .attr("fill", "rgb(47,108,166)")
      .attr("style", "font-weight:bold")
      .attr("x", 0)
      .attr("y", 10);
    yAxis.append("text")
      .text(max / 2)
      .attr("style", "font-weight:bold")
      .attr("fill", "rgb(47,108,166)")
      .attr("x", 0)
      .attr("y", height / 2 + 5);
    yAxis.append("text")
      .text(0)
      .attr("style", "font-weight:bold")
      .attr("fill", "rgb(47,108,166)")
      .attr("x", 0)
      .attr("y", height);

    let xAxis = axis.append("g").attr("class", "x-axis").attr("transform", "translate(20," + height + ")").selectAll("g")
      .data(this.data.data)
      .enter();

    xAxis.append("line")
      .transition()
      .attr("x1", (d, i) => this.chartMargin + (i + 1) * (this.groupWidth + this.groupSpacing) - this.groupSpacing)
      .attr("x2", (d, i) => this.chartMargin + (i + 1) * (this.groupWidth + this.groupSpacing) - this.groupSpacing)
      .attr("y1", 0)
      .attr("y2", 5)
      .attr("style", "stroke:#888;stroke-width:1;shape-rendering:crispEdges");
    xAxis.append("text")
      .transition()
      .attr("x", (d, i) => this.chartMargin + i * (this.groupWidth + this.groupSpacing) + 10)
      .attr("y", 15)
      .attr("style", "font-weight:bold;font-size:0.8em")
      .attr("fill", "rgb(47,108,166)")
      .text((d, i) => "Week " + (i + 1));
  }

  calculateSizes() {
    let canvas = this.getChart();
    let height = +canvas.attr("height");

    let width = +canvas.attr("width") - this.chartMargin;
    let dataLen = this.data.data.map(x => x[this.dataProperty].length);
    let rectNr = this.d3.max(dataLen) * dataLen.length;
    this.rectWidth = (0.85 * width - 30) / rectNr;
    this.rectWidth = _.clamp(this.rectWidth, 0, 40);
    //szerokosc pojedynczej grupy (szerokosc slupkow + odstepy miedzy nimi)
    this.groupWidth = (this.rectWidth + this.rectSpacing) * this.d3.max(dataLen) - this.rectSpacing;
  }

  drawLineChart() {
    let d3 = this.d3;
    let canvas = this.getChart();
    let height = +canvas.attr("height");
    let width = +canvas.attr("width");
    let flatData = _.flatten(this.data.data.map(x => <number[]>x[this.dataProperty]));
    let scale = this.getScale();

    let group = canvas.selectAll("g.group")
      .data(this.data.data);

    //utworzenie grupy (każda grupa to zbiór wartości na dany tydzień)
    let point = group.enter()
      .append("g")
      .attr("class", "group")
      .attr("transform", (d, i) => "translate(" + (this.chartMargin + i * (this.groupWidth + this.groupSpacing)) + ",0)")
      .selectAll("circle")
      .data(d => <number[]>d[this.dataProperty]);

    // utworzenie punktu w nowo utworzonej grupie
    point.enter()
      .append("circle")
      .attr("cx", (d, i) => (this.groupWidth / 2))
      .attr("cy", height)
      .attr("r", this.pointRadius)
      .attr("fill", (d, i) => this.data.colors[i])
      .transition()
      .attr("cy", (d, i) => { return height - scale(d) })

    // update wartosci punktu
    group
      .attr("transform", (d, i) => "translate(" + (this.chartMargin + i * (this.groupWidth + this.groupSpacing)) + ",0)")
      .selectAll("circle")
      .data(d => <number[]>d[this.dataProperty])
      .transition()
      .attr("cx", (d, i) => (this.groupWidth / 2))
      .attr("cy", (d, i) => { return height - scale(d) })
      .attr("fill", (d, i) => this.data.colors[i]);

    // usuniecie punktu z grupy (np tydzien 1 -> [1,2,3], tydzien 2-> [1,2], ponizsze wykona sie dla punktu 3)
    group.selectAll("circle")
      .data(d => <number[]>d[this.dataProperty])
      .exit()
      .transition()
      .attr("fill", "black")
      .attr("cy", height)
      .remove();

    // utworzenie punktu w istniejacej grupie (np tydzien 1 -> [1,2], tydzien 2-> [1,2,3], ponizsze wykona sie dla punktu 3)
    group.selectAll("circle")
      .data(d => <number[]>d[this.dataProperty])
      .enter()
      .append("circle")
      .attr("cx", (d, i) => (this.groupWidth / 2))
      .attr("cy", height)
      .attr("r", this.pointRadius)
      .attr("fill", (d, i) => this.data.colors[i])
      .transition()
      .attr("cy", (d, i) => { return height - scale(d) })

    //usuniecie grupy
    group.exit()
      .selectAll("circle")
      .transition()
      .attr("fill", "black")
      .attr("cy", (d, i) => { return height; })
    group.exit().transition().remove();

    group.selectAll("line").remove();

    let vals = this.data.data.map(x => <number[]>x[this.dataProperty]);

    if (vals.length > 1) {
      for (let i = 0; i < vals.length; i++)
        for (let j = 0; j < vals.length; j++) {
          group.append("line")
               .attr("x1",()=> (i+1) * (this.groupWidth / 2) - this.groupWidth/2)
               .attr("")
        }
    }
  }

  getScale() {
    let d3 = this.d3;
    let canvas = this.getChart();

    let height = +canvas.attr("height");
    let width = +canvas.attr("width");
    let flatData: number[] = _.flatten(this.data.data.map(x => <number[]>x[this.dataProperty]));
    let max = d3.max(flatData);
    if (max > 6) {
      max = max + ((10 - (max % 10)) % 10);
    }
    else {
      max = 6;
    }

    return d3.scaleLinear()
      .domain([0, max])
      .range([0, height]);
  }

  drawBarChart() {
    let d3 = this.d3;

    let canvas = this.getChart();
    let height = +canvas.attr("height");
    let width = +canvas.attr("width");
    let flatData = _.flatten(this.data.data.map(x => <number[]>x[this.dataProperty]));
    let scale = this.getScale();

    let group = canvas.selectAll("g.group")
      .data(this.data.data);

    //utworzenie grupy (każda grupa to zbiór wartości na dany tydzień)
    let rect = group.enter()
      .append("g")
      .attr("class", "group")
      .attr("transform", (d, i) => "translate(" + (this.chartMargin + i * (this.groupWidth + this.groupSpacing)) + ",0)")
      .selectAll("rect")
      .data(d => <number[]>d[this.dataProperty]);

    // utworzenie słupka w nowo utworzonej grupie
    rect.enter()
      .append("rect")
      .attr("width", this.rectWidth)
      .attr("x", (d, i) => i * (this.rectWidth + this.rectSpacing))
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", (d, i) => this.data.colors[i])
      .transition()
      .attr("y", (d, i) => height - scale(d))
      .attr("height", (d) => scale(d));

    // update wartosci slupka
    group
      .attr("transform", (d, i) => "translate(" + (this.chartMargin + i * (this.groupWidth + this.groupSpacing)) + ",0)")
      .selectAll("rect")
      .data(d => <number[]>d[this.dataProperty])
      .transition()
      .attr("width", this.rectWidth)
      .attr("x", (d, i) => i * (this.rectWidth + this.rectSpacing))
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
      .attr("width", this.rectWidth)
      .attr("x", (d, i) => i * (this.rectWidth + this.rectSpacing))
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
    legend.selectAll("g").remove();
    if (this.data) {
      var list = legend.append("g").attr("height", "40");
      for (let i = 0; i < this.data.labels.length; i++) {
        var color = this.data.colors[i];
        var label = this.data.labels[i];
        let x = 15 + 70 * i;
        let y = +this.getCanvas().attr("height") - 20;
        let item = list.append("svg");
        item.append("circle").attr("cx", x).attr("cy", 30).attr("r", 5).attr("fill", color);
        item.append("text").attr("fill", "black").attr("style", "font-size:0.9em;").attr("x", x + 10).attr("y", 35).text(label);
      }
    }
  }

  private getCanvas() { return this.d3.select("." + this.id + " .chart-area svg"); }
  private getAxis() { return this.d3.select("." + this.id + " .chart-area .axis svg"); }
  private getChart() { return this.d3.select("." + this.id + " .chart-area .chart svg"); }
  private getLegend() { return this.d3.select("." + this.id + " .legend svg"); }
}
