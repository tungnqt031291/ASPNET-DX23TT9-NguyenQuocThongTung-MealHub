import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class routeParamsGuard  {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (route.url.toString().includes('recipes')) {
      const id = route.params['id'];
      // Check if the id is not a valid integer
      if (isNaN(id)) {
        this.router.navigateByUrl('/not-found');
        return false;
      }
    } else if (route.url.toString().includes('users')) {
      const username = route.params['username'];
      if (!isNaN(username)) {
        this.router.navigateByUrl('/not-found');
        return false;
      }
    }

    return true;
  }
}
