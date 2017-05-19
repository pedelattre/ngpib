import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-branch-locator',
  templateUrl: './branch-locator.component.html',
  styleUrls: ['./branch-locator.component.scss']
})
export class BranchLocatorComponent implements OnInit {
  greatings: String = '';
  currentDate: Date = new Date();

  ngOnInit() {
    this.greatings = 'Branch locator ' + this.currentDate;

  }

}
