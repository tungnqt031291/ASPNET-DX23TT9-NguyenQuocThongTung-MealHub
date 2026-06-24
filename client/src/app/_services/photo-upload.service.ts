import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Photo } from '../_models/photo';
import { Subject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoUploadService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  showProgress = new Subject<number>();

  uploadMemberPhoto(photo: File) {
    const formData = new FormData();
    formData.append('file', photo);

    const req = new HttpRequest(
      'POST',
      this.apiUrl + 'members/add-photo',
      formData,
      { reportProgress: true, headers: this.getHttpOptions()?.headers }
    );

    return this.http.request(req);
  }

  uploadRecipePhoto(photo: File) {}

  getHttpOptions() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token,
      }),
    };
  }
}
