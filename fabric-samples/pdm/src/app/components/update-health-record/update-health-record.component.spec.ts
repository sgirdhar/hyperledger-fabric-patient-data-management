import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHealthRecordComponent } from './update-health-record.component';

describe('UpdateHealthRecordComponent', () => {
  let component: UpdateHealthRecordComponent;
  let fixture: ComponentFixture<UpdateHealthRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateHealthRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateHealthRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
