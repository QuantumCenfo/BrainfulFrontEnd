import { ReactionGameService } from './../../services/reaction-game.service';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { IGame, IGameResults, IUser, IButton } from '../../interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, NavigationStart, } from '@angular/router';
import { TryAgainModalComponent } from '../try-again-modal/try-again-modal.component';
import { FormsModule } from '@angular/forms';
import { SweetAlertService } from '../../services/sweet-alert-service.service';

@Component({
  selector: 'app-reaction-game',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './reaction-game.component.html',
  styleUrls: ['./reaction-game.component.scss']
})
export class ReactionGameComponent implements OnInit {
  buttons: IButton[] = [];
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  timeLeft: number = 0;
  score: number = 0;
  timerSubscription: Subscription | null = null;
  isGameRunning: boolean = false;
  sequenceCount: number = 0;
  targetSequenceCount: number = 10;
  hasWon: boolean = false;
  gameId: number | undefined;
  startTime: number = 0;
  public reactionGameService = inject(ReactionGameService);
  public modalService = inject(NgbModal) 
  public router = inject(Router)
  public route = inject(ActivatedRoute)
  
  public alertService = inject(SweetAlertService);

  ngOnInit(): void {
    this.setDifficulty('easy');
    this.route.paramMap.subscribe(paramMap => {
      const gameId = paramMap.get('gameId');
      this.gameId = gameId ? +gameId : undefined;
      console.log('Game ID:', this.gameId);
    
    });
  }

  onDifficultyChange(event: Event): void {
    const selectedDifficulty = (event.target as HTMLSelectElement).value;
    this.setDifficulty(selectedDifficulty as 'easy' | 'medium' | 'hard');
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
      default:
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
  
    // Guardar el tiempo de inicio del juego
    this.startTime = new Date().getTime();
  
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
  
    if (!this.hasWon) {
      this.gatherDataAndSave();
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
  }
  

  onButtonClick(button: IButton): void {
    if (!this.isGameRunning) return;
    if (button.color === 'green') {
      this.playSound("Correct");
      this.score += 10;
      button.color = 'default';
      this.checkForSequence();
    } else if (button.color === 'red') {
      this.playSound("Wrong2");
      if (this.score > 0) {
        this.score -= 5;
      }
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
        this.gatherDataAndSave();
        this.showVictoryAlert();
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

  getUserIdFromLocalStorage(): number | undefined {
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.id ? Number(user.id) : undefined;
    }
    return undefined;
  }

  gatherDataAndSave(): void {
    const user_id: number | undefined = this.getUserIdFromLocalStorage();
  
    const endTime = new Date().getTime();
  
    const elapsedTime = Math.floor((endTime - this.startTime) / 1000);
  
    const gameResults: IGameResults = {
      gameDate: new Date().toISOString(),
      levelDifficulty: this.difficulty,
      score: this.score,
      time: elapsedTime,
      gameId: { gameId: this.gameId } as IGame,
      userId: { id: user_id } as IUser,
    };
    console.log("Game Results:", gameResults);
    this.reactionGameService.save(gameResults);
  }  

  showVictoryAlert() {
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
      confirmButtonText: 'Seguir jugando',
      cancelButtonText: 'Volver al Menú de juegos',
    }).then((result) => {
      if (result.isConfirmed) {
        // Increase difficulty if applicable
        switch (this.difficulty) {
          case 'easy':
            this.setDifficulty('medium');
            break;
          case 'medium':
            this.setDifficulty('hard');
            break;
          default:
            break;
        }
        this.startGame();
      } else {
        this.router.navigate(['app/games']);
      }
    });
  }
  playSound(name: string): void {
    const audio = new Audio("../../../assets/sounds/" + name + ".mp3");
    audio.load();
    audio.play();
  }
  showLossAlert() {
    this.alertService.showdifficultyWarning('Ooops...','Seleccione una dificultad antes de comenzar el juego.').then((result) => {
      if (result.isConfirmed) {
        this.resetGame();
      } else {
        this.router.navigate(['app/games']);
      }
    });
  }
  exitGames(){
    this.router.navigate(['/app/games'])
  }
}