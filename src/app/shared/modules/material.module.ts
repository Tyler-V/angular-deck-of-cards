
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  imports: [FlexLayoutModule, MatButtonModule, MatCheckboxModule,
    MatSelectModule, MatSliderModule, MatCardModule, MatToolbarModule, MatInputModule],
  exports: [FlexLayoutModule, MatButtonModule, MatCheckboxModule,
    MatSelectModule, MatSliderModule, MatCardModule, MatToolbarModule, MatInputModule],
})
export class MaterialModule { }
