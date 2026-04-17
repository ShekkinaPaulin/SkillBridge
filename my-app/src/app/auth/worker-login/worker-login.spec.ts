import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerLoginComponent } from './worker-login';

describe('WorkerLogin', () => {
  let component: WorkerLoginComponent;
  let fixture: ComponentFixture<WorkerLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkerLoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
