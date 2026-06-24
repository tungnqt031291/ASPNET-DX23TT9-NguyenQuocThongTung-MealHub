import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faBars, faInbox } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from '../_services/account.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CachedStateService } from '../_services/cached-state.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  faBars = faBars;
  currentUser = '';

  constructor(
    public accountService: AccountService,
    private router: Router,
    private cachedStateService: CachedStateService
  ) {}

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user?.userName || '';
      },
    });
  }

  model: any = {};

  login(loginForm: NgForm) {
    // console.log(this.model);
    this.accountService.login(this.model).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/recipes');
      },
    });
  }

  logout() {
    this.accountService.logout();
    this.cachedStateService.clearCachedDataOnLogout();
  }
}
