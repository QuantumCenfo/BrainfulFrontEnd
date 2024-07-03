import { Injectable } from "@angular/core";
import { BaseService } from "./base-service";
import { IGame } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class GameService extends BaseService<IGame> {
  protected override source: string = "games";
}
