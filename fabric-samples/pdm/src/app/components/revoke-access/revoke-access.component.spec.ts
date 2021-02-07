import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeAccessComponent } from './revoke-access.component';

describe('RevokeAccessComponent', () => {
  let component: RevokeAccessComponent;
  let fixture: ComponentFixture<RevokeAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevokeAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevokeAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
