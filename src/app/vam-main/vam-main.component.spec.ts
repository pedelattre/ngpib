/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VamMainComponent } from './vam-main.component';

describe('VamMainComponent', () => {
  let component: VamMainComponent;
  let fixture: ComponentFixture<VamMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VamMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VamMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
