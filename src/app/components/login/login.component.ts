import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  usuario = {
    email: '',
    password: '',
  };
  constructor(
    private authService: AuthService,
    private router: Router,
    private database: DatabaseService
  ) {}

  onLogin() {
    const { email, password } = this.usuario;
    const userObj = {
      email: email,
      login_date: Date.now(),
    };

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
        console.log(err);
      });
  }

  onLoginGoogle() {
    const { email } = this.usuario;
    const userObj = {
      email: email,
      login_date: Date.now(),
    };

    this.authService
      .loginWithGoogle()
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
        console.log(err);
      });
  }
}
