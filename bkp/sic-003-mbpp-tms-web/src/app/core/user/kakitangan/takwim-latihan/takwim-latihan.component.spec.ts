import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakwimLatihanComponent } from './takwim-latihan.component';

describe('TakwimLatihanComponent', () => {
  let component: TakwimLatihanComponent;
  let fixture: ComponentFixture<TakwimLatihanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakwimLatihanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakwimLatihanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
