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
    { name: "Simon dice", description: "Un juego xd", image: "" },
    { name: "Game 2", description: "Description 2", image: "" },
    { name: "Game 3", description: "Description 3", image: "" },
    { name: "Game 4", description: "Description 4", image: "" },
    // ...
  ];
}
