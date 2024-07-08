import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-try-again-modal',
  standalone: true,
  imports: [],
  templateUrl: './try-again-modal.component.html',
  styleUrl: './try-again-modal.component.scss'
})
export class TryAgainModalComponent {
  @Input() message!: string;

  constructor(public activeModal: NgbActiveModal) {}

  tryAgain() {
    this.activeModal.close('tryAgain');
  }

  goToAnotherView() {
    this.activeModal.close('goToAnotherView');
  }
}
