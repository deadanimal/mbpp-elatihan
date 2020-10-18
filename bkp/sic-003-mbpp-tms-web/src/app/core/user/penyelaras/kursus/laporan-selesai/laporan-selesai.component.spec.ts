import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanSelesaiComponent } from './laporan-selesai.component';

describe('LaporanSelesaiComponent', () => {
  let component: LaporanSelesaiComponent;
  let fixture: ComponentFixture<LaporanSelesaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanSelesaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanSelesaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
