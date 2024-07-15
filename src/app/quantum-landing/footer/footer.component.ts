import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [],
  templateUrl: "./footer.component.html",
  styleUrl: ".././quantum-landing.component.scss",
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.setupScrollTopButton();
  }

  setupScrollTopButton() {
    window.addEventListener("scroll", () => {
      const scrollTopButton = document.getElementById("scroll-top");
      if (scrollTopButton) {
        if (window.scrollY > 300) {
          scrollTopButton.style.display = "block";
        } else {
          scrollTopButton.style.display = "none";
        }
      }
    });

    window.addEventListener("load", () => {
      const scrollTopButton = document.getElementById("scroll-top");
      if (scrollTopButton) {
        scrollTopButton.addEventListener("click", () => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
      }
    });
  }
}
