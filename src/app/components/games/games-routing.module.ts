import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'higherorlower',
        loadChildren: () =>
          import(`./higherorlower/higherorlower.module`).then(
            (m) => m.HigherorlowerModule
          ),
      },
      {
        path: 'hangman',
        loadChildren: () =>
          import(`./hangman/hangman.module`).then((m) => m.HangmanModule),
      },
      {
        path: 'asked',
        loadChildren: () =>
          import(`./asked/asked.module`).then((m) => m.AskedModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamesRoutingModule {}
