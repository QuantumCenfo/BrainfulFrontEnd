import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

interface Button {
  color: 'default' | 'green' | 'red';
} //meter en index.ts antes de enviar a QA

@Component({
  selector: 'app-reaction-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reaction-game.component.html',
  styleUrls: ['./reaction-game.component.scss']
})
export class ReactionGameComponent implements OnInit {
  buttons: Button[] = [];
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  timeLeft: number = 0;
  score: number = 0;
  timerSubscription: Subscription | null = null;
  isGameRunning: boolean = false;
  sequenceCount: number = 0;
  targetSequenceCount: number = 10;
  hasWon: boolean = false;

  ngOnInit(): void {
    this.setDifficulty('easy');
  }

  setDifficulty(level: 'easy' | 'medium' | 'hard'): void {
    this.difficulty = level;
    this.resetGame();
    switch (level) {
      case 'easy':
        this.buttons = Array.from({ length: 3 }, () => ({ color: 'default' }));
        this.targetSequenceCount = 10;
        break;
      case 'medium':
        this.buttons = Array.from({ length: 6 }, () => ({ color: 'default' }));
        this.targetSequenceCount = 15;
        break;
      case 'hard':
        this.buttons = Array.from({ length: 9 }, () => ({ color: 'default' }));
        this.targetSequenceCount = 20;
        break;
    }
  }

  startGame(): void {
    this.isGameRunning = true;
    this.hasWon = false;
    this.score = 0;
    this.sequenceCount = 0;
    
    switch (this.difficulty) {
      case 'easy':
        this.timeLeft = 30;
        break;
      case 'medium':
        this.timeLeft = 60;
        break;
      case 'hard':
        this.timeLeft = 90;
        break;
    }

    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.changeButtonColors();
      } else {
        this.endGame();
      }
    });
  }

  changeButtonColors(): void {
    let greenSet = false;
    this.buttons.forEach(button => {
      const rand = Math.random();
      if (rand < 0.7) {
        button.color = 'default';
      } else if (rand < 0.85) {
        button.color = 'green';
        greenSet = true;
      } else {
        button.color = 'red';
      }
    });

    // Si ningún botón fue verde, hacemos que uno sea verde aleatoriamente
    if (!greenSet) {
      const randomIndex = Math.floor(Math.random() * this.buttons.length);
      this.buttons[randomIndex].color = 'green';
    }
  }

  endGame(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.isGameRunning = false;
  }

  onButtonClick(button: Button): void {
    if (!this.isGameRunning) return;
    if (button.color === 'green') {
      this.score += 10;
      button.color = 'default';
      this.checkForSequence();
    } else if (button.color === 'red') {
      this.score -= 5;
      button.color = 'default';
    }
  }

  checkForSequence(): void {
    if (this.buttons.every(button => button.color !== 'green')) {
      this.sequenceCount++;
      console.log(`Secuencia completada: ${this.sequenceCount}`);
      if (this.sequenceCount >= this.targetSequenceCount) {
        this.hasWon = true;
        this.endGame();
        console.log('¡Has ganado el juego!');
      }
    }
  }

  resetGame(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.isGameRunning = false;
    this.buttons.forEach(button => button.color = 'default');
  }
}