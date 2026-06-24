import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent {
  noChatsFound = false;
  constructor() {}
  onNoChatsFound(event: boolean) {
    this.noChatsFound = event;
  }
}
