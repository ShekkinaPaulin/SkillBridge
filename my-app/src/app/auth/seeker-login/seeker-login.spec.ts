import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerLoginComponent } from './seeker-login';

describe('SeekerLogin', () => {
  let component: SeekerLoginComponent;
  let fixture: ComponentFixture<SeekerLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeekerLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeekerLoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
