import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../../services/database.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { Logos } from 'src/app/models/logos';

@Component({
  selector: 'app-logle',
  templateUrl: './logle.component.html',
  styleUrls: ['./logle.component.scss'],
})
export class LogleComponent implements OnInit, OnDestroy {
  keyboardFirstRow: Array<string> = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
  ];

  keyboardSecondRow: Array<string> = [
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'Ñ',
  ];

  keyboardThirdRow: Array<string> = [
    'Borrar',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    'Enviar',
  ];

  currentWord: string = '';
  logos: Logos[] = [];
  words: Array<string> = [];
  logoRandom: any;
  imageFragment: Array<string> = [];
  showFragments: Array<string> = [];
  attempts: number = 0;
  score: number = 0;
  userLogged: any;
  dbSub: any;
  highestLogleScore: any = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    this.authService.getUserLogged().subscribe((u) => {
      if (!u) return;
      this.userLogged = u;

      this.databaseService
        .getByFieldValue('records', 'user_id', this.userLogged.uid)
        .then((res) => {
          this.dbSub = res?.subscribe((querySnapshot) => {
            if (!querySnapshot || querySnapshot.empty) {
              console.log('Document not found');
              this.highestLogleScore = 0;
              return;
            }

            const docRef = querySnapshot.docs[0];
            const user: any = docRef.data();

            this.highestLogleScore = user?.highest_logle_score || 0;
          });
        })
        .catch((err) => {
          console.log(err);
          this.highestLogleScore = 0;
        });
    });

    this.dbSub = this.databaseService.getLogos().subscribe({
      next: (logos) => {
        this.logos = logos;
        this.chooseImage();
      },
      error: (error) => {
        console.error('Error al obtener la lista de logos', error);
      },
    });
  }

  ngOnDestroy(): void {
    this.dbSub.unsubscribe();
  }

  chooseImage() {
    let index = Math.floor(Math.random() * (8 - 0 + 1)) + 0;

    this.logoRandom = this.logos[index];

    if (!this.logoRandom?.displayed) {
      this.logoRandom.displayed = true;
      this.logos[index] = this.logoRandom;

      for (let i = 1; i < 5; i++) {
        this.imageFragment.push(
          `${this.logoRandom.name.toLowerCase()}.${i}.png`
        );
        this.showFragments.push('background.png');
      }

      this.showFragments[0] = this.imageFragment[0];
    } else {
      this.chooseImage();
    }
  }

  updateLetter(letra: string) {
    if (letra == 'Enviar' && this.words.length != 3) {
      this.send();
    } else {
      if (letra == 'Borrar') {
        this.currentWord = this.currentWord.slice(0, -1);
      } else {
        if (
          this.logoRandom.name.length > this.currentWord.length &&
          this.words.length != 3
        ) {
          this.currentWord += letra;
        }
      }
    }
  }

  send() {
    this.words.push(this.currentWord);

    document.getElementById('Enviar')?.setAttribute('disabled', '');

    for (let i = 0; i < this.currentWord.length; i++) {
      for (let j = 0; j < this.logoRandom.name.length; j++) {
        if (this.currentWord[i] == this.logoRandom.name[j]) {
          document
            .getElementById(this.currentWord[i])
            ?.style.setProperty('background-color', '#69d57b');
          document
            .getElementById(this.currentWord[i])
            ?.style.setProperty('border-color', '#69d57b');
          break;
        } else {
          document
            .getElementById(this.currentWord[i])
            ?.style.setProperty('background-color', '#a1a1a1');
          document
            .getElementById(this.currentWord[i])
            ?.style.setProperty('border-color', '#6a6a6a');
        }
      }
    }

    if (this.currentWord == this.logoRandom.name) {
      this.showFragments = this.imageFragment;
      document.getElementById('3')?.classList.add('flip-in-ver-left');
      document.getElementById('2')?.classList.add('flip-in-ver-left');
      document.getElementById('1')?.classList.add('flip-in-ver-left');

      this.score++;

      document.getElementById('score')?.classList.add('pulsate-fwd');

      setTimeout(() => {
        document.getElementById('score')?.classList.remove('pulsate-fwd');
      }, 1000);

      if (this.score != 9) {
        setTimeout(() => {
          Swal.fire({
            title: '¡Ganaste!',
            text: "El logo es de '" + this.logoRandom.name + "'.",
            icon: 'success',
            position: 'center',
            confirmButtonColor: '#4add87',
            confirmButtonText: 'Otro logo',
            showCancelButton: true,
            cancelButtonColor: '#ca4949',
            cancelButtonText: 'Volver al menú',
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.restartGame();
            } else {
              this.updateScore();

              Swal.fire({
                title:
                  'Puntuación: ' +
                  this.score +
                  '<br>Mayor puntuación: ' +
                  this.highestLogleScore,
              });

              this.router.navigateByUrl('home');
            }
          });
        }, 1500);
      } else {
        setTimeout(() => {
          Swal.fire({
            title: '¡Felicitaciones!',
            text: 'Completaste el juego.',
            icon: 'success',
            position: 'center',
            confirmButtonColor: '#4add87',
            confirmButtonText: 'Jugar otra vez',
            showCancelButton: true,
            cancelButtonColor: '#ca4949',
            cancelButtonText: 'Volver al menú',
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.score = 0;
              this.restartWords();
              this.restartGame();
            } else {
              this.updateScore();

              Swal.fire({
                title:
                  'Puntuación: ' +
                  this.score +
                  '<br>Mayor puntuación: ' +
                  this.highestLogleScore,
              });

              this.router.navigateByUrl('home');
            }
          });
        }, 500);
      }
    } else {
      this.attempts++;

      this.showFragments[this.attempts] = this.imageFragment[this.attempts];
      document
        .getElementById(this.attempts.toString())
        ?.classList.add('flip-in-ver-left');
      this.currentWord = '';

      if (this.attempts > 2) {
        this.updateScore();

        setTimeout(() => {
          Swal.fire({
            title: '¡Te quedaste sin intentos!',
            html:
              "El logo era de '" +
              this.logoRandom.name +
              "'<br>Puntuación: " +
              this.score +
              '<br>Mayor puntuación: ' +
              this.highestLogleScore,
            icon: 'error',
            position: 'center',
            confirmButtonColor: '#4add87',
            confirmButtonText: 'Jugar otra vez',
            showCancelButton: true,
            cancelButtonColor: '#ca4949',
            cancelButtonText: 'Volver al menú',
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.score = 0;
              this.restartWords();
              this.restartGame();
            } else {
              this.router.navigateByUrl('home');
            }
          });
        }, 1500);
      } else {
        document.getElementById('Enviar')?.removeAttribute('disabled');
      }
    }
  }

  restartGame() {
    let letras = this.keyboardFirstRow.concat(
      this.keyboardSecondRow,
      this.keyboardThirdRow
    );

    for (let letra of letras) {
      document
        .getElementById(letra)
        ?.style.setProperty('background-color', '#f8f9fa');
      document
        .getElementById(letra)
        ?.style.setProperty('border-color', '#f8f9fa');
    }

    for (let i = 0; i < 4; i++) {
      document
        .getElementById(i.toString())
        ?.classList.remove('flip-in-ver-left');
    }

    document.getElementById('Enviar')?.removeAttribute('disabled');

    this.currentWord = '';
    this.attempts = 0;
    this.words = [];
    this.imageFragment = [];
    this.showFragments = [];

    this.chooseImage();
  }

  updateScore() {
    if (this.score > this.highestLogleScore) {
      this.highestLogleScore = this.score;
      this.databaseService.updateByFieldValue(
        'records',
        'user_id',
        this.userLogged.uid,
        {
          highest_logle_score: this.highestLogleScore,
        }
      );
    }
  }

  restartWords() {
    for (let i = 0; i < 9; i++) {
      this.logos[i].displayed = false;
    }
  }
}
