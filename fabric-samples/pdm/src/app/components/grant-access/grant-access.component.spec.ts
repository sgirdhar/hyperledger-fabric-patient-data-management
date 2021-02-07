import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantAccessComponent } from './grant-access.component';

describe('GrantAccessComponent', () => {
  let component: GrantAccessComponent;
  let fixture: ComponentFixture<GrantAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrantAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
