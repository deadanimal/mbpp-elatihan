import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PelanOperasiComponent } from './pelan-operasi.component';

describe('PelanOperasiComponent', () => {
  let component: PelanOperasiComponent;
  let fixture: ComponentFixture<PelanOperasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PelanOperasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PelanOperasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
