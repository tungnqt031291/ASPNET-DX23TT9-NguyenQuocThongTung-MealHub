import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bad-request',
  templateUrl: './bad-request.component.html',
  styleUrls: ['./bad-request.component.css'],
})
export class BadRequestComponent {
  error: any;
  errorArr: any[] = [];
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (this.getTypeOfError(navigation?.extras?.state?.['error'])) {
      this.errorArr = navigation?.extras?.state?.['error'];
    } else {
      this.error = navigation?.extras?.state?.['error'];
    }
    console.log(this.error);
    console.log(this.errorArr);
  }

  getTypeOfError(value: any | any[]) {
    if (Array.isArray(value)) {
      return true;
    }
    return false;
  }
}
