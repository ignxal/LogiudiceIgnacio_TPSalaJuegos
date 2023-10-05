import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-higherorlower',
  templateUrl: './higherorlower.component.html',
  styleUrls: ['./higherorlower.component.scss'],
})
export class HigherorlowerComponent implements OnInit {
  cards: Array<string> = [
    'gold-1.png',
    'gold-2.png',
    'gold-3.png',
    'gold-4.png',
    'gold-5.png',
    'gold-6.png',
    'gold-7.png',
    'gold-8.png',
    'gold-9.png',
    'gold-10.png',
    'gold-11.png',
    'gold-12.png',
    'club-1.png',
    'club-2.png',
    'club-3.png',
    'club-4.png',
    'club-5.png',
    'club-6.png',
    'club-7.png',
    'club-8.png',
    'club-9.png',
    'club-10.png',
    'club-11.png',
    'club-12.png',
    'sword-1.png',
    'sword-2.png',
    'sword-3.png',
    'sword-4.png',
    'sword-5.png',
    'sword-6.png',
    'sword-7.png',
    'sword-8.png',
    'sword-9.png',
    'sword-10.png',
    'sword-11.png',
    'sword-12.png',
    'cup-1.png',
    'cup-2.png',
    'cup-3.png',
    'cup-4.png',
    'cup-5.png',
    'cup-6.png',
    'cup-7.png',
    'cup-8.png',
    'cup-9.png',
    'cup-10.png',
    'cup-11.png',
    'cup-12.png',
  ];

  reveal: boolean = false;
  randomCard: string = '';
  previousCard: string = '';
  score: number = 0;
  currentCardValue: number = 0;
  previousCardValue: number = 0;
  user: any;
  userLogged: any;
  highestHigherOrLowerScore: number = 0;
  isHigher: boolean = false;

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
              this.highestHigherOrLowerScore = 0;
              return;
            }

            const docRef = querySnapshot.docs[0];
            const user: any = docRef.data();

            this.highestHigherOrLowerScore =
              user?.highestHigherOrLowerScore || 0;
          });
        })
        .catch((err) => {
          console.log(err);
          this.highestHigherOrLowerScore = 0;
        });

      this.startGame();
    });
  }

  startGame() {
    this.score = 0;
    this.randomCard = this.cards[Math.floor(Math.random() * (47 - 0 + 1)) + 0];
    this.previousCardValue = this.transformValue(this.randomCard);
    this.previousCard = this.randomCard;
    this.randomCard = this.cards[Math.floor(Math.random() * (47 - 0 + 1)) + 0];
    this.currentCardValue = this.transformValue(this.randomCard);
  }

  drawCard() {
    document.getElementById('score')?.classList.add('pulsate-fwd');

    setTimeout(() => {
      document.getElementById('score')?.classList.remove('pulsate-fwd');
    }, 1000);

    this.previousCard = this.randomCard;
    this.randomCard = this.cards[Math.floor(Math.random() * (47 - 0 + 1)) + 0];
    this.previousCardValue = this.currentCardValue;
    this.currentCardValue = this.transformValue(this.randomCard);
  }

  transformValue(card: string): number {
    let split1 = card.split('-');
    let split2 = split1[1].split('.');
    return Number(split2[0]);
  }

  revealCard() {
    this.reveal = true;
    setTimeout(() => {
      this.reveal = false;
      this.checkGuess();
    }, 1000);
  }

  checkGuess() {
    if (
      (this.isHigher && this.previousCardValue <= this.currentCardValue) ||
      (!this.isHigher && this.previousCardValue >= this.currentCardValue)
    ) {
      this.score++;
      this.drawCard();
    } else {
      this.loseGame();
    }
  }

  higher() {
    this.isHigher = true;
    this.revealCard();
  }

  lower() {
    this.isHigher = false;
    this.revealCard();
  }

  loseGame() {
    if (this.score > this.highestHigherOrLowerScore) {
      this.highestHigherOrLowerScore = this.score;
      this.databaseService.updateByFieldValue(
        'records',
        'user_id',
        this.userLogged.uid,
        {
          highest_higherorlower_score: this.highestHigherOrLowerScore,
        }
      );
    }

    Swal.fire({
      title: 'Perdiste!',
      html:
        'El valor de la carta era ' +
        this.currentCardValue +
        '.<br>Puntaje: ' +
        this.score +
        '<br>Record: ' +
        this.highestHigherOrLowerScore,
      icon: 'error',
      position: 'center',
      confirmButtonColor: '#4add87',
      confirmButtonText: 'Reintentar',
      showCancelButton: true,
      cancelButtonColor: '#ca4949',
      cancelButtonText: 'Volver al menu',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.startGame();
      } else {
        this.router.navigateByUrl('home');
      }
    });
  }
}
