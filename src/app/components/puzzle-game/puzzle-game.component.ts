import { Component, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuzzleService } from '../../services/puzzle.service';
import { FormsModule } from '@angular/forms';
import { TimerComponent } from '../timer/timer.component';
import { IGame, IGameResults, IUser, PuzzlePiece } from '../../interfaces';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TryAgainModalComponent } from '../try-again-modal/try-again-modal.component';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-puzzle-game',
  standalone: true,
  imports: [CommonModule,FormsModule,TimerComponent],
  templateUrl: './puzzle-game.component.html',
  styleUrl: './puzzle-game.component.scss'
})
export class PuzzleComponent implements OnChanges {
  isGameRunning: boolean = false;
  @Input() difficulty: number = 0; 
  @Input() gameStarted: boolean = false;
  @ViewChild(TimerComponent) timerComponent!: TimerComponent;
  elapsedTime: number = 0;
  pieceActual: PuzzlePiece | null = null;
  piecesBlackActual: PuzzlePiece | null = null;
  pieces: PuzzlePiece[] = [];
  piecesBlack: PuzzlePiece[] = [];
  gridSize: number = 0;
  cards: string = ""; 
  started = false;
  points: number = 0;
  
  gameId: number | undefined;
  public puzzleService = inject(PuzzleService);
  private routerSubscription: Subscription;
  constructor(
    private imageService: PuzzleService, 
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef) {
    
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
  resetTimer(): void {
    const timerComponent = document.getElementById("timerComponent") as any; 
    if (timerComponent && timerComponent.resetTimer) {
      timerComponent.resetTimer();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if ('difficulty' in changes && this.difficulty > 0) {
      this.gameStarted = false;
      this.cards = "";
    }
  }

  resetGame(): void {
    this.pieceActual = null;
    this.pieces = [];
    this.piecesBlack = [];
    this.gridSize = 0;
    this.started = false;
    this.points = 0;
  
   
  }

  startOver(): void {
    this.resetGame();
    document.getElementById("points")!.innerHTML = "Puntos: " + this.points;
  }
  
  startGame(): void {
    this.isGameRunning = true;
    this.startOver();
    if (this.difficulty > 0) {
      this.gameStarted = true;
      this.points = 0;
      this.initializeGame();
      let timer = 0;
      if (this.difficulty == 9) {
        timer = 45;
        this.gridSize = 3;
      } else if (this.difficulty == 16) {
        timer = 90;
        this.gridSize = 4;
      } else if (this.difficulty == 25) {
        timer = 120;
        this.gridSize = 5;
      }
      this.timerComponent.timer(timer); 
    } else {
      Swal.fire({
        title: 'Oops...',
        text: 'Seleccione una dificultad antes de comenzar el juego.',
        icon: 'warning',
        iconColor: 'white',
        color: 'white',
        background: '#16c2d5',
        confirmButtonColor: '#ff9f1c',
      });
      this.isGameRunning = false;
    }
  }
  
  initializeGame() {
    this.imageService.getRandomImages(1).subscribe(images => {
      const imageSrc = images[0];
      const imageSrcNegro = './assets/img/Negro.jpg';
      this.createPuzzlePieces(imageSrc);
      this.createPuzzlePiecesNegro(imageSrcNegro);
      this.shufflePieces(); // Asegúrate de llamar a shufflePieces después de crear las piezas
    });
  }
  
  onPieceClick(piece: PuzzlePiece) {
    if (piece.src === "./assets/img/Negro.jpg") {
      if (this.pieceActual != null) 
      {
        if(piece.originalOrder == this.pieceActual.originalOrder)
        {
          this.playSound("Correct");
          Swal.fire({
            iconColor: 'white',
            color: 'white',
            background:'#36cf4f',
            toast: true,
            position: 'bottom',
            icon: 'success',
            title: 'Pieza correcta',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
          });
         
          const indexPieceActual = this.pieces.findIndex(p => p.originalOrder === this.pieceActual!.originalOrder);
          if (indexPieceActual !== -1) {
            this.pieces[indexPieceActual] = piece;
          }
          const indexPieceBlack = this.piecesBlack.findIndex(p => p.originalOrder === piece.originalOrder);
          if (indexPieceBlack !== -1) {
            this.piecesBlack[indexPieceBlack] = this.pieceActual;
          }
          this.pieceActual = null;
        
          this.points = this.points + 10;
          document.getElementById("points")!.innerHTML = "Puntos: " + this.points;
          this.cdr.detectChanges();
          this.checkForWin()
        }
        else
        {
          this.playSound("Wrong2");
          Swal.fire({
            iconColor: 'white',
            color: 'white',
            background:'#d54f16',
            toast: true,
            position: 'bottom',
            icon: 'error',
            title: 'Pieza incorrecta',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
          });
         
          this.pieceActual = null;
          this.points = Math.max(this.points - 5, 0);
          document.getElementById("points")!.innerHTML = "Puntos: " + this.points;
          this.cdr.detectChanges();
        }

      }
    } else {
      // Si no es la pieza "Negro", asignar como pieceActual
      this.pieceActual = piece;
    }
  }

  checkForWin() {
    const todasNegrasReemplazadas = this.piecesBlack.every(p => p.src !== "./assets/img/Negro.jpg");
    if (todasNegrasReemplazadas) {
     
      const elapsedTime = this.timerComponent.elapsedTime; // Captura el tiempo transcurrido desde el timerComponent
      this.gatherDataAndSave(elapsedTime);
      this.showVictoryAlert();
    }
  }
  playSound(name: string): void {
    const audio = new Audio("../../../assets/sounds/" + name + ".mp3");
    audio.load();
    audio.play();
  }
  
  createPuzzlePieces(imageSrc: string) {
    const pieceWidth = 400 / this.gridSize; // Ajustar según el tamaño de tu imagen
    const pieceHeight = 400 / this.gridSize; // Ajustar según el tamaño de tu imagen
  
    let order = 1; // Inicializamos el orden en 1
  
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        this.pieces.push({
          src: imageSrc,
          originalOrder: order, // Asignamos el orden actual
          x: x * pieceWidth,
          y: y * pieceHeight,
          width: pieceWidth,
          height: pieceHeight,
          position: { x, y }
        });
        order++; // Incrementamos el orden para la siguiente pieza
      }
    }
  }

