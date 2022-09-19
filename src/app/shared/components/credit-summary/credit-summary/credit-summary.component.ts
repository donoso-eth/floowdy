import { Component, OnInit, Input } from '@angular/core';
import { ICREDIT_DELEGATED, ROLE } from 'angular-web3';

@Component({
  selector: 'credit-summary',
  templateUrl: './credit-summary.component.html',
  styleUrls: ['./credit-summary.component.scss']
})
export class CreditSummaryComponent implements OnInit {

  constructor() { }

  @Input() credit!:ICREDIT_DELEGATED;
  @Input() role!: ROLE
  ngOnInit(): void {
  }

}
