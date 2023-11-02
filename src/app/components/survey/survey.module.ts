import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyComponent } from './survey.component';
import { SurveyRoutingModule } from './survey-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SurveyComponent],
  imports: [CommonModule, SurveyRoutingModule, FormsModule],
})
export class SurveyModule {}
