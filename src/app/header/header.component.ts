import {Component} from '@angular/core';
import {Router}  from '@angular/router';
import {TranslateService} from 'ng2-translate';

@Component({
  selector: 'app-header', 
  templateUrl: './header.component.html', 
  styleUrls: ['./header.component.scss']})
export class HeaderComponent {
  // title = 'Youhou';
  button_title = 'Déconnexion';
  header_subtitle = 'Ma banque en ligne';
  header_title = 'HSBC France, votre banque en ligne';
  // chosenLanguage = 0;

  constructor(private translate: TranslateService,
  private router: Router) { }

  logout() {
    if ( confirm('Really, you want to quit ?') ) {
      this.router.navigate(['logout']);
      }
  }
}
