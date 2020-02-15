import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AidFormComponent } from './aid-form.component';

describe('AidFormComponent', () => {
  let component: AidFormComponent;
  let fixture: ComponentFixture<AidFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AidFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AidFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
