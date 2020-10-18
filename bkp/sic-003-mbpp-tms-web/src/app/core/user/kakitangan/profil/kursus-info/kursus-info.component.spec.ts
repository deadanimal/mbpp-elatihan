import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KursusInfoComponent } from './kursus-info.component';

describe('KursusInfoComponent', () => {
  let component: KursusInfoComponent;
  let fixture: ComponentFixture<KursusInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KursusInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KursusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
