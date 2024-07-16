import { Component } from "@angular/core";
import { GamesCarouselComponent } from "../games-carousel/games-carousel.component";
import { HeaderComponent } from "../header/header.component";
import { DescriptionComponent } from "../description/description.component";
import { FaqComponent } from "../faq/faq.component";
import { ContactComponent } from "../contact/contact.component";
import { FooterComponent } from "../footer/footer.component";
import { MVVComponent } from "../../../quantum-landing/mvv/mvv.component";

@Component({
  selector: "app-barinful-landing",
  standalone: true,
  imports: [
    GamesCarouselComponent,
    HeaderComponent,
    DescriptionComponent,
    FaqComponent,
    ContactComponent,
    FooterComponent,
    MVVComponent,
  ],
  templateUrl: "./barinful-landing.component.html",
  styleUrl: "./barinful-landing.component.scss",
})
export class BarinfulLandingComponent {}
