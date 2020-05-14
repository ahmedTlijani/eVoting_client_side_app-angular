import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as exporting from 'highcharts/modules/exporting.src'; 

import { SpringAPiService } from '../services/SpringAPiService';
import { p2pService } from '../services/p2pService';

@Component({
  selector: 'app-voter-inscription-chart',
  templateUrl: './voter-inscription-chart.component.html',
  styleUrls: ['./voter-inscription-chart.component.scss']
})
export class VoterInscriptionChartComponent implements OnInit{

  //https://github.com/highcharts/highcharts-angular

Highcharts = Highcharts;
chartOptions: any;
export:any = exporting;  // for exporting


states: any =["Ariana", "Ben Arous", "Bizerte", "Béja", "Gabès", "Gafsa", "Jendouba", "Kairouan", "Kasserine", "Kebili", "Kef", "Mahdia", "Manouba", "Mednine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"];

populationData: any =[];

inscriptionData: any = [];

votingData: any =[];

pop = Array(this.states.length); // number of people based on states liste order
elec = Array(this.states.length);;
vot = Array(this.states.length);;


color_vote: "#ec1717";
color_population: "#ec1717";
color_inscription: "#ec1717";


  constructor(private springService: SpringAPiService, private blockchainService: p2pService) {
    this.export(Highcharts);
   }

  ngOnInit () {
    this.pop.fill(0); this.elec.fill(0); this.vot.fill(0);
    this.getPopulation();
    this.getPersonneInscrit();

    // initilisationation
    this.chartOptions = {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Number of registration by region 2019'
        },
        subtitle: {
            text: 'Election Platforme'
        },
        xAxis: [{
            categories: this.states, // states 
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
          title: {
              text: 'Number of registration', 
              style: {
                  color: this.color_inscription
              }
          },
          labels: {
                format: '{value} Voter',
                style: {
                    color: this.color_inscription
                }
            }     
        },
        { // Tertiary yAxis
          gridLineWidth: 0,
          title: {
              text: 'Number of votes',
              style: {
                  color: this.color_vote
              }
          },
          labels: {
              format: '{value} Voter',
              style: {
                  color: this.color_vote
              }
          },
          opposite: true
      }
      ],
        
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 40,
            floating: true,
        },
        series: [{
            name: 'Number of registration',
            type: 'spline',
            data: [],
            marker: {
              fillColor: 'white',
              lineWidth: 1,
              lineColor: "#50a4bb"
            },
            color: "#50a4bb",
            tooltip: {
                valueSuffix: ' Person'
            }
        },
        {
          name: 'Number of votes',
          type: 'spline',
          data: [],
          marker: {
              fillColor: 'white',
              lineWidth: 1,
              lineColor: "#0aacd8"
            },
          color: "#0aacd8",
          tooltip: {
              valueSuffix: ' Voter'
          }
      }]
      }


  }

  makeChart()
  {
    this.chartOptions = {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Number of registration by region 2019'
        },
        subtitle: {
            text: 'Election Platforme'
        },
        xAxis: [{
            categories: this.states, // states 
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
          title: {
              text: 'Number of registration', 
              style: {
                  color: this.color_inscription
              }
          },
          labels: {
                format: '{value} Voter',
                style: {
                    color: this.color_inscription
                }
            }     
        },{ // Tertiary yAxis
          gridLineWidth: 0,
          title: {
              text: 'Number of votes',
              style: {
                  color: this.color_vote
              }
          },
          labels: {
              format: '{value} Voter',
              style: {
                  color: this.color_vote
              }
          },
          opposite: true
      }
      ],
        
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 40,
            floating: true,
        },
        series: [{
            name: 'Number of registration',
            type: 'column',
            data: this.elec,
            marker: {
              fillColor: 'white',
              lineWidth: 1,
              lineColor: "#50a4bb"
            },
            color: "#50a4bb",
            tooltip: {
                valueSuffix: ' Person'
            }
        },
        {
          name: 'Numbre of votes',
          type: 'spline',
          data: this.vot,
          marker: {
              fillColor: 'white',
              lineWidth: 1,
              lineColor: "#0aacd8"
            },
          color: "#0aacd8",
          tooltip: {
              valueSuffix: ' Voter'
          }
      }],responsive: {
          rules: [{
              condition: {
                  maxWidth: 500
              },
              chartOptions: {
                  legend: {
                      floating: false,
                      layout: 'horizontal',
                      align: 'center',
                      verticalAlign: 'bottom',
                      x: 0,
                      y: 0
                  }
              }
          }]
      }
      }
  }

     // get all voting offices 
     getPersonneInscrit()
     {
       this.springService.getAllElecteur().subscribe(
         data => {
           console.log('personne inscrit',data);
           this.inscriptionData = data;
           this.fillInscrit();
           setTimeout(()=>{
            this.getVoted();
          },2000);
         },
         err => {
           console.log("Error getting inscrits", err);
         }
       )
     }
 
     fillInscrit()
     {
         if(!this.inscriptionData) {console.log("empty");return;};
         for(var i=0;i<this.states.length;i++)
         {
             for(var j=0;j<this.inscriptionData.length;j++)
             {
                 if(this.inscriptionData[j].bureau.adresse.state == this.states[i])
                 {
                     this.elec[i]+=1;
                 }
             }
         }
 
     this.makeChart();
     console.log('inscrit after calculation', this.elec);
 
     }

     getPopulation()
     {
       this.springService.getAllPeopleDataSet().subscribe(
         data => {
           console.log('popuplation',data);
           this.populationData = data;
           this.fillPop();
         },
         err => {
           console.log("Error getting datset", err);
         }
       )
     }

     fillPop()
    {
        if(!this.populationData) {console.log("empty");return;};
        for(var i=0;i<this.states.length;i++)
        {
            for(var j=0;j<this.populationData.length;j++)
            {
                if(this.populationData[j].adresse.state == this.states[i])
                {
                    this.pop[i]+=1;
                }
            }
        }

    this.makeChart();
    console.log('pop after calculation', this.pop);

    }
 
     getVoted() // blockchain
     {
       this.votingData = this.blockchainService.chain.getchainBlocks();
       console.log('voted',this.votingData);
       this.fillVoted();
     }

     fillVoted()
     {
        for(var i=0;i<this.states.length;i++) // check all states 
        {
            for(var j=0;j<this.votingData.length;j++) // check all chainblocks
            {
                for(var k=0;k<this.inscriptionData.length;k++) // check all electeurs 
                {
                    if(this.votingData[j].data.publicHash == this.inscriptionData[k].hash_code) // if the same hash get the adresse 
                    {
                        if(this.inscriptionData[k].bureau.adresse.state == this.states[i]) // comapre the adresse with lecteur adresse
                        {
                            this.vot[i]+=1;
                        }                        
                    }
                }
                
            }
        }
    this.makeChart();
    console.log('block result after calculation', this.vot);  
     }




     
  setDataSet()
  {
      let min_number = 400000;
      let max_number = 700000;
      for(let i=0;i<24;i++)
      {
          this.pop[i] =  Math.floor(Math.random() * max_number) + min_number;
          this.elec[i] = Math.floor(Math.random() * this.pop[i]) + min_number;
          this.vot[i] = Math.floor(Math.random() * this.elec[i]) + min_number;
      }
  }




}
