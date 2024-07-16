import { Component } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { DescriptionComponent } from "./description/description.component";
import { MVVComponent } from "./mvv/mvv.component";
import { TeamComponent } from "./team/team.component";
import { ProductsComponent } from "./products/products.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: "app-quantum-landing",
  standalone: true,
  imports: [
    HeaderComponent,
    DescriptionComponent,
    MVVComponent,
    TeamComponent,
    ProductsComponent,
    FooterComponent,
  ],
  templateUrl: "./quantum-landing.component.html",
  styleUrl: "./quantum-landing.component.scss",
})
export class QuantumLandingComponent {}
