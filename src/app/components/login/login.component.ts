import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import Swal from 'sweetalert2';

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

  onAutoComplete() {
    this.usuario.email = 'user_test@gmail.com';
    this.usuario.password = 'test123';
  }

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
        Swal.fire({
          title: 'Error de autenticación',
          html: 'Las credenciales no son correctas',
          icon: 'error',
          position: 'center',
          confirmButtonColor: '#ed566f',
          confirmButtonText: 'Ok',
          showCancelButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result: { isConfirmed: any }) => {
          console.log(err);
        });
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
            this.router.navigate(['/home']);
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
