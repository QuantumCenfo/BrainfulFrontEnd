import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IChatResponse } from "../interfaces";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ChatComponent } from "../pages/chat/chat.component";

@Injectable({
  providedIn: "root",
})
export class ChatService extends BaseService<IChatResponse> {
  protected override source: string = "chat";

  private chatSignal = signal<IChatResponse[]>([]);

  get chat$() {
    return this.chatSignal;
  }

  dialog: MatDialog = inject(MatDialog);

  sendMessage(prompt: string): Observable<string> {
    if (!prompt.trim()) {
      return new Observable((observer) => {
        observer.error("Empty prompt");
      });
    }
    return this.http.get<string>(
      `${this.source}?prompt=${encodeURIComponent(prompt)}`,
      { responseType: "text" as "json" }
    );
  }

  openChat() {
    this.dialog.open(ChatComponent);
  }
  closeChat() {
    this.dialog.closeAll();
  }
}
