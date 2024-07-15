import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-faq",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./faq.component.html",
  styleUrls: [
    "../../Brainful/barinful-landing/barinful-landing.component.scss",
  ],
})
export class FaqComponent {
  faqItems = [
    { question: "Tengo que estar enfermo?", answer: "No", isOpen: false },
    { question: "No abrir", answer: "Gay si ve esto", isOpen: false },
  ];

  toggleAccordion(item: any) {
    item.isOpen = !item.isOpen;
  }
}
