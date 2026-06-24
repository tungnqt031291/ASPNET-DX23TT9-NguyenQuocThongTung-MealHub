import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
})
export class UnauthorizedComponent {
  faD = faUserSecret;
  error: any;
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.['error'];
    console.log(this.error);
  }
}
