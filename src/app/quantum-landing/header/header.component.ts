import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [],
  templateUrl: "./header.component.html",
  styleUrl: ".././quantum-landing.component.scss",
})
export class HeaderComponent {


  public router = inject(Router)
  navigateToBrainful() {
    this.router.navigate(['brainful']);
  }
}
