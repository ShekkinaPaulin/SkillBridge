import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerRegisterComponent } from './seeker-register';

describe('SeekerRegister', () => {
  let component: SeekerRegisterComponent;
  let fixture: ComponentFixture<SeekerRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeekerRegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeekerRegisterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
