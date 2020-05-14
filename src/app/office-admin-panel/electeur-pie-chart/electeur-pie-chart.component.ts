import { Component, OnInit, Input, Inject } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as exporting from 'highcharts/modules/exporting.src'; 


import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-electeur-pie-chart',
  templateUrl: './electeur-pie-chart.component.html',
  styleUrls: ['./electeur-pie-chart.component.scss']
})
export class ElecteurPieChartComponent implements OnInit {

  export:any = exporting; 
  
  @Input()
  pieData: any;

  office_region:any = "";
  
  Highcharts = Highcharts;
  chartOptions: any;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private bottomSheetRef: MatBottomSheetRef<ElecteurPieChartComponent>) 
    {

    this.export(Highcharts);

    this.pieData = data.pie;
    this.office_region = data.title;

    /*
    this.pieData.non_inscription = 3,
    this.pieData.inscription_non_vote = 20,
    this.pieData.voter = 40
    this.office_region = 'Ahmed';
    */
      
    }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }


  ngOnInit() {
    console.log("Data input");
    console.log(this.pieData);

    // initialise the pie chart 
    this.chartOptions = {
      colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: {
                cx: 0.5,
                cy: 0.3,
                r: 0.7
            },
            stops: [
                [0, color],
                //[1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    }),
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        className:'pie-chart-2019',
        //marginRight:230,
        width: 800,
        type: 'pie'
    },
    exporting: {
      enabled: true,
     },
     credits: {
      enabled: false
    },
    title: {
        text: 'Election Statistics , 2019 - Region of '+ this.office_region,
        style: {
          color: '#000',
          fontWeight: 'bold',
          fontSize: 14,
      }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>' //<b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} % (<b>{point.y}</b>)',
                style: {
                    color: ('#000') || 'black'
                }
            }
        }
    },
    series: [{
        name: 'Taux',
        colorByPoint: true,
        data: [{
            name: 'Non-registered people',
            y: this.pieData.non_inscription,
        }, {
            name: 'Registred but not voted',
            y: this.pieData.inscription_non_vote
        }, {
            name: 'People who voted',
            y: this.pieData.voter,
            sliced: true,
            selected: true
        }]
    }]

    }
  }

}
