import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PengurusanLogComponent } from './pengurusan-log.component';

describe('PengurusanLogComponent', () => {
  let component: PengurusanLogComponent;
  let fixture: ComponentFixture<PengurusanLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PengurusanLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PengurusanLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
