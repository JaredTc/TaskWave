import { Component } from '@angular/core';
import {TokenService} from '../../core/services/auth-service/token.service';
import {CommonModule} from '@angular/common';
import {AuthenticationService} from '../../core/services/auth-service/authentication.service';

@Component({
  selector: 'app-home-component',
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  roles: string[] = [];
  isAdmin = false;

  constructor(private tokenService: TokenService,
              private auth: AuthenticationService) {}

  ngOnInit() {
    this.isAdmin = this.roles.includes('ADMIN');
    this.roles = this.tokenService.getRoles();


  }

  doAdminTask() {
    alert('¡Tarea de admin ejecutada!');
  }

  close(){
    this.auth.logOut().subscribe();
  }
}
