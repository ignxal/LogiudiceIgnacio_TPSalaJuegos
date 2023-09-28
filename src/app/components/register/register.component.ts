import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  usuario = {
    email: '',
    password: '',
    passwordConfirmation: '',
  };
  constructor(
    private authService: AuthService,
    private router: Router,
    private database: DatabaseService
  ) {}

  onRegister() {
    const { email, password, passwordConfirmation } = this.usuario;
    const userObj = {
      email: email,
      login_date: Date.now(),
    };

    if (password !== passwordConfirmation) {
      return;
    }

    this.authService
      .register(email, password)
      .then(() => {
        this.authService
          .login(email, password)
          .then(() => {
            this.database
              .create('users_activity', userObj)
              .then(() => {
                this.router.navigate(['/']);
              })
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
