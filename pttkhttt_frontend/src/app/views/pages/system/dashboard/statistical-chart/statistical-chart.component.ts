import { Component, Input, OnInit } from '@angular/core';
import { NO_ROW_GRID_TEMPLATE} from "../../../../../helpers/constants";
import { DashboardComponent } from '../dashboard.component';

@Component({
  selector: 'kt-statistical-chart',
  templateUrl: './statistical-chart.component.html',
  styleUrls: ['./statistical-chart.component.scss']
})
export class StatisticalChartComponent implements OnInit {

  noRowDataTemPlate = NO_ROW_GRID_TEMPLATE;
  @Input()
  data : any;

  constructor(
    private dashboardComponent: DashboardComponent
  ) { }

  ngOnInit(): void {
  }

  public seriesLine = {
    type: 'line',
    data: [2000, 4000, 4500, 3000, 5000],
    stack: true,
    name: 'numberPeople',
    color: '#25CBD6',
    axis: 'numberPeople'
  }
  
  public seriesCol = {
      type: 'column',
      data: [30000, 38000, 40000, 32000, 42000],
      name: 'revenue',
      color:'#F26522',
      axis: 'revenue',
      width: 3,
  }

public valueAxes: any[] = [
  {
    name: 'revenue',
    title: 'Doanh thu ($)',
    color: 'rgb(216, 218, 229)',
    min: 0,
    max: 95000,
    majorUnit: 10000,
    majorGridLine:{
      width: 0
    },
    labels: {
      color: '#101840',
      font:'600 10px Inter',
      margin: {
        bottom: 20,
        right: -40,
      }
    }
  },
  {
      name: 'numberPeople',
      title: 'Số lượng người dùng',
      min: 0,
      max: 19000,
      majorUnit: 2000,
      color: 'rgb(216, 218, 229)',
      majorGridLine:{
        width: 0
      },
      labels: {
        color: '#101840',
        font:'600 10px Inter',
        margin: {
          bottom: 20,
          left : -40,
        }
      }
  }];

  public borderOptions = {
    // width: 5,
    // color: '#F26522',
    // borderRadius: 5
  };

  public makers = {
    visible: true,
    borderRadius: 10
  }

  public majorTicks = {
    size: 50,
    color: "rgb(216, 218, 229)",
    width: 1
  }

  public categoryMajorTicks = {
    size : 0,
    width: 0,
  }

public categories: string[] = ['GC_01', 'GC_02', 'GC_03', 'GC_04', 'GC_05','GC_06', 'GC_07', 'GC_08', 'GC_09', 'GC_010','GC_01', 'GC_02', 'GC_03', 'GC_04', 'GC_05'
];

labels = {
  
  rotation: {
    angle: -45,
    align: "center"
  },
  color: '#101840',
  font: 'bold 9px Inter',
}

// Align the first two value axes to the left
// and the last two to the right.
//
// Right alignment is done by specifying a
// crossing value greater than or equal to
// the number of categories.
public crossingValues: number[] = [0,100];

}
