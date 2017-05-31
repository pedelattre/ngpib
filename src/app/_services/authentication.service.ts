import { Injectable, EventEmitter} from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { CONFIG } from './config';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    // Valuable Customer context
    public token: string;
    private LocalStorageKey = 'currentUser';
    private menus = null
    private params = null
    private sessionPath = null
    private icc = null
    private customerInfo = null

    // Http Header option
    private headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    private options = new RequestOptions({ headers: this.headers }); // Create a request option

    //
    constructor(private http: Http, private config: CONFIG) {
        // set token if saved in local storage
        const currentUser = JSON.parse(localStorage.getItem(this.LocalStorageKey));
        this.token = currentUser && currentUser.token;
    }

    /**
     * getAction : get the URL for the specific action in the params payload
     * @param params
     * @param actionName
     */
     getAction(params: any, actionName: String) : String {
        var action = "";
        for (var i=0; i<params.length;i++) {
            if (params[i]["serviceId"] === actionName) {
                action = params[i].serviceParam;
            }
        }
        return action;
    }

    /**
     * logCAM10 : first request for userid verification by the authentication layer
     * @param userid
     */
    logCAM10(userid: String) : Observable<any>{
        // ...using get request
         return this.http.post(this.config.AUTH_DOMAIN,
                          {
                              idv_cmd: "idv.Authentication",
                              initialAccess: true,
                              nextPage: "IDV_CAM10_AUTHENTICATION_MOBILE",
                              userid: userid,
                              cookieuserid: false,
                              ver: "1.1",
                              json: "",
                              __locale: "fr",
                              CHANNEL: "MOBILE"
                          }, this.options)
                        // ...and calling .json() on the response to return data
                         .map((res:Response) => res.json())
                         //...errors if any
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
      }

    login(username: string, memanswer: string, password: string): Observable<boolean> {
        console.log("login of : " + username, memanswer, password)
        localStorage.setItem(this.LocalStorageKey, "{ 'token': 'Fake token' }")
        return Observable.of(new Boolean(true));
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem(this.LocalStorageKey);
    }
}
