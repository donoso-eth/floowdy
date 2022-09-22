import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lens-profile',
  templateUrl: './lens-profile.component.html',
  styleUrls: ['./lens-profile.component.scss']
})
export class LensProfileComponent implements OnInit {

  constructor() { }

  @Input() profile! :any

  ngOnInit(): void {
    console.log(this.profile);
  }

  

}
