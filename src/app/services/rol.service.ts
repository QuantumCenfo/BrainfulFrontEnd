import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IUserRole } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class RolService extends BaseService<IUserRole> {
  protected override source: string = "rol";

  private rolSignal = signal<IUserRole[]>([]);
  get roles$() {
    return this.rolSignal;
  }

  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        console.log("Roles", response);
        this.rolSignal.set(response);
      },
      error: (error: any) => {
        console.error("Error fetching roles", error);
      },
    });
  }
}
