import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { SpringAPiService } from 'src/app/services/SpringAPiService';
import { p2pService } from 'src/app/services/p2pService';
import { ChainData } from 'src/app/models/blockchain/ChainData';


@Component({
  selector: 'app-general-result',
  templateUrl: './general-result.component.html',
  styleUrls: ['./general-result.component.scss']
})
export class GeneralResultComponent implements OnInit {


  //parties_bar = [];
  parties_stat = [];
  parties_list = [];

  electeur_list= [];

  states: any =["Ariana", "Ben Arous", "Bizerte", "Béja", "Gabès", "Gafsa", "Jendouba", "Kairouan", "Kasserine", "Kebili", "Kef", "Mahdia", "Manouba", "Mednine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"];
  selectedState = '';
  state = '';

  total_eleteur: number = 2543652;
  doc_name = "Résultat d'élection - tunisie 2019";



  // exporting - http://www.shanegibney.com/shanegibney/angular2-and-jspdf-file-generation/
  // image expoerting - html2canvas -> http://html2canvas.hertzen.com/getting-started
  // pdf exporting - https://www.npmjs.com/package/jspdf
  
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  isLoading = true; // spinner loading
  stateIsLoading = true;

  constructor(private springApi : SpringAPiService, private p2p : p2pService) {
    var a = {
      name:"ahmed",
      percentage:20,
      qte:2653,
      image: 'https://www.tunisie-radio.com/sites/default/files/radio/radio-tunis-nationale-ldh-lwtny-ltwnsy.png'
    }
    //this.parties_stat.push(a);
    //this.isLoading = false;
   }

  ngOnInit() {
    this.getParties(); // uncomment this after
    this.getPersonneInscrit();
  }


  savePdf()
  {
    console.log('saving pdf...');
    
    html2canvas(this.screen.nativeElement).then(function(canvas) {
      var img = canvas.toDataURL("image/png");
      var doc = new jsPDF();
      doc.addImage(img,'JPEG',5,20);
      doc.save('Resultat-election-2019');
      });
  }
  saveImage()
  {
    console.log('saving image...');
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = this.doc_name+'.png';
      this.downloadLink.nativeElement.click();
    });
  }


  getParties()
  {
    this.springApi.getAllParti().subscribe(
      data => {
        this.parties_list = data;
        console.log(data);
        this.isLoading = false;
        for(var i=0;i<data.length;i++)
        {
          var temp = { id: data[i].parti_id,name:data[i].name , percentage:0 , qte:0 , image:data[i].image}
          this.parties_stat.push(temp);
        }
        console.log("parties stat", this.parties_stat);
        
        this.analysechain();


      },
      err => {
        console.log("error", err);
      }
    )
  }

  analysechain()
  {
    var temp_block = new ChainData();
    temp_block.setchainBlocks(this.p2p.chain.getchainBlocks());
    this.total_eleteur = temp_block.getchainBlocks().length -1;
    if(this.total_eleteur<0)this.total_eleteur=0;
    console.log("temp block from login",temp_block);
    setTimeout(()=>{
      for(var i=0;i<this.parties_stat.length;i++)
      {
        for(var j=0;j<temp_block.getchainBlocks().length;j++)
        {
          if((this.parties_stat[i].id == temp_block.getchainBlocks()[j].data.voted_to) && temp_block.getchainBlocks()[j].data.publicHash)
          {
            this.parties_stat[i].qte +=1;
          }
        }
      }
      console.log("parties stat after analysing", this.parties_stat)

      // set the percentage
      for(var j=0;j<this.parties_stat.length;j++)
      {
        if(this.total_eleteur==0)
        {
          this.parties_stat[j].percentage = 0;
        }
        else
        {
        var per = this.parties_stat[j].qte / this.total_eleteur * 100;
        this.parties_stat[j].percentage = per;
        }
      }

      this.stateIsLoading = false;
    },2000);

  }

  checkExist(id: any)
  {
    var key = null;

    for(var i=0;i<this.parties_stat.length;i++)
    {
      if(this.parties_stat[i].id == id)
      {
        key = i;
        break;
      }
    }
    return key;
  }


   getPersonneInscrit()
     {
       this.springApi.getAllElecteur().subscribe(
         data => {
           console.log('personne inscrit',data);
           this.electeur_list = data;
            
         },
         err => {
           console.log("Error getting inscrits", err);
         }
       )
     }
 
  analysechainState() // analyse chaine with specific entry
  {
    var temp_block = new ChainData();
    temp_block.setchainBlocks(this.p2p.chain.getchainBlocks());

    console.log("parti stat ",this.parties_stat);
    console.log("chain", temp_block.getchainBlocks());
    console.log("electeur list", this.electeur_list);

 
    var ele = 0;
    setTimeout(()=>{

      for(var i=0;i<this.electeur_list.length;i++)
      {
        if(this.electeur_list[i].bureau.adresse.state.toLocaleLowerCase() == this.state.toLocaleLowerCase())
        {
          console.log("true")
          for(var j=0;j<this.parties_stat.length;j++)
          {
            for(var k=0;k<temp_block.getchainBlocks().length;k++)
            { 
              if(this.electeur_list[i].hash_code == temp_block.getchainBlocks()[k].data.publicHash)
              {
                if(this.parties_stat[j].id == temp_block.getchainBlocks()[k].data.voted_to)
                {
                  ele++;
                  this.parties_stat[j].qte +=1;
                }
                else
                {
                  console.log("0");
                }
              }
            }
          }
          
        }else
        {
          console.log("false");
        }
      }
      console.log("State stat after analysing", this.parties_stat)

      // set the percentage
      for(var x=0;x<this.parties_stat.length;x++)
      {
        if(ele==0)
        {
          this.parties_stat[x].percentage = 0;
        }
        else
        {
          this.total_eleteur = ele;
        var per = this.parties_stat[x].qte / ele * 100;
        this.parties_stat[x].percentage = per;
        }
      }
      this.stateIsLoading = false;

    },2000);
  
  }

  selectState(selected)
  {
    this.stateIsLoading = true;
    this.total_eleteur = 0;
    if(selected == null )
    {
      this.state = '';
      for(var i=0;i<this.parties_stat.length;i++)
      {
        this.parties_stat[i].percentage = 0;
        this.parties_stat[i].qte = 0;
      }
      this.analysechain();
    }
    else
    {
      for(var i=0;i<this.parties_stat.length;i++)
      {
        this.parties_stat[i].percentage = 0;
        this.parties_stat[i].qte = 0;
      }
      this.state = selected;
      console.log('selected state:', this.state);
      this.analysechainState();
    }
    
  }
}
