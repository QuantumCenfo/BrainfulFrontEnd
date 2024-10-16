import { FormService } from "./../../services/form.service";
import { Component, inject, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import Swal from "sweetalert2";
import { IForm, IUser } from "../../interfaces";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { SweetAlertService } from "../../services/sweet-alert-service.service";

@Component({
  selector: "app-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
})
export class FormComponent implements OnInit {
  demenciaForm: FormGroup;
  public formService = inject(FormService);
  public router = inject(Router);
  public alertService = inject(SweetAlertService);
  constructor() {
    this.demenciaForm = new FormGroup({
      age: new FormControl("", [Validators.required]),
      exerciseDays: new FormControl("", Validators.required),
      educationLevel: new FormControl("", Validators.required),
      diet: new FormControl("", Validators.required),
      gender: new FormControl("", Validators.required),
      record: new FormControl("", Validators.required),
      mentalCondition: new FormControl("", Validators.required),
      medicalCondition: new FormControl("", Validators.required),
      screenTime: new FormControl("", [Validators.required]),
      sleepHours: new FormControl("", [Validators.required]),
      drugs: new FormControl("", Validators.required),
      alcohol: new FormControl("", Validators.required),
      stress: new FormControl("", Validators.required),
      work: new FormControl("", Validators.required),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.demenciaForm.invalid) {
      this.alertService.showError(
        "Campos En blanco",
        "Por favor, completa todos los campos."
      );
      Object.keys(this.demenciaForm.controls).forEach((field) => {
        const control = this.demenciaForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    if (this.hasNegativeNumbers()) {
      this.alertService.showError(
        "Números negativos",
        "Por favor, introduce valores mayores o iguales a cero en los campos numéricos."
      );

      return;
    } else {
      const user_id: number | undefined = this.getUserIdFromLocalStorage();
      let alcoholBool;
      let drugsBool;
      if (this.demenciaForm.value.alcohol == "Si") {
        alcoholBool = true;
      } else if (this.demenciaForm.value.alcohol == "No") {
        alcoholBool = false;
      }
      if (this.demenciaForm.value.drugs == "Si") {
        drugsBool = true;
      } else if (this.demenciaForm.value.drugs == "No") {
        drugsBool = false;
      }
      const form: IForm = {
        date: new Date().toISOString(),
        age: this.demenciaForm.value.age,
        dietType: this.demenciaForm.value.diet,
        eduacationLevel: this.demenciaForm.value.educationLevel,
        stressManagement: this.demenciaForm.value.stress,
        screenTime: this.demenciaForm.value.screenTime,
        sleepHours: this.demenciaForm.value.sleepHours,
        mentalIllness: this.demenciaForm.value.mentalCondition,
        medicalCondition: this.demenciaForm.value.medicalCondition,
        familyHistory: this.demenciaForm.value.record,
        job: this.demenciaForm.value.work,
        exerciseDays: this.demenciaForm.value.exerciseDays,
        gender: this.demenciaForm.value.gender,
        useAlcohol: alcoholBool,
        useDrugs: drugsBool,
        user: { id: user_id } as IUser,
      };
      this.formService.save(form);
    }
  }

  isFieldInvalid(field: string) {
    const control = this.demenciaForm.get(field);
    return control ? !control.valid && control.touched : false;
  }

  hasNegativeNumbers(): boolean {
    return Object.keys(this.demenciaForm.controls).some((field) => {
      const control = this.demenciaForm.get(field);
      return control?.value < 0 && typeof control?.value === "number";
    });
  }
  getUserIdFromLocalStorage(): number | undefined {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.id ? Number(user.id) : undefined;
    }
    return undefined;
  }
}
