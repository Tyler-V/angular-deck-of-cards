
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule, MatCheckboxModule, MatSelectModule,
  MatSliderModule, MatCardModule, MatToolbarModule, MatInputModule
} from '@angular/material';

@NgModule({
  imports: [FlexLayoutModule, MatButtonModule, MatCheckboxModule,
    MatSelectModule, MatSliderModule, MatCardModule, MatToolbarModule, MatInputModule],
  exports: [FlexLayoutModule, MatButtonModule, MatCheckboxModule,
    MatSelectModule, MatSliderModule, MatCardModule, MatToolbarModule, MatInputModule],
})
export class MaterialModule { }
