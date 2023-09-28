import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

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
  constructor(private authService: AuthService) {}

  onLogin() {
    const { email, password } = this.usuario;

    this.authService.register(email, password).then((res) => {
      console.log(res);
    });
  }

  onLoginGoogle() {
    const { email, password } = this.usuario;

    this.authService.loginWithGoogle(email, password).then((res) => {
      console.log(res);
    });
  }
}
