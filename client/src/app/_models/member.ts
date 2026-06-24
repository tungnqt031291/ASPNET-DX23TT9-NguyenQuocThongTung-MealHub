import { Photo } from './photo';

export interface Member {
  userName: string;
  alias: string;
  gender: string;
  description: any;
  memberSince: string;
  dateOfBirth: string;
  photo: Photo;
}
