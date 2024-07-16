import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-games-carousel",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./games-carousel.component.html",
  styleUrls: [
    "../../Brainful/barinful-landing/barinful-landing.component.scss",
  ],
})
export class GamesCarouselComponent {
  games = [
    // Add your game objects here
    { name: "Rompecabezas Deslizantes (Sliding Puzzles)", description: "Los rompecabezas deslizantes son juegos en los que el jugador debe mover piezas en un tablero para formar una imagen o alcanzar una configuración específica.", image: "" },
    { name: "Parejas (Memory Game)", description: "El juego de parejas, también conocido como (Memory) o (Concentration), es un juego de cartas en el que las cartas se colocan boca abajo sobre una superficie. Los jugadores voltean dos cartas en cada turno, tratando de encontrar pares de cartas que coincidan.", image: "" },
    { name: "Secuencia de Colores (Color Sequence)", description: "El juego de secuencia de colores es un juego de memoria y patrones en el que los jugadores deben recordar y repetir una secuencia de colores que se presenta.", image: "" },
    { name: "Juegos de Reacción con Botón Verde", description: "En este tipo de juego, se prueba la rapidez de reacción del usuario. El juego presenta una pantalla donde, en intervalos aleatorios, un botón o área cambia de color, generalmente a verde. El objetivo del usuario es presionar el botón verde lo más rápido posible una vez que aparece.", image: "" },
    // ...
  ];
}
