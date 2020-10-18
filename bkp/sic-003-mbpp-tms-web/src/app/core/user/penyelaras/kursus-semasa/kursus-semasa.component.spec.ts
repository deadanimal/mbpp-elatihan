import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KursusSemasaComponent } from './kursus-semasa.component';

describe('KursusSemasaComponent', () => {
  let component: KursusSemasaComponent;
  let fixture: ComponentFixture<KursusSemasaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KursusSemasaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KursusSemasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
