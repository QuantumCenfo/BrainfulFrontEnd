import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ChatService } from "./services/chat.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  public chatService = inject(ChatService);
  title = "brainful";
}
