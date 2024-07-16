import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [],
  templateUrl: "./footer.component.html",
  styleUrl: "../../Brainful/barinful-landing/barinful-landing.component.scss",
})
export class FooterComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollTopButton();
    }
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
