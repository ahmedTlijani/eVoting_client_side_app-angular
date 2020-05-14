import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-countdown-component',
  templateUrl: './countdown-component.component.html',
  styleUrls: ['./countdown-component.component.scss']
})
export class CountdownComponentComponent implements OnInit {

  @Input()
  deadline: string;
  //deadline = 'November 10 2019 00:00:00 GMT+0200';

  days: any = '00';
  hours: any = '00';
  minutes: any = '00';
  seconds: any = '00';

  constructor() { }

  ngOnInit() {
    this.setDate();
  }

  setDate()
  {
    setTimeout(()=>{
      let a = this.getTimeRemaining(this.deadline);
      //console.log(a.total);
      this.days = a.days;
      this.hours = a.hours;
      this.minutes = a.minutes;
      this.seconds = a.seconds;
      this.setDate();
    },1000)
  }

  getTimeRemaining(endtime: string){
    let d = new Date();
    var t = Date.parse(endtime) - Date.parse(d.toString());
    //console.log(t);
    var seconds = this.n( Math.floor( (t/1000) % 60 ) );
    var minutes = this.n( Math.floor( (t/1000/60) % 60 ) );
    var hours = this.n( Math.floor( (t/(1000*60*60)) % 24 ) );
    var days = this.n( Math.floor( t/(1000*60*60*24) ) );
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}


n(n){ return n > 9 ? "" + n: "0" + n; }

}
