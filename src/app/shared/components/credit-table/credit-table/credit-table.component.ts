import { Component, Input, OnInit } from '@angular/core';
import { ICREDIT_DELEGATED } from 'angular-web3';

@Component({
  selector: 'credit-table',
  templateUrl: './credit-table.component.html',
  styleUrls: ['./credit-table.component.scss']
})
export class CreditTableComponent implements OnInit {



  products:any;
  constructor() {
  
   }

   @Input() credits!:Array<ICREDIT_DELEGATED>
    

   goToCredit(id:string){

   }

   checkOut(id:string) {

   }
   
  ngOnInit(): void {
  }

}
