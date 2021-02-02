import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class ServiceBase {

    protected headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json'
    });


    constructor(protected http: HttpClient) { }

    public setAuthToken(token: string | null) {

        const AuthorizationHeader = 'authorization';

        if (this.headers.has(AuthorizationHeader)) {
            this.headers = this.headers.set(AuthorizationHeader, '' + token);
        } else {
            this.headers = this.headers.append(AuthorizationHeader, '' + token);
        }
    }
}