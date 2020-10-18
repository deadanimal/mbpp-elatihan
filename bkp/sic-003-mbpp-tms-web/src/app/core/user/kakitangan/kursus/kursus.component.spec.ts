import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KursusComponent } from './kursus.component';

describe('KursusComponent', () => {
  let component: KursusComponent;
  let fixture: ComponentFixture<KursusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KursusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KursusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
