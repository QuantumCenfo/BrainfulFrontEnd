import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-instructions",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./instructions.component.html",
  styleUrl: "./instructions.component.scss",
})
export class InstructionsComponent {
  @Input() game: string = "";

  instructions: { [key: string]: string } = {
    "Simon Dice":
      "El juego de secuencia es un juego en el que tienes que recordar la secuencia de colores que aparecen en la pantalla. Tienes que hacer clic en los colores en el mismo orden en que aparecieron. Si haces clic en el color incorrecto, perderás el juego. ¡Buena suerte!",
    Parejas:
      "El juego de memoria es un juego donde deberás hacer parejas con las cartas mostradas en pantalla. Deberás hacer clic en una tarjeta y luego hacer clic en otra carta para tratar de encontrar su respectiva pareja. Si haces una pareja, las cartas se quedaran volteadas. Si no haces una pareja, las cartas se voltearan de nuevo. ¡Buena suerte!",
    Reacción:
      "El juego de reacción es un juego en el que tienes que hacer clic en la pantalla lo más rápido posible. Tienes que hacer clic en la tarjeta que se ilumine en verde. Deberás hacer una cierta cantidad de aciertos para avanzar al siguiente nivel. ¡Buena suerte!",
    Rompecabezas:
      "El juego de rompecabezas es un juego en el que tienes que armar una imagen a partir de piezas desordenadas. Deberás hacer clic en una pieza y luego hacer clic en espacio donde crees que mejor calce la pieza seleccionada. ¡Buena suerte!",
  };

  get gameInstructions(): string {
    return this.instructions[this.game] || "Instrucciones no disponibles.";
  }
}
