import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HangmanComponent } from '../hangman/hangman.component';

const routes: Routes = [
  {
    path: '',
    component: HangmanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HangmanRoutingModule {}
