import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { faEnvelope, faClose } from '@fortawesome/free-solid-svg-icons';
import { MemberService } from 'src/app/_services/member.service';
import { Member } from 'src/app/_models/member';
import { NgForm } from '@angular/forms';
import { MessageService } from 'src/app/_services/message.service';
import { NavigationExtras, Router } from '@angular/router';
@Component({
  selector: 'app-add-chat',
  templateUrl: './add-chat.component.html',
  styleUrls: ['./add-chat.component.css'],
})
export class AddChatComponent implements OnInit {
  faEnvelope = faEnvelope;
  faClose = faClose;
  modalRef?: BsModalRef;
  searchQuery: string = '';
  members: Member[] | null = null;
  userSelected = false;
  @Input() selectedMember: Member | null = null;

  constructor(
    private modalService: BsModalService,
    private memberService: MemberService,
    private router: Router
  ) {}

  onShowModal(templateRef: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templateRef);
  }

  ngOnInit(): void {
    if (this.selectedMember) this.userSelected = true;
  }
  //TODO: Add paginationFilter on search users
  searchUsers() {
    // Some load balancing with setTimeout
    setTimeout(() => {
      this.memberService.searchMembers(this.searchQuery).subscribe({
        next: (response) => {
          this.members = response;
        },
      });
    }, 300);
  }

  onSendMessage(form: NgForm) {
    if (!this.selectedMember) return;
    const payload = {
      receiverUsername: this.selectedMember?.userName,
      content: form.value.message,
    };
    this.modalRef?.hide();
    const route = ['messages/' + this.selectedMember?.userName];
    this.router.navigate(route);
  }

  selectedUser(user: Member) {
    this.userSelected = true;
    this.selectedMember = user;
  }

  removeSelectedUser() {
    this.userSelected = false;
    this.selectedMember = null;
  }
}
