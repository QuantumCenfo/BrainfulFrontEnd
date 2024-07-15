import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantumLandingComponent } from './quantum-landing.component';

describe('QuantumLandingComponent', () => {
  let component: QuantumLandingComponent;
  let fixture: ComponentFixture<QuantumLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantumLandingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuantumLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
