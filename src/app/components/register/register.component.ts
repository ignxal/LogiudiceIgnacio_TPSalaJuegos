import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import Swal from 'sweetalert2';

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

    if (!password || !passwordConfirmation || !email) {
      Swal.fire({
        title: 'Campos incompletos',
        html: 'Por favor complete la totalidad de los campos',
        icon: 'error',
        position: 'center',
        confirmButtonColor: '#ed566f',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return;
    }

    if (password !== passwordConfirmation) {
      Swal.fire({
        title: 'Error de registro',
        html: 'Las contraseñas no coinciden',
        icon: 'error',
        position: 'center',
        confirmButtonColor: '#ed566f',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
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
                this.router.navigate(['/home']);
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
        Swal.fire({
          title: 'Error de registro',
          html: 'Se produjo un error al querer registrar el usuario',
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
}
