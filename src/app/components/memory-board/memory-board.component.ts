
import { Component, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MemoryCardComponent } from '../memory-card/memory-card.component';
import { CommonModule } from '@angular/common';
import { MemoryService } from '../../services/memory.service';
import { FormsModule } from '@angular/forms';
import { TimerComponent } from '../timer/timer.component';
import { IGame, IGameResults, IUser } from '../../interfaces';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TryAgainModalComponent } from '../try-again-modal/try-again-modal.component';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-memory-board',
  standalone: true,
  imports: [MemoryCardComponent,CommonModule,FormsModule,TimerComponent],
  templateUrl: './memory-board.component.html',
  styleUrl: './memory-board.component.scss'
})
export class MemoryBoardComponent implements OnChanges {
  @Input() difficulty: number = 0; 
  @Input() gameStarted: boolean = false;
  @ViewChild(TimerComponent) timerComponent!: TimerComponent;
  elapsedTime: number = 0;
  cards: string[] = []; 
  flippedCards: MemoryCardComponent[] = [];
  matchedCards: MemoryCardComponent[] = [];
  started = false;
  points: number = 0;
  gameId: number | undefined;
  public memoryService = inject(MemoryService);
  private routerSubscription: Subscription;
  constructor(
    private imageService: MemoryService, 
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute) {
    
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
      
        this.resetTimer();
      }
    });
  }
  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const gameId = paramMap.get('gameId');
      this.gameId = gameId ? +gameId : undefined;
      console.log('Game ID:', this.gameId);
    
    });
  }
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
    /**
   * Reinicia el temporizador
   */
  resetTimer(): void {
    const timerComponent = document.getElementById("timerComponent") as any; 
    if (timerComponent && timerComponent.resetTimer) {
      timerComponent.resetTimer();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if ('difficulty' in changes && this.difficulty > 0) {
      this.gameStarted = false;
      this.cards = [];
    }
  }
  
 /**
   * Reinicia el juego, restableciendo todos los estados y puntos.
   */
  startOver(): void {;
    this.started = false;
    this.points = 0;
    this.flippedCards = [];
    this.matchedCards = [];
    document.getElementById("points")!.innerHTML = "Puntos: " + this.points;
  }
    /**
   * Finaliza el juego, mostrando un modal y permitiendo reiniciar o ir al menú.
   */
  endGame(): void {
   
    this.startOver();
    this.timerComponent.stopTimer();
    const modalRef = this.modalService.open(TryAgainModalComponent);
    modalRef.componentInstance.message = 'Fin del juego! Presione el boton de jugar para iniciar de nuevo.';

    modalRef.result.then((result) => {
      if (result === 'tryAgain') {
        this.startGame();
      } else if (result === 'goToAnotherView') {
        this.router.navigate(['app/games']);
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  /**
   * Inicia el juego con la dificultad seleccionada y el temporizador correspondiente.
   */
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
      this.timerComponent.timer(timer); 
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
    /**
   * Inicializa el juego cargando imágenes aleatorias según la dificultad.
   */
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
 /**
   * Mezcla un arreglo usando el algoritmo de Fisher-Yates.
   * @param array Arreglo que se desea mezclar.
   * @returns El arreglo mezclado.
   */
  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
   /**
   * Agrega una carta volteada al arreglo de cartas volteadas y verifica si hay coincidencia si hay dos cartas volteadas.
   * @param card La carta que se ha volteado.
   */
  addFlippedCard(card: MemoryCardComponent) {
    this.flippedCards.push(card);
    if (this.flippedCards.length === 2) {
      this.checkForMatch();
    }
  }
   /**
   * Verifica si las dos cartas volteadas coinciden y maneja la lógica de juego.
   */
  checkForMatch() {
    const [card1, card2] = this.flippedCards;
    if (card1.cardImageUrl === card2.cardImageUrl) {
      card1.isMatched = true;
      card2.isMatched = true;
      this.matchedCards.push(card1, card2);
      this.points = this.points + 10;
      this.checkForWin();
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
  
  /**
   * Verifica si el jugador ha ganado el juego, comparando las cartas emparejadas con el total de cartas.
   */
  checkForWin() {
    if (this.matchedCards.length === this.cards.length) {
     
      const elapsedTime = this.timerComponent.elapsedTime; // Captura el tiempo transcurrido desde el timerComponent
      this.gatherDataAndSave(elapsedTime);
      this.showVictoryAlert();
    }
  }
   /**
   * Recolecta datos del juego y los guarda utilizando el servicio de memoria.
   * @param elapsedTime Tiempo transcurrido en segundos.
   */
  gatherDataAndSave(elapsedTime: number): void {
    const user_id: number | undefined = this.getUserIdFromLocalStorage();
    let stringDifficulty;
    if (this.difficulty == 6) {
      stringDifficulty = "Facil";
    } else if (this.difficulty == 9) {
      stringDifficulty = "Media";
    } else if (this.difficulty == 12) {
      stringDifficulty = "Dificil";
    }
     /**
   * Obtiene el ID de usuario almacenado en el almacenamiento local.
   * @returns El ID de usuario si está disponible, de lo contrario, `undefined`.
   */
    const gameResults: IGameResults = {
      gameDate: new Date().toISOString(),
      levelDifficulty: stringDifficulty,
      score: this.points,
      time: elapsedTime,
      gameId: { gameId: this.gameId } as IGame,
      userId: {id:user_id} as IUser,
    };
    console.log("Game Results:", gameResults);
    this.memoryService.save(gameResults);
  }
  
  getUserIdFromLocalStorage(): number | undefined {
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.id ? Number(user.id) : undefined;
    }
    return undefined;
  }
    /**
   * Muestra un alerta de victoria y permite al jugador jugar de nuevo o volver al menú de juegos.
   */
  showVictoryAlert() {
    this.timerComponent.stopTimer();
    Swal.fire({
      iconColor: 'white',
      color: 'white',
      background:'#36cf4f',
      confirmButtonColor: '#ff9f1c',
      cancelButtonColor: '#16c2d5',
      title: '¡Felicidades!',
      text: 'Has ganado el juego',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Jugar de nuevo',
      cancelButtonText: 'Volver al Menú de juegos',
    }).then((result) => {
      if (result.isConfirmed) {
        this.startWithNewDifficulty();
      } else {
        this.router.navigate(['app/games']);
      }
    });
  }
   /**
   * Reinicia el juego con una dificultad diferente, restableciendo todos los estados y puntos.
   */
  startWithNewDifficulty(): void {
    this.started = false;
    this.points = 0;
    document.getElementById("points")!.innerHTML = "Puntos: " + this.points;
    this.flippedCards = [];
    this.matchedCards = [];
    if (this.difficulty == 6) { 
      this.difficulty = 9; 
    } else if (this.difficulty == 9) { 
      this.difficulty = 12;
    }
    this.startGame();
  }
  

}


