import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeperiksaanTambahComponent } from './peperiksaan-tambah.component';

describe('PeperiksaanTambahComponent', () => {
  let component: PeperiksaanTambahComponent;
  let fixture: ComponentFixture<PeperiksaanTambahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeperiksaanTambahComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeperiksaanTambahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
