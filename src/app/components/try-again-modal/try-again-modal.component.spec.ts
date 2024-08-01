import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TryAgainModalComponent } from './try-again-modal.component';

describe('TryAgainModalComponent', () => {
  let component: TryAgainModalComponent;
  let fixture: ComponentFixture<TryAgainModalComponent>;
  let activeModal: NgbActiveModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TryAgainModalComponent], 
      providers: [NgbActiveModal]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TryAgainModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);
    fixture.detectChanges();
  });

 

  it('should close the modal with "tryAgain" when tryAgain is called', () => {
    spyOn(activeModal, 'close');
    component.tryAgain();
    expect(activeModal.close).toHaveBeenCalledWith('tryAgain');
  });

  it('should close the modal with "goToAnotherView" when goToAnotherView is called', () => {
    spyOn(activeModal, 'close');
    component.goToAnotherView();
    expect(activeModal.close).toHaveBeenCalledWith('goToAnotherView');
  });
});
