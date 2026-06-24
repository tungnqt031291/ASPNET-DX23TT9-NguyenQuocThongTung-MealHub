import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnDestroy, OnInit {
  userEditForm: FormGroup = new FormGroup({});
  user!: Member;
  routeSub!: Subscription;

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.routeSub = this.route.params.subscribe({
      next: (params) => {
        var username = params['username'];
        this.memberService.getMemberUsernameToEdit(username).subscribe({
          next: (member) => {
            this.user = member;
            this.initializeForm();
          },
        });
      },
    });
  }
  ngOnInit(): void {}

  private initializeForm() {
    this.userEditForm = new FormGroup({
      alias: new FormControl(this.user.alias, Validators.required),
      description: new FormControl(this.user.description, Validators.required),
      gender: new FormControl(this.user.gender),
    });
  }

  updateUserInfo() {
    var payload = this.userEditForm.value;

    this.memberService.updateMember(payload, this.user.userName).subscribe({
      next: (response) => {
        this.cancel();
      },
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  cancel() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
