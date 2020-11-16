import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCondidatComponent } from './edit-condidat.component';

describe('EditCondidatComponent', () => {
  let component: EditCondidatComponent;
  let fixture: ComponentFixture<EditCondidatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCondidatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCondidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
