import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenaraiComponent } from './senarai.component';

describe('SenaraiComponent', () => {
  let component: SenaraiComponent;
  let fixture: ComponentFixture<SenaraiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenaraiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenaraiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
