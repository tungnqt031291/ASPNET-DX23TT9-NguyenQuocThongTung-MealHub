import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-messaging-users',
  templateUrl: './messaging-users.component.html',
  styleUrls: ['./messaging-users.component.css'],
})
export class MessagingUsersComponent implements OnInit, OnDestroy {
  @Output('on-no-chats-found') noChatsFound = new EventEmitter<boolean>();
  constructor(
    public messageService: MessageService,
    public presenceService: PresenceService
  ) {}

  ngOnInit(): void {
    this.loadMessagingUsers();
  }

  loadMessagingUsers() {
    this.messageService.getMessagingUsers().subscribe({
      next: (response) => {
        if (response && response.length < 1) {
          this.noChatsFound.next(true);
        }
      },
    });
  }

  ngOnDestroy(): void {}
}
