import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccountService } from 'src/app/_services/account.service';
import { PresenceService } from 'src/app/_services/presence.service';
@Component({
  selector: 'app-message-inbox',
  templateUrl: './message-inbox.component.html',
  styleUrls: ['./message-inbox.component.css'],
})
export class MessageInboxComponent {
  faInbox = faInbox;
  modalRef?: BsModalRef;

  constructor(
    private modalService: BsModalService,
    public presenceService: PresenceService,
    public accountService: AccountService,
    private router: Router
  ) {}

  onShowModal(templateRef: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templateRef);
  }

  seeMessage(username: string) {
    this.modalRef?.hide();
    this.router.navigateByUrl('messages/' + username);
  }
}
