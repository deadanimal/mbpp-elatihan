import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeperiksaanMaklumatComponent } from './peperiksaan-maklumat.component';

describe('PeperiksaanMaklumatComponent', () => {
  let component: PeperiksaanMaklumatComponent;
  let fixture: ComponentFixture<PeperiksaanMaklumatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeperiksaanMaklumatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeperiksaanMaklumatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
