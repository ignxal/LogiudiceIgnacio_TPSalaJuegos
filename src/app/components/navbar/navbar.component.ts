import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  userLogged = this.authService.getUserLogged();
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}
  onLogin() {
    this.router.navigate(['/login']);
  }
  onLogout() {
    this.authService.logout();
  }
}
