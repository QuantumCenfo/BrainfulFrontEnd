import { Component, inject } from "@angular/core";
import { ChatService } from "../../services/chat.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-chat",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./chat.component.html",
  styleUrl: "./chat.component.scss",
})
export class ChatComponent {
  userMessage: string = "";
  messages: string[] = [];

  private chatService: ChatService = inject(ChatService);

  sendMessage() {
    if (this.userMessage.trim()) {
      this.messages.push(`You: ${this.userMessage}`);
      this.chatService.sendMessage(this.userMessage).subscribe(
        (res) => {
          this.messages.push(`Bot: ${res}`);
          this.userMessage = "";
        },
        (err) => {
          console.error(err);
          this.messages.push(
            `Bot: Sorry, I'm having trouble understanding you.`
          );
        }
      );
    }
  }
}
