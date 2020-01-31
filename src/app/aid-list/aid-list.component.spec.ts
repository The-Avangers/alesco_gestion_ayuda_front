import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AidListComponent } from './aid-list.component';

describe('AidListComponent', () => {
  let component: AidListComponent;
  let fixture: ComponentFixture<AidListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AidListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AidListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
