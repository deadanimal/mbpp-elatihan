import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakwimComponent } from './takwim.component';

describe('TakwimComponent', () => {
  let component: TakwimComponent;
  let fixture: ComponentFixture<TakwimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakwimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakwimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
