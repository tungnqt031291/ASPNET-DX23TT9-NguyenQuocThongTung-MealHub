import { Component, Input, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Member } from 'src/app/_models/member';
import { Recipe } from 'src/app/_models/recipe';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css'],
})
export class PhotoUploadComponent {
  modalRef?: BsModalRef;
  @Input() item!: Member | Recipe;
  constructor(private modalService: BsModalService) {}

  showEditPhoto(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  isMember(item: Member | Recipe): item is Member {
    return (item as Member).hasOwnProperty('dateOfBirth');
  }

  isRecipe(item: Member | Recipe): item is Recipe {
    return (item as Recipe).hasOwnProperty('preparationSteps');
  }
}
