import { HttpHeaders } from "@angular/common/http";

export function getHttpOptions() {
  const userString = localStorage.getItem('user');
  if (!userString) return;

  const user = JSON.parse(userString);
  return {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + user.token,
    }),
  };
}
