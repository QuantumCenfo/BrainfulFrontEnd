import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-memory-card',
  standalone: true,
  imports: [],
  templateUrl: './memory-card.component.html',
  styleUrl: './memory-card.component.scss'
})
export class MemoryCardComponent {
  @Input() cardValue: string = ''; // Value to display on the card
  isFlipped: boolean = false; // State to track if the card is flipped

  constructor() { }

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }
}
