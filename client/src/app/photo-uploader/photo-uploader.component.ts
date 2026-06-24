import { Component, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Member } from '../_models/member';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';
import { Photo } from '../_models/photo';
import { faUpload, faBan, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Recipe } from '../_models/recipe';

@Component({
  selector: 'app-photo-uploader',
  templateUrl: './photo-uploader.component.html',
  styleUrls: ['./photo-uploader.component.css'],
})
export class PhotoUploaderComponent {
  @Input() item!: Member | Recipe;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  apiUrl = environment.apiUrl;
  user: User | null = null;

  faUpload = faUpload;
  faBan = faBan;
  faTrash = faTrash;

  constructor(private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => (this.user = user),
    });
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(event: any) {
    this.hasBaseDropZoneOver = event;
  }

  initializeUploader() {
    var url = '';
    if (this.isMember(this.item)) {
      url = this.apiUrl + 'members/add-photo';
    } else if (this.isRecipe(this.item)) {
      url = this.apiUrl + `recipes/${this.item.id}/add-photo`;
    }
    console.log(url);

    this.uploader = new FileUploader({
      url: url,
      authToken: `Bearer ${this.user?.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });
    this.uploader.onAfterAddingFile = (f) => {
      if (this.uploader) {
        if (this.uploader.queue.length > 1) {
          this.uploader.removeFromQueue(this.uploader.queue[0]);
        }
      }
      f.withCredentials = false;
    };
    console.log("ok");
    
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo: Photo = JSON.parse(response);
        if (this.item && this.user) {
          if (this.isMember(this.item)) {
            this.item.photo = photo;
            this.user.photoUrl = photo.url;
            this.accountService.setCurrentUser(this.user);
          } else {
            this.item.imageUrl = photo.url;
          }
        }
      }
    };
  }

  isMember(item: Member | Recipe): item is Member {
    return (item as Member).hasOwnProperty('dateOfBirth');
  }

  isRecipe(item: Member | Recipe): item is Recipe {
    return (item as Recipe).hasOwnProperty('preparationSteps');
  }
}
