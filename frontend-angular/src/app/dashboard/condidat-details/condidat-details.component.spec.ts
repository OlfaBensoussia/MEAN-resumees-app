import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CondidatDetailsComponent } from './condidat-details.component';

describe('CondidatDetailsComponent', () => {
  let component: CondidatDetailsComponent;
  let fixture: ComponentFixture<CondidatDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CondidatDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CondidatDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
