import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-bar',
  templateUrl: './contact-bar.component.html',
  styleUrls: ['./contact-bar.component.scss']
})
export class ContactBarComponent implements OnInit {
  items = [];
  constructor() { }

  ngOnInit() {
    this.items.push({ value: 0, name: 'first contact' });
  }

}
