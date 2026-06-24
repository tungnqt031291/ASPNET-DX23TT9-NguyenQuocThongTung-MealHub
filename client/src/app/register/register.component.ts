import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NgForm,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  maxDate = new Date();
  minDate = new Date(1899, 12, 31);

  constructor(private router: Router, private accountService: AccountService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [
        Validators.minLength(3),
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.required,
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        this.matchValues('password'),
      ]),
      gender: new FormControl('Male'),
      alias: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => {
        this.registerForm.controls['confirmPassword'].updateValueAndValidity();
      },
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true };
    };
  }

  register() {
    this.registerForm.value.dateOfBirth = new Date(
      this.registerForm.value.dateOfBirth
    )
      .toISOString()
      .split('T')[0];
    // console.log(this.registerForm.value);

    this.accountService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.cancel();
        this.registerForm.reset();
      },
      error: (error) => {
        if (error.status === 400) {
          const errorResponse = error.error; // Check the response body for details
          console.log(errorResponse);

          if (errorResponse && errorResponse === 'Username is taken') {
            // The error is due to a username conflict
            this.registerForm
              .get('username')
              ?.setErrors({ usernameTaken: true });
          }
        }
      },
    });
    // registerForm.resetForm();
  }

  cancel() {
    // console.log(this.registerForm.get('dateOfBirth'));
    this.router.navigateByUrl('/');
  }
}
