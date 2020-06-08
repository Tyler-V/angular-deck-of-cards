import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private readonly socket: Socket) { }

    public isAuthenticated(): Promise<boolean> {
        const id = JSON.parse(sessionStorage.getItem('userId'));
        this.socket.emit('is auth', id);
        this.socket.removeAllListeners();
        return new Promise(resolve => {
            this.socket.fromEvent<boolean>('can log in')
                .pipe(
                    take(1)
                ).subscribe(canLogIn => {
                    resolve(false);
                }, err => {
                    resolve(false);
                });
        });
    }
}
