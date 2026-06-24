import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  exampleCards = [
    {
      username: 'George',
      title: 'Best recipe app out there!',
      body: 'I love sharing recipes with friends and having contests',
      rating: 4,
    },
    {
      username: 'Makhs',
      title: 'Facebook meets recipe app',
      body: 'I love the fact you can message other people',
      rating: 4.5,
    },

    {
      username: 'John Doe',
      title: 'How should i say this? ...',
      body: '5/5 I met my wife here Jane!, she got alot of stars',
      rating: 5,
    },
  ];

  max = 5;
  rate = 4;
  isReadonly = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    public accountService: AccountService
  ) {}

  navigateToRegister() {
    this.router.navigate(['register']);
  }

  get500Error() {
    this.http.get('https://localhost:5001/api/error/server-error').subscribe({
      next: (response) => {},
    });
  }

  get400Error() {
    this.http.get('https://localhost:5001/api/error/bad-request/validation').subscribe({
      next: (response) => {},
    });
  }
}
