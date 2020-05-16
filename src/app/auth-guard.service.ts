import { CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    constructor(private readonly auth: AuthService, private readonly router: Router) { }
    canActivate(): boolean {
        

        if (!this.auth.isAuthenticated()) {
            this.router.navigate(['soz-gotta-wait-a-bit']);
            return false;
        }
        return true;
    }
}
