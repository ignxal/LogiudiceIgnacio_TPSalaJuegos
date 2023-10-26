import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AskedComponent } from '../asked/asked.component';

const routes: Routes = [
  {
    path: '',
    component: AskedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AskedRoutingModule {}
