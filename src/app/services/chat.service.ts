import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IChatResponse } from "../interfaces";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatService extends BaseService<IChatResponse> {
  protected override source: string = "chat";

  private chatSignal = signal<IChatResponse[]>([]);

  get chat$() {
    return this.chatSignal;
  }

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
}
