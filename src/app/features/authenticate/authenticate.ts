import {ChangeDetectorRef, Component} from '@angular/core';
import {Button} from 'primeng/button';
import {ReactiveFormsModule, Validators, FormBuilder, FormGroup, AbstractControl} from '@angular/forms';
import {AuthenticationService} from '../../core/services/auth-service/authentication.service';
import {ReqStatus} from '../../core/models/genearl.models';
import {NgClass, NgIf, NgStyle} from '@angular/common';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-authenticate',
  imports: [
    Button,
    ReactiveFormsModule,
    NgIf,
    NgClass,

  ],
  templateUrl: './authenticate.html',
  styleUrl: './authenticate.scss',
})
export class Authenticate {
  form!: FormGroup;
  status: ReqStatus = 'init';

  constructor(private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private  authService: AuthenticationService) {
    this.form = this.fb.group({
      identifier: ['', [Validators.required, this.emailOrUsernameValidator]],
      password: ['', Validators.required],
    });
  }



  emailOrUsernameValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/;

    if (emailRegex.test(value) || usernameRegex.test(value)) {
      return null;
    }

    return { invalidIdentifier: true };
  }

  MSG = ''
  showMSG = false;
  isLoading = false;
  submited() {
    this.MSG = '';

    if (!this.form.valid) return;

    this.isLoading = true;
    this.status = 'loading';

    const payload = {
      username: this.form.value.identifier,
      password: this.form.value.password
    };

 setTimeout(() => {
   this.authService.autheticate(payload)
     .pipe(
       finalize(() => {
         this.isLoading = false;
       })
     )
     .subscribe({
       next: () => {
         this.status = 'success';
         this.isLoading = false;
         this.MSG = 'Authentication successful';
         this.cd.markForCheck();

       },
       error: (err: Error) => {
         this.status = 'error';
         this.isLoading = false;
         this.MSG = err.message;
         this.cd.markForCheck();
       }
     });

   }, 2000
 )
}

}
