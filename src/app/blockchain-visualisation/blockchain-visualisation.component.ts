import { Component, OnInit } from '@angular/core';
import { p2pService } from '../services/p2pService';
import { ChainData } from '../models/blockchain/ChainData';

@Component({
  selector: 'app-blockchain-visualisation',
  templateUrl: './blockchain-visualisation.component.html',
  styleUrls: ['./blockchain-visualisation.component.scss']
})
export class BlockchainVisualisationComponent implements OnInit {

  isLoading = true; // spinner loading
  chain: ChainData ;


  constructor(private p2p : p2pService) { }

  ngOnInit() {
    this.analyseChain();
  }


  analyseChain()
  {
    var temp_block = new ChainData();
    temp_block.setchainBlocks(this.p2p.chain.getchainBlocks());
    setTimeout(()=>
    {
    this.chain = temp_block.getchainBlocks();
    console.log("chain", this.chain);
      this.isLoading = false;
    },2000)
  }

}
