import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenilaianLuaranComponent } from './penilaian-luaran.component';

describe('PenilaianLuaranComponent', () => {
  let component: PenilaianLuaranComponent;
  let fixture: ComponentFixture<PenilaianLuaranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenilaianLuaranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenilaianLuaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
