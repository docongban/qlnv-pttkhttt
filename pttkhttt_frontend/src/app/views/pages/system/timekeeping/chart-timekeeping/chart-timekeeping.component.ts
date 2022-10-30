import {ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {MatDialogRef} from '@angular/material/dialog';
import {CreateUpdateTimekeepingComponent} from '../create-update-timekeeping/create-update-timekeeping.component';
import {TimekeepingService} from '../../../../../core/service/service-model/timekeeping.service';

@Component({
  selector: 'kt-chart-timekeeping',
  templateUrl: './chart-timekeeping.component.html',
  styleUrls: ['./chart-timekeeping.component.scss']
})
export class ChartTimekeepingComponent implements OnInit {

  years= [
    {
      id: 2020,
      name: 'Năm 2020',
    },
    {
      id: 2021,
      name: 'Năm 2021',
    },
    {
      id: 2022,
      name: 'Năm 2022',
    },
    {
      id: 2023,
      name: 'Năm 2023',
    },
    {
      id: 2024,
      name: 'Năm 2024',
    },
    {
      id: 2025,
      name: 'Năm 2025',
    },
  ]
  months= [
    {
      id: 1,
      name: 'Tháng 01'
    },
    {
      id: 2,
      name: 'Tháng 02'
    },
    {
      id: 3,
      name: 'Tháng 03'
    },
    {
      id: 4,
      name: 'Tháng 04'
    },
    {
      id: 5,
      name: 'Tháng 05'
    },
    {
      id: 6,
      name: 'Tháng 06'
    },
    {
      id: 7,
      name: 'Tháng 07'
    },
    {
      id: 8,
      name: 'Tháng 08'
    },
    {
      id: 9,
      name: 'Tháng 09'
    },
    {
      id: 10,
      name: 'Tháng 10'
    },
    {
      id: 11,
      name: 'Tháng 11'
    },
    {
      id: 12,
      name: 'Tháng 12'
    }
  ]
  year
  month
  totalDays: any[] =[]
  employees: any[] =[]
  public barColor(point): string {
    return '#f26522';
  }

  constructor(
    public dialogRef: MatDialogRef<CreateUpdateTimekeepingComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    private timekeepingService: TimekeepingService
  ) {
  }

  ngOnInit(): void {
    this.year = new Date().getFullYear()
    this.month = new Date().getMonth() + 1
    this.doSearch()
  }

  doSearch(){
    const data={
      year: this.year,
      month: this.month
    }
    this.totalDays = []
    this.employees = []
    this.timekeepingService.handleChart(data).subscribe(res => {
      // tslint:disable-next-line:prefer-for-of
      for(let i = 0;i<res.length;i++){
        this.totalDays.push(res[i].totalDay)
      }
      // tslint:disable-next-line:prefer-for-of
      for(let i = 0;i<res.length;i++){
        this.employees.push(res[i].employeeName)
      }
      this.changeDetectorRef.detectChanges();
    })
  }

  onChangeYear(event){
    this.year = event
    this.changeDetectorRef.detectChanges();
  }

  closeModal(){
    this.dialogRef.close({event: 'cancel'});
  }

}
