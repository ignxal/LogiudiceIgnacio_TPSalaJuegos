import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatabaseService } from '../../../services/database.service';
import { AuthService } from '../../../services/auth.service';
import { ApiMoviesService } from '../../../services/api-movies.service';
import { Questions } from 'src/app/models/questions';

@Component({
  selector: 'app-asked',
  templateUrl: './asked.component.html',
  styleUrls: ['./asked.component.scss'],
})
export class AskedComponent implements OnInit {
  questions: Questions[] = [];
  randomQuestion: any = '';
  attempts: number = 3;
  category: string = '';
  score: number = 0;
  displayeds: number = 0;
  interval: any;
  time: number = 20;
  image: string = '';
  user: any;
  userLogged: any;
  highestAskedScore: number = 0;
  dbSub: any;
  questionSub: any;
  historyQuestions: Questions[] = [];
  geographyQuestions: Questions[] = [];
  moviesQuestions: Questions[] = [];
  scienceQuestions: Questions[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private apiMoviesService: ApiMoviesService
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
              this.highestAskedScore = 0;
              return;
            }

            const docRef = querySnapshot.docs[0];
            const user: any = docRef.data();

            this.highestAskedScore = user?.highest_asked_score || 0;
          });
        })
        .catch((err) => {
          console.log(err);
          this.highestAskedScore = 0;
        });
    });

    this.dbSub = this.databaseService.getQuestions().subscribe({
      next: (questions) => {
        questions.forEach((question) => {
          this.categorizeQuestion(question);
        });
      },
      error: (error) => {
        console.error('Error al obtener la lista de preguntas', error);
      },
    });
  }

  ngOnDestroy(): void {
    this.dbSub.unsubscribe();
    this.stopTimer();
  }

  categorizeQuestion(question: Questions): void {
    if (question.category === 'history') {
      this.historyQuestions.push(question);
    } else if (question.category === 'geography') {
      this.geographyQuestions.push(question);
    } else if (question.category === 'movies') {
      this.moviesQuestions.push(question);
    } else if (question.category === 'science') {
      this.scienceQuestions.push(question);
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.time > 0) {
        this.time--;
      } else {
        this.answer('');
        this.time = 20;
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.interval);
  }

  getImage(pelicula: string) {
    this.apiMoviesService.GetMovie(pelicula).subscribe({
      next: (data: any) => {
        this.randomQuestion.poster = data.Poster;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  chooseCategory(category: string) {
    this.category = category;

    switch (category) {
      case 'history':
        this.questions = this.historyQuestions;
        break;
      case 'geography':
        this.questions = this.geographyQuestions;
        break;
      case 'science':
        this.questions = this.scienceQuestions;
        break;
      case 'movies':
        this.questions = this.moviesQuestions;
        break;
      default:
        this.questions = [
          ...this.historyQuestions,
          ...this.geographyQuestions,
          ...this.scienceQuestions,
          ...this.moviesQuestions,
        ];
        break;
    }

    this.chooseQuestion();
  }

  chooseQuestion() {
    let index =
      Math.floor(Math.random() * (this.questions.length - 1 - 0 + 1)) + 0;
    this.randomQuestion = this.questions[index];
    console.log(this.randomQuestion);

    if (!this.randomQuestion?.displayed) {
      this.displayeds++;
      this.questions[index].displayed = true;

      if (this.randomQuestion.img) {
        this.getImage(this.randomQuestion.img);
      }

      this.startTimer();
    } else {
      this.chooseQuestion();
    }
  }

  answer(respuesta: string) {
    for (let resp of this.randomQuestion.answers) {
      document.getElementById(resp)?.setAttribute('disabled', '');

      if (resp == this.randomQuestion.right) {
        document
          .getElementById(resp)
          ?.style.setProperty('background-color', '#54cd5d');
        document
          .getElementById(resp)
          ?.style.setProperty('border-color', '#498f4e');
      }
    }

    this.stopTimer();

    if (respuesta == this.randomQuestion.right) {
      this.score++;
      this.image = 'right';

      document.getElementById('puntos')?.classList.add('pulsate-fwd');

      setTimeout(() => {
        document.getElementById('puntos')?.classList.remove('pulsate-fwd');
      }, 1000);
    } else {
      document
        .getElementById(this.attempts.toString())
        ?.classList.add('flicker-out-1');

      document
        .getElementById(respuesta)
        ?.style.setProperty('background-color', '#f14d4d');
      document
        .getElementById(respuesta)
        ?.style.setProperty('border-color', '#a73434');

      setTimeout(() => {
        this.attempts--;
      }, 1200);

      this.image = 'wrong';
    }

    setTimeout(() => {
      this.image = '';

      if (this.attempts > 0) {
        for (let resp of this.randomQuestion.answers) {
          document
            .getElementById(resp)
            ?.style.setProperty('background-color', '#F8F9FA');
          document
            .getElementById(resp)
            ?.style.setProperty('border-color', '#F8F9FA');

          document.getElementById(resp)?.removeAttribute('disabled');
        }

        if (this.displayeds < this.questions.length) {
          this.time = 20;
          this.chooseQuestion();
        } else {
          Swal.fire({
            title: '¡Completaste la categoría!',
            html:
              'Puntuación: ' +
              this.score +
              '<br>Mayor puntuación: ' +
              this.highestAskedScore,
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
              this.restartGame();
            } else {
              this.router.navigateByUrl('home');
            }
          });
        }
      } else {
        if (this.score > this.highestAskedScore) {
          this.highestAskedScore = this.score;
          this.databaseService.updateByFieldValue(
            'records',
            'user_id',
            this.userLogged.uid,
            {
              highest_asked_score: this.highestAskedScore,
            }
          );
        }

        Swal.fire({
          title: '¡Te quedaste sin vidas!',
          html:
            'Puntuación: ' +
            this.score +
            '<br>Mayor puntuación: ' +
            this.highestAskedScore,
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
            this.restartGame();
          } else {
            this.router.navigateByUrl('home');
          }
        });
      }
    }, 3000);
  }

  restartGame() {
    for (let resp of this.randomQuestion.answers) {
      document
        .getElementById(resp)
        ?.style.setProperty('background-color', '#F8F9FA');
      document
        .getElementById(resp)
        ?.style.setProperty('border-color', '#F8F9FA');

      document.getElementById(resp)?.removeAttribute('disabled');
    }

    this.randomQuestion = '';
    this.attempts = 3;
    this.score = 0;
    this.category = '';
    this.displayeds = 0;
    this.time = 20;

    for (let x of this.questions) {
      x.displayed = false;
    }
  }
}
