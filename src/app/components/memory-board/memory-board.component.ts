import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MemoryCardComponent } from '../memory-card/memory-card.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-memory-board',
  standalone: true,
  imports: [MemoryCardComponent,CommonModule],
  templateUrl: './memory-board.component.html',
  styleUrl: './memory-board.component.scss'
})
export class MemoryBoardComponent implements OnChanges {
  @Input() difficulty: number = 0; // Default difficulty is 0, meaning no cards initially
  cards: string[] = []; // Array to hold cards

  ngOnChanges(changes: SimpleChanges) {
    if ('difficulty' in changes && this.difficulty > 0) {
      this.initializeGame();
    }
  }

  initializeGame() {
    this.cards = this.generateRandomCards(this.difficulty);
  }

  generateRandomCards(difficulty: number): string[] {
    const pairs = difficulty / 2;
    const cards: string[] = [];

    for (let i = 1; i <= pairs; i++) {
      cards.push(`Card ${i}`);
      cards.push(`Card ${i}`);
    }

    return this.shuffleArray(cards);
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}