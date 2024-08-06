import { CommonModule } from "@angular/common";
import { Component, inject, ViewChild } from "@angular/core";
import { FormsModule, NgModel } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { IUser } from "../../../interfaces";
import Swal from "sweetalert2";
import { SweetAlertService } from "../../../services/sweet-alert-service.service";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SigUpComponent {
  public signUpError!: String;
  public validSignup!: boolean;
  @ViewChild("name") nameModel!: NgModel;
  @ViewChild("lastname") lastnameModel!: NgModel;
  @ViewChild("email") emailModel!: NgModel;
  @ViewChild("password") passwordModel!: NgModel;
  @ViewChild("image") imageModel!: NgModel;
  @ViewChild("birthDate") birthDateModel!: NgModel;
  public alertService = inject(SweetAlertService);
  public user: IUser = {};
  public imageFile: File | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  public handleSignup(event: Event) {
    event.preventDefault();
    if (!this.nameModel.valid) {
      this.nameModel.control.markAsTouched();
    }
    if (!this.lastnameModel.valid) {
      this.lastnameModel.control.markAsTouched();
    }
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (this.emailModel.valid && this.passwordModel.valid) {
      this.authService.signup(this.user, this.imageFile!).subscribe({
        next: () => {
          this.validSignup = true;
          this.alertService.showSuccess('Registro Exitoso','H¡Usuario registrado con éxito!').then(() => {
          this.router.navigate(["/login"]);
          });
          
        },
        error: (err: any) => {
          this.signUpError = err.description;
          this.alertService.showError('Error de Registro','Hubo un error al registrar el usuario. Inténtalo nuevamente.');
         
        },
      });
    }
  }
  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }
}
