import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MVVComponent } from './mvv.component';

describe('MVVComponent', () => {
  let component: MVVComponent;
  let fixture: ComponentFixture<MVVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MVVComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MVVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
