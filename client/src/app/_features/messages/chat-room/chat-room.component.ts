import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AccountService } from '../../../_services/account.service';
import { MessageService } from '../../../_services/message.service';
import { Message } from '../../../_models/message';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Pagination } from 'src/app/_models/pagination';
import { PaginationParams } from 'src/app/_models/payloads/pagination-params';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  pagination: Pagination | undefined;
  messageChatParams: PaginationParams | undefined;
  paramsSub!: Subscription;
  username: string = '';
  user?: User;
  faTrash = faTrash;
  paginationSub?: Subscription;
  messagingToMember: Member | undefined;

  constructor(
    private accountService: AccountService,
    public messageService: MessageService,
    private route: ActivatedRoute,
    private memberService: MemberService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });
  }

  private initializeChatRoom(username: string) {
    this.messageService.resetParams();
    this.messageService.stopHubConnection();
    this.messageChatParams = this.messageService.getMessageParams();
    this.memberService.getMemberUsername(username).subscribe({
      next: (response) => {
        this.messagingToMember = response;
        if (this.messagingToMember)
          this.messageService.HasNotChattedWith(this.messagingToMember);
      },
    });

    this.paginationSub = this.messageService.pagination$.subscribe({
      next: (pagination) => {
        this.pagination = pagination;
      },
    });
  }

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe({
      next: (params) => {
        this.username = params['username'];
        this.initializeChatRoom(this.username);
        if (this.user) {
          this.messageService.createHubConnection(this.user, this.username);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
    this.messageChatParams?.setOffset(0);
    this.messageService.stopHubConnection();
    this.paginationSub?.unsubscribe();
  }

  onPostMessage(messageForm: NgForm) {
    if (!this.user || !this.messagingToMember) return;

    const payload = {
      receiverUsername: this.username,
      content: messageForm.value.message,
    };
    this.messageService.createMessage(payload).then(() => {
      messageForm.reset();
    });
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: (_) => {
        this.messageService.messageSocket$.pipe(take(1)).subscribe({
          next: (messages) =>
            messages?.splice(
              messages.findIndex((m) => m.messageId == id),
              1
            ),
        });
      },
    });
  }

  onScroll() {
    if (this.pagination && this.messageChatParams) {
      if (this.messageChatParams?.allItemsLoaded(this.pagination.totalItems)) {
        return;
      }

      this.messageChatParams?.incrementOffset();
      this.messageService
        .loadMoreMessagesForChat(
          this.username,
          this.messageChatParams.getOffset(),
          this.messageChatParams.getPageSize()
        )
        .then(() => {});
    }
  }

  get User(): { username: string; url: string } | null {
    if (this.messagingToMember) {
      return {
        username: this.messagingToMember.userName,
        url: this.messagingToMember.photo.url,
      };
    }
    return null;
  }

  get currentUser() {
    if (this.user) {
      return this.user.userName;
    } else return '';
  }
}
