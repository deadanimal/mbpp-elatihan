import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KursusSejarahComponent } from './kursus-sejarah.component';

describe('KursusSejarahComponent', () => {
  let component: KursusSejarahComponent;
  let fixture: ComponentFixture<KursusSejarahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KursusSejarahComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KursusSejarahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
