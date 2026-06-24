import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import {
  BehaviorSubject,
  Observable,
  Subject,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  getPaginatedResults,
  getPaginationMessagesHeaders,
} from './pagination-helper';
import { Message } from '../_models/message';
import { environment } from 'src/environments/environment';
import { getHttpOptions } from './http-headers-helper';
import { Member } from '../_models/member';
import { PaginationParams } from '../_models/payloads/pagination-params';
import { MemberService } from './member.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Pagination } from '../_models/pagination';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  apiUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private messageSocketSource = new BehaviorSubject<Message[]>([]);
  private messagingUsersSource = new BehaviorSubject<Member[]>([]);

  messagingUsers$ = this.messagingUsersSource.asObservable();

  pagination$ = new Subject<Pagination>();

  messageSocket$ = this.messageSocketSource.asObservable();

  user: User | null = null;
  messageParams: PaginationParams = new PaginationParams();

  messagingUsersCache: Member[] = [];
  messageChatCache = new Map();
  updatedMessagingUser = new Subject<Member>();

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
      },
    });

  }

  createHubConnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'chat?user=' + otherUsername, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('ReceiveMessageSocket', (paginatedResponse) => {
      this.messageSocketSource.next(paginatedResponse.messages);
      this.pagination$.next(paginatedResponse.paginationHeader);
    });

    this.hubConnection.on('NewMessage', (message: Message) => {
      this.messageSocket$.pipe(take(1)).subscribe({
        next: (messages) => {
          this.messageSocketSource.next([message, ...messages]);
        },
      });
    });

    this.hubConnection?.on('LoadOlderMessages', (newMessages) => {
      this.messageSocket$.pipe(take(1)).subscribe({
        next: (messages) => {
          this.messageSocketSource.next([...messages, ...newMessages]);
        },
      });
    });
  }

  stopHubConnection() {
    if (this.hubConnection) this.hubConnection.stop();
  }

  getMessageParams() {
    this.messageParams.setItemsPerPage(7);
    return this.messageParams;
  }

  setMessageParams(messageParams: PaginationParams) {
    this.messageParams = messageParams;
  }

  getMessagingUsers() {
    return this.http
      .get<Member[]>(this.apiUrl + 'messages/get-users', getHttpOptions())
      .pipe(
        map((response) => {
          this.messagingUsersSource.next(response);
          return response;
        })
      );
  }

  HasNotChattedWith(user: Member) {
    const users = this.messagingUsersSource.getValue();

    if (!users.find((u: Member) => u.userName === user.userName)) {
      const updatedUsers = [...users, user];
      this.messagingUsersSource.next(updatedUsers);
    }
  }

  getMessageSocket(username: string, messageParams: PaginationParams) {
    const response = this.messageChatCache.get(
      Object.values(messageParams).join('-') + username
    );

    if (response) return of(response);

    let params = getPaginationMessagesHeaders(messageParams);

    return getPaginatedResults<Message[]>(
      this.apiUrl + 'messages/socket/' + username,
      params,
      this.http
    ).pipe(
      map((response) => {
        this.messageChatCache.set(
          Object.values(messageParams).join('-') + username,
          response
        );
        return response;
      })
    );
  }

  async loadMoreMessagesForChat(
    otherUsername: string,
    offset: number,
    pageSize: number
  ) {
    return this.hubConnection
      ?.invoke('LoadMoreMessages', otherUsername, offset, pageSize)
      .catch((error) => console.log(error));
  }

  resetParams() {
    this.messageParams = new PaginationParams();
  }

  async createMessage(messageDto: {
    receiverUsername: string;
    content: string;
  }) {
    return this.hubConnection
      ?.invoke('SendMessage', messageDto)
      .catch((error) => console.log(error));
  }

  deleteMessage(id: number) {
    return this.http.delete(this.apiUrl + 'messages/' + id, getHttpOptions());
  }

  clearCaches() {
    this.messageChatCache = new Map();
    this.messagingUsersCache = [];
  }
}
