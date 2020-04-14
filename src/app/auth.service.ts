import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private readonly socket: Socket) { }

    public isAuthenticated(): Promise<boolean> {
        console.log('here');
        const id = JSON.parse(sessionStorage.getItem('userId'));
        this.socket.emit('is auth', id);
        this.socket.removeAllListeners();
        console.log();
        return new Promise(resolve => {
            this.socket.fromEvent<boolean>('can log in')
                .pipe(
                    take(1)
                ).subscribe(canLogIn => {
                    console.log('here but i shouldnt be');
                    console.log(canLogIn);
                    resolve(false);
                }, err => {
                    console.log('here');
                    resolve(false);
                });
        });
    }
}
