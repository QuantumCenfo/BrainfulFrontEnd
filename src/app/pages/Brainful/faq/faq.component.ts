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
    { question: "¿Qué es esta aplicación?", answer: "Nuestra aplicación es una herramienta diseñada para ofrecer apoyo y recursos a personas que están enfrentando problemas de salud mental.", isOpen: false },
    { question: "¿Cómo funciona la aplicación?", answer: "La aplicación proporciona acceso a herramientas de autoayuda, seguimiento del estado de ánimo, ejercicios de mindfulness", isOpen: false },
    { question: "¿Cómo se protege mi información personal?", answer: "Tomamos la privacidad y seguridad muy en serio. Utilizamos encriptación de extremo a extremo para proteger tu información y nunca compartimos tus datos sin tu consentimiento.", isOpen: false },
    { question: "¿Mis datos se mantendrán confidenciales?", answer: "Sí, todos tus datos son confidenciales y solo tú puedes acceder a ellos.", isOpen: false },
    { question: "¿Qué tipo de ejercicios y herramientas están disponibles en la aplicación?", answer: "La aplicación ofrece una variedad de herramientas, incluyendo ejercicios de mindfulness, técnicas de respiración, seguimiento del estado de ánimo, diarios, y recursos educativos.", isOpen: false },
  ];

  toggleAccordion(item: any) {
    item.isOpen = !item.isOpen;
  }
}
