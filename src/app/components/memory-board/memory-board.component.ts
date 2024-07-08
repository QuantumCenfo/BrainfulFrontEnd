import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MemoryCardComponent } from '../memory-card/memory-card.component';
import { CommonModule } from '@angular/common';
import { MemoryService } from '../../services/memory.service';
import { FormsModule } from '@angular/forms';
import { TimerComponent } from '../timer/timer.component';
import { IGameResults } from '../../interfaces';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-memory-board',
  standalone: true,
  imports: [MemoryCardComponent,CommonModule,FormsModule,TimerComponent],
  templateUrl: './memory-board.component.html',
  styleUrl: './memory-board.component.scss'
})
export class MemoryBoardComponent implements OnChanges {
  @Input() difficulty: number = 0; 
  cards: string[] = []; 
  @Input() gameStarted: boolean = false;
  flippedCards: MemoryCardComponent[] = [];
  matchedCards: MemoryCardComponent[] = [];
  @ViewChild(TimerComponent) timerComponent!: TimerComponent;
  started = false;
  points: number = 0;
  
  constructor(private imageService: MemoryService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if ('difficulty' in changes && this.difficulty > 0) {
      this.gameStarted = false;
      this.cards = [];
    }
  }
  
 
  startOver(): void {;
    this.started = false;
    this.points = 0;
    document.getElementById("points")!.innerHTML = "Puntos: " + this.points;
  }
  endGame(): void {
   
    this.startOver();
    this.timerComponent.stopTimer();
  }

  // Inicia el juego y la secuencia del temporizador
  startGame(): void {
    if (this.difficulty > 0) {
      this.gameStarted = true;
      this.points = 0;
      this.initializeGame();
      let timer =0;
      if(this.difficulty == 6){
        timer=30;
      }else if(this.difficulty == 9){
        timer=60;
      }else if(this.difficulty == 12){
        timer=90;
      }
      this.timerComponent.timer(timer); // Inicia el temporizador con 30 segundos
    } else {
        Swal.fire({
          title: 'Oops...',
          text: 'Seleccione una dificultad antes de comenzar el juego.',
          icon: 'warning',
          iconColor: 'white',
          color: 'white',
          background:'#16c2d5',
          confirmButtonColor: '#ff9f1c',
      })
    }
  }
   
  initializeGame() {
    this.imageService.getRandomImages(this.difficulty).subscribe(images => {
      this.cards = this.generateCardPairs(images);
    });
  }
  generateCardPairs(images: string[]): string[] {
    const cards: string[] = [];
    for (let i = 0; i < images.length; i++) {
      cards.push(images[i]);
      cards.push(images[i]);
    }
    return this.shuffleArray(cards);
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
  addFlippedCard(card: MemoryCardComponent) {
    this.flippedCards.push(card);
  }
  checkForMatch() {
    const [card1, card2] = this.flippedCards;
    if (card1.cardImageUrl === card2.cardImageUrl) {
      card1.isMatched = true;
      card2.isMatched = true;
      this.matchedCards.push(card1, card2);
      this.points = this.points + 10;
    } else {
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        if(this.points >0){
          this.points = this.points - 5;
        }
        
      }, 1000); 
    }
    this.flippedCards = [];
  }
  
}