import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LensProfileComponent } from './lens-profile/lens-profile.component';



@NgModule({
  declarations: [
    LensProfileComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LensProfileComponent
  ]
})
export class LensProfileModule { }
