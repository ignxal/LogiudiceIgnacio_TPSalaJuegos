import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hangman',
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.scss'],
})
export class HangmanComponent implements OnInit {
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
  keyboardThirdRow: Array<string> = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Send'];

  words: Array<string> = [
    'EDIFICIO',
    'MARIPOSA',
    'PAJARO',
    'ZORRO',
    'PANDA',
    'JIRAFA',
    'ELEFANTE',
    'TIGRE',
    'LAGARTO',
    'VENTILADOR',
    'MANZANA',
    'ZAPATO',
    'ARBOL',
    'TECLADO',
    'MONITOR',
    'AERONAVE',
    'SUBMARINO',
    'PILETA',
    'MANDARINA',
    'MELON',
    'LECHUGA',
    'GASEOSA',
    'BICICLETA',
    'TELEVISOR',
    'CELULAR',
    'MICROFONO',
    'MUEBLE',
    'SILLA',
    'LAMPARA',
    'CORTINA',
    'VENTANA',
    'TERMO',
    'PELUCHE',
    'TRACTOR',
    'TELEFONO',
  ];

  randomWord: string = '';
  chosenLetter: string = 'Q';
  formedWord: Array<string> = [];
  mistakes: number = 0;
  score: number = 0;
  usedWords: Array<string> = [];
  userLogged: any = '';
  highestHangmanScore: number = 0;

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
          res?.subscribe((querySnapshot) => {
            if (!querySnapshot || querySnapshot.empty) {
              console.log('Document not found');
              this.highestHangmanScore = 0;
              return;
            }

            const docRef = querySnapshot.docs[0];
            const user: any = docRef.data();
            console.log(user);
            this.highestHangmanScore = user?.highestHangmanScore || 0;
          });
        })
        .catch((err) => {
          console.log(err);
          this.highestHangmanScore = 0;
        });

      this.createWord();
    });
  }

  createWord() {
    this.formedWord = [];
    this.randomWord = this.getRandomWord();

    let letters = this.getAllLetters();

    if (!this.usedWords.includes(this.randomWord)) {
      this.usedWords.push(this.randomWord);

      this.resetLetterStyles(letters);
      this.initializeFormedWord();

      this.mistakes = 0;
    } else {
      if (this.usedWords.length === this.words.length) {
        this.handleGameCompletion();
      } else {
        this.createWord();
      }
    }
  }

  getRandomWord(): string {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }

  getAllLetters(): Array<string> {
    return this.keyboardFirstRow.concat(
      this.keyboardSecondRow,
      this.keyboardThirdRow
    );
  }

  resetLetterStyles(letters: Array<string>): void {
    letters.forEach((letter) => {
      const element = document.getElementById(letter);
      if (element) {
        element.style.setProperty('background-color', '#f8f9fa');
        element.style.setProperty('border-color', '#f8f9fa');
      }
    });
  }

  initializeFormedWord(): void {
    for (let i = 0; i < this.randomWord.length; i++) {
      this.formedWord[i] = '_ ';
    }
  }

  handleGameCompletion(): void {
    this.updateScore();

    Swal.fire({
      title: 'You completed the game!',
      html:
        'Score: ' +
        this.score +
        '<br>Highest score: ' +
        this.highestHangmanScore,
      icon: 'success',
      position: 'center',
      confirmButtonColor: '#4add87',
      confirmButtonText: 'Play again',
      showCancelButton: true,
      cancelButtonColor: '#ca4949',
      cancelButtonText: 'Back to menu',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        this.score = 0;
        this.usedWords = [];
        this.createWord();
      } else {
        this.router.navigateByUrl('home');
      }
    });
  }

  send() {
    let found = false;
    let won = true;

    for (let i = 0; i < this.randomWord.length; i++) {
      if (this.randomWord[i] == this.chosenLetter) {
        this.formedWord[i] = this.chosenLetter;
        document
          .getElementById(this.chosenLetter)
          ?.style.setProperty('background-color', '#69d57b');
        document
          .getElementById(this.chosenLetter)
          ?.style.setProperty('border-color', '#69d57b');
        found = true;
      }
    }

    if (!found) {
      this.mistakes++;

      document
        .getElementById(this.chosenLetter)
        ?.style.setProperty('background-color', '#a1a1a1');
      document
        .getElementById(this.chosenLetter)
        ?.style.setProperty('border-color', '#6a6a6a');

      if (this.mistakes == 6) {
        this.updateScore();

        Swal.fire({
          title: 'Te quedaste sin vidas!',
          html:
            "La palabra era '" +
            this.randomWord +
            "'." +
            '<br>Puntaje: ' +
            this.score +
            '<br>Record: ' +
            this.highestHangmanScore,
          icon: 'error',
          position: 'center',
          confirmButtonColor: '#4add87',
          confirmButtonText: 'Reintentar',
          showCancelButton: true,
          cancelButtonColor: '#ca4949',
          cancelButtonText: 'Volver al menú',
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result: { isConfirmed: any }) => {
          if (result.isConfirmed) {
            this.score = 0;
            this.createWord();
          } else {
            this.router.navigateByUrl('home');
          }
        });
      }
    }

    for (let i = 0; i < this.randomWord.length; i++) {
      if (this.formedWord[i] == '_ ') {
        won = false;
        break;
      }
    }

    if (won) {
      this.score++;

      document.getElementById('points')?.classList.add('pulsate-fwd');

      setTimeout(() => {
        document.getElementById('points')?.classList.remove('pulsate-fwd');
      }, 1000);

      Swal.fire({
        title: 'Ganaste!',
        text: "La palabra es '" + this.randomWord + "'.",
        icon: 'success',
        position: 'center',
        confirmButtonColor: '#4add87',
        confirmButtonText: 'Jugar de vuelta',
        showCancelButton: true,
        cancelButtonColor: '#ca4949',
        cancelButtonText: 'Volver al menú',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result: { isConfirmed: any }) => {
        if (result.isConfirmed) {
          this.createWord();
        } else {
          this.updateScore();

          Swal.fire({
            title:
              'Puntaje: ' +
              this.score +
              '<br>Record: ' +
              this.highestHangmanScore,
          });

          this.router.navigateByUrl('home');
        }
      });
    }
  }

  changeLetter(letter: string) {
    if (letter == 'Send') {
      this.send();
    } else {
      this.chosenLetter = letter;
    }
  }

  restart() {
    this.mistakes = 0;
    this.usedWords = [];
    this.chosenLetter = '';
    this.createWord();
  }

  updateScore() {
    if (this.score > this.highestHangmanScore) {
      this.highestHangmanScore = this.score;
      this.databaseService.updateByFieldValue(
        'records',
        'user_id',
        this.userLogged.uid,
        {
          highest_hangman_score: this.highestHangmanScore,
        }
      );
    }
  }
}
