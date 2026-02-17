import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { ReqStatus } from '../../core/models/genearl.models';
import { MessageNotify } from '../../shared/message-notify/message-notify';
import { RegisterService } from '../../core/services/auth-service/register.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-account-component',
  imports: [Button, ReactiveFormsModule, MessageNotify, CommonModule],
  templateUrl: './register-account-component.html',
  styleUrl: './register-account-component.scss',
})
export class RegisterAccountComponent {
  status: ReqStatus = 'init';
  MSG = '';
  showMSG = false;
  isLoading: boolean = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  registerAccount() {
    this.isLoading = true;

    if (this.form.invalid) true;

    const payload = {
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password,
    };
    // Simulate an account registration process
    this.registerService.postAccountRegistration(payload).subscribe({
      next: (res) => {
        console.log('Account registered successfully:', res);
        this.status = 'success';
        this.MSG = 'Account registered successfully!';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Error registering account:', err);
        this.status = 'error';
        this.MSG = 'Failed to register account. Please try again.';
        this.isLoading = false;
        this.cd.markForCheck();
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
