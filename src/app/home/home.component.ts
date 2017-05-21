import { Component, OnInit } from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {TranslateService} from '@ngx-translate/core';

import { User } from '../_models/User';
import { UserService } from '../_services/user.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.scss']})
export class HomeComponent implements OnInit {
    users: User[] = [];

    constructor(private userService: UserService) { }

    ngOnInit() {
        // get users from secure api end point
        this.userService.getUsers()
            .subscribe(users => {
                this.users = users;
            });
    }

}
