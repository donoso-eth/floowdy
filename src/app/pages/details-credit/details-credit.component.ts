import { AfterViewInit, Component,  OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICREDIT_DELEGATED, ICREDIT_REQUESTED, ROLE } from 'angular-web3';

@Component({
  selector: 'app-details-credit',
  templateUrl: './details-credit.component.html',
  styleUrls: ['./details-credit.component.scss']
})
export class DetailsCreditComponent implements AfterViewInit {

  role!: ROLE;
  credit!: ICREDIT_DELEGATED
  constructor(public route: ActivatedRoute, public router: Router) { }

  ngAfterViewInit(): void {
    const id = this.route.snapshot.params['id'];
    console.log(id)

    if (id == undefined) {
      this.router.navigateByUrl('dashboard');
    }

  }

}
