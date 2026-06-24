import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { User } from '../_models/user';
import { BehaviorSubject, map } from 'rxjs';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  apiUrl = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<User | null>(null);

  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private presenceService: PresenceService
  ) {}

  register(model: any) {
    return this.http.post<User>(this.apiUrl + 'account/register', model).pipe(
      map((response) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  login(model: any) {
    return this.http.post<User>(this.apiUrl + 'account/login', model).pipe(
      map((res) => {
        const user = res;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));

    this.currentUserSource.next(user);
    this.presenceService.createHubConnection(user);
  }

  getCurrentUser(): User | null {
    let user: User;
    var userString = localStorage.getItem('user');
    if (userString) {
      user = JSON.parse(userString);
      return user;
    }
    return null;
  }
}
