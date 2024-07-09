import { Component, Input } from '@angular/core';
import { MemoryBoardComponent } from '../memory-board/memory-board.component';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-memory-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memory-card.component.html',
  styleUrl: './memory-card.component.scss'
})
export class MemoryCardComponent {
  @Input() cardImageUrl: string = ''; 
  isFlipped: boolean = false;
  isMatched: boolean = false;
  isHidden: boolean = false;

  constructor(private memoryBoard: MemoryBoardComponent) {}

  flipCard() {
    if (!this.isFlipped && !this.isMatched && this.memoryBoard.flippedCards.length < 2) {
      this.isFlipped = true;
      this.memoryBoard.addFlippedCard(this);
      if (this.memoryBoard.flippedCards.length === 2) {
        this.memoryBoard.checkForMatch();
      }
    }
  }

  reset() {
    this.isFlipped = false;
    this.isMatched = false;
  }
  hideCard() {
    this.isHidden = true;
  }

}
