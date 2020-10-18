import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermohonanComponent } from './permohonan.component';

describe('PermohonanComponent', () => {
  let component: PermohonanComponent;
  let fixture: ComponentFixture<PermohonanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermohonanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermohonanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
