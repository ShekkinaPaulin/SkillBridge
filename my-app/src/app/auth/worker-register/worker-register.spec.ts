import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerRegisterComponent } from './worker-register';

describe('WorkerRegister', () => {
  let component: WorkerRegisterComponent;
  let fixture: ComponentFixture<WorkerRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerRegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkerRegisterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
