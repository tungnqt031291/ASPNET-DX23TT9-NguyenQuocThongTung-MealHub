import { Component, Input, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Like } from 'src/app/_models/like';

@Component({
  selector: 'app-view-likes',
  templateUrl: './view-likes.component.html',
  styleUrls: ['./view-likes.component.css'],
})
export class ViewLikesComponent {
  @Input() likeCount: number = 0;
  @Input() likes: Like[] = [];
  modalRef?: BsModalRef;

  constructor(private modalService: BsModalService) {}

  showUsers(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
