import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [],
  templateUrl: "./header.component.html",
  styleUrl: "../../Brainful/barinful-landing/barinful-landing.component.scss",
})
export class HeaderComponent {

  public router = inject(Router)
  navigateToLogin() {
    this.router.navigate(['login']);
  }
  navigateToSignUp() {
    this.router.navigate(['signup']);
  }
}
