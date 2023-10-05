import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HigherorlowerComponent } from '../higherorlower/higherorlower.component';

const routes: Routes = [
  {
    path: '',
    component: HigherorlowerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HigherorlowerRoutingModule {}
