import { Component } from '@angular/core';
import {TokenService} from '../../core/services/auth-service/token.service';
import {CommonModule} from '@angular/common';
import {AuthenticationService} from '../../core/services/auth-service/authentication.service';
import { filter, Observable } from 'rxjs';
import { User } from '../../core/models/auth.model';

@Component({
  selector: 'app-home-component',
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  roles: string[] = [];
  isAdmin = false;
  userData$!: Observable<User | null>;

  constructor(private tokenService: TokenService,
              private auth: AuthenticationService) {}

  ngOnInit() {
    this.isAdmin = this.roles.includes('ADMIN');
    this.roles = this.tokenService.getRoles();
    this.userData$ = this.auth.user$

  }

  doAdminTask() {
    // this.auth.postMe().subscribe();
    this.auth.refreshToken().subscribe();

  }

  close(){
    this.auth.logOut().subscribe();
  }
}
