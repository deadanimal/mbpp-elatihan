import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeperluanKursusComponent } from './keperluan-kursus.component';

describe('KeperluanKursusComponent', () => {
  let component: KeperluanKursusComponent;
  let fixture: ComponentFixture<KeperluanKursusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeperluanKursusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeperluanKursusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
