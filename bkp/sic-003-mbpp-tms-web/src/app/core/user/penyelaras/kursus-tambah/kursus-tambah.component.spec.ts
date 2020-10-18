import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KursusTambahComponent } from './kursus-tambah.component';

describe('KursusTambahComponent', () => {
  let component: KursusTambahComponent;
  let fixture: ComponentFixture<KursusTambahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KursusTambahComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KursusTambahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