  createPuzzlePiecesNegro(imageSrc: string) {
    const pieceWidth = 400 / this.gridSize; // Ajustar según el tamaño de tu imagen
    const pieceHeight = 400 / this.gridSize; // Ajustar según el tamaño de tu imagen
  
    let order = 1; // Inicializamos el orden en 1
  
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        this.piecesBlack.push({
          src: imageSrc,
          originalOrder: order, // Asignamos el orden actual
          x: x * pieceWidth,
          y: y * pieceHeight,
          width: pieceWidth,
          height: pieceHeight,
          position: { x, y }
        });
        order++; // Incrementamos el orden para la siguiente pieza
      }
    }
  }
  
  shufflePieces() {
    this.pieces = this.pieces.sort(() => Math.random() - 0.5);
  }

  startWithNewDifficulty(): void {
    this.started = false;
    this.points = 0;
    document.getElementById("points")!.innerHTML = "Puntos: " + this.points;
    if (this.difficulty == 9) { 
      this.difficulty = 16; 
    } else if (this.difficulty == 16) { 
      this.difficulty = 25;
    }
    this.startGame();
  }

  
  gatherDataAndSave(elapsedTime: number): void {
    const user_id: number | undefined = this.getUserIdFromLocalStorage();
    let stringDifficulty;
    if (this.difficulty == 9) {
      stringDifficulty = "Facil";
    } else if (this.difficulty == 16) {
      stringDifficulty = "Media";
    } else if (this.difficulty == 25) {
      stringDifficulty = "Dificil";
    }
    const gameResults: IGameResults = {
      gameDate: new Date().toISOString(),
      levelDifficulty: stringDifficulty,
      score: this.points,
      time: elapsedTime,
      gameId: { gameId: this.gameId } as IGame,
      userId: {id:user_id} as IUser,
    };
    console.log("Game Results:", gameResults);
    this.puzzleService.save(gameResults);
  }
  getUserIdFromLocalStorage(): number | undefined {
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.id ? Number(user.id) : undefined;
    }
    return undefined;
  }


  endGame(): void {
    this.isGameRunning = false;
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
  exitGames(){
    this.router.navigate(['/app/games'])
  }
}


