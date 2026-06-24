import { Injectable } from '@angular/core';
import { Member } from '../_models/member';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Recipe } from '../_models/recipe';
import { AccountService } from './account.service';
import { getHttpOptions } from './http-headers-helper';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  apiUrl = environment.apiUrl;
  private members: Member[] = [];
  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {}

  searchMembers(query: string) {
    return this.http.get<Member[]>(
      this.apiUrl + 'members/search/' + query,
      getHttpOptions()
    );
  }

  getMemberUsername(username: string): Observable<Member> {
    const member = this.members.find((m) => m.userName === username);
    if (member) {
      return of(member);
    }

    return this.http
      .get<Member>(this.apiUrl + 'members/' + username, getHttpOptions())
      .pipe(
        map((fetchedMember) => {
          this.members.push(fetchedMember); // Cache the member data
          return fetchedMember;
        }),
        catchError((error) => {
          // Handle the error appropriately
          console.error('Error fetching member data:', error);
          throw error;
        })
      );
  }

  getMemberUsernameToEdit(username: string): Observable<Member> {
    const member = this.members.find((m) => m.userName === username);
    if (member) {
      return of(member);
    }

    return this.http
      .get<Member>(
        this.apiUrl + 'members/' + username + '/edit',
        getHttpOptions()
      )
      .pipe(
        map((fetchedMember) => {
          this.members.push(fetchedMember); // Cache the member data
          return fetchedMember;
        })
      );
  }

  getMembers(): Observable<Member[]> {
    if (this.members.length > 0) {
      return of(this.members);
    }

    return this.http
      .get<Member[]>(this.apiUrl + 'members/list', getHttpOptions())
      .pipe(
        map((members) => {
          this.members = members;
          return members;
        }),
        catchError((error) => {
          // Handle the error appropriately
          console.error('Error fetching members data:', error);
          return of([]); // You can return a default value or an error indicator here
        })
      );
  }

  getMemberRecipes(username: string) {
    return this.http.get<Recipe[]>(
      this.apiUrl + 'members/' + username + '/recipes',
      getHttpOptions()
    );
  }

  updateMember(
    member: { alias: string; description: string; gender: string },
    username: string
  ) {
    return this.http
      .put(this.apiUrl + 'members/' + username, member, getHttpOptions())
      .pipe(
        tap((res) => {
          const index = this.members.findIndex(
            (mem) => mem.userName === username
          );

          if (index !== -1) {
            this.members[index] = { ...this.members[index], ...member };
          }
        })
      );
  }

  clearCachedMembers() {
    this.members = [];
  }
}
