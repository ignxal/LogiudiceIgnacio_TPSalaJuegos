import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogleComponent } from '../logle/logle.component';

const routes: Routes = [
  {
    path: '',
    component: LogleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogleRoutingModule {}
