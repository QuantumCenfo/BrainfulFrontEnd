import { Component, OnInit, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-my-account",
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: "./my-account.component.html",
  styleUrl: "./my-account.component.scss"
})
export class MyAccountComponent implements OnInit {
  public userName: string = '';
  public userRole: string = '';
  private service = inject(AuthService);

  constructor(public router: Router) {
    let user = localStorage.getItem('auth_user');
    
    if(user) {
      this.userName = JSON.parse(user)?.name;
      this.userRole = JSON.parse(user)?.role.name;
    } 
  }

  ngOnInit() {}

  logout() {
    this.service.logout();
    this.router.navigateByUrl('/login');
  }
}
