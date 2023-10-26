import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { FormsModule } from '@angular/forms';
import { HangmanComponent } from '../games/hangman/hangman.component';
import { HigherorlowerComponent } from '../games/higherorlower/higherorlower.component';
import { AskedComponent } from './asked/asked.component';
import { LogleComponent } from './logle/logle.component';

@NgModule({
  declarations: [GamesComponent, HangmanComponent, HigherorlowerComponent, AskedComponent, LogleComponent],
  imports: [CommonModule, GamesRoutingModule, FormsModule],
})
export class GamesModule {}
