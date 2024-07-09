import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IGame } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class GameService extends BaseService<IGame> {
  protected override source: string = "games";
  private userListSignal = signal<IGame[]>([]);
  get users$() {
    return this.userListSignal;
  }
  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.userListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching games', error);
      }
    });
  }
}
