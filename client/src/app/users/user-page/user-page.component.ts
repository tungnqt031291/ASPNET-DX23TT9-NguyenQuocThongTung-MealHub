import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Recipe } from 'src/app/_models/recipe';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit, OnDestroy {
  member$: Observable<Member> | undefined;
  recipes$: Observable<Recipe[]> | undefined;
  username = '';
  routeParamsSub!: Subscription;

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute,
    public accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.routeParamsSub = this.route.params.subscribe({
      next: (params) => {
        this.username = params['username'];
        this.member$ = this.memberService.getMemberUsername(this.username);

        this.recipes$ = this.memberService.getMemberRecipes(this.username);
      },
    });
  }


  ngOnDestroy(): void {
    this.routeParamsSub.unsubscribe();
  }
}
