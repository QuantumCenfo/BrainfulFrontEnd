import { FormService } from './../../services/form.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { IForm, IUser } from '../../interfaces';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  demenciaForm: FormGroup;
  public formService = inject(FormService);
  public router = inject(Router)
  constructor() {
    this.demenciaForm = new FormGroup({
      age: new FormControl('', [Validators.required]),
      exerciseDays: new FormControl('', Validators.required),
      educationLevel: new FormControl('', Validators.required),
      diet: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      record: new FormControl('', Validators.required),
      mentalCondition: new FormControl('', Validators.required),
      medicalCondition: new FormControl('', Validators.required),
      screenTime: new FormControl('', [Validators.required]),
      sleepHours: new FormControl('', [Validators.required]),
      drugs: new FormControl('', Validators.required),
      alcohol: new FormControl('', Validators.required),
      stress: new FormControl('', Validators.required),
      work: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    // Validar campos en blanco
    if (this.demenciaForm.invalid) {
     
      Swal.fire({
        icon: 'error',
        title: 'Campos En blanco',
        iconColor: 'white',
        color: 'white',
        background:'#d54f16',
        position: 'center',
        text: 'Por favor, completa todos los campos.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // Marcar todos los campos como tocados para mostrar errores visuales
      Object.keys(this.demenciaForm.controls).forEach(field => {
        const control = this.demenciaForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    // Validar números negativos
    if (this.hasNegativeNumbers()) {
      Swal.fire({
        icon: 'error',
        title: 'Números negativos',
        iconColor: 'white',
        color: 'white',
        background:'#d54f16',
        position: 'center',
        text: 'Por favor, introduce valores mayores o iguales a cero en los campos numéricos.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
     
      return;
    }else{
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
      screenTime:this.demenciaForm.value.screenTime,
      sleepHours:this.demenciaForm.value.sleepHours,
      mentalIllness:this.demenciaForm.value.mentalCondition,
      medicalCondition:this.demenciaForm.value.medicalCondition,
      familyHistory:this.demenciaForm.value.record,
      job:this.demenciaForm.value.work,
      exerciseDays:this.demenciaForm.value.exerciseDays,
      gender:this.demenciaForm.value.gender,
      useAlcohol: alcoholBool,
      useDrugs: drugsBool,
      user: { id: user_id } as IUser,
    };
    console.log("Form Results:", form);
    this.formService.save(form);
    Swal.fire({
      iconColor: "white",
      color: "white",
      background: "#36cf4f",
      
      title: "Cuestionario guardado",
      text: "Estamos generando tus recomendaciones",
      icon: "success",
      toast:true,
      timer: 5000,
      timerProgressBar: true,
    
    
    }).then((result) => {
        this.router.navigate(["app/recomendations"]);
     
    });
    }

  }

  isFieldInvalid(field: string) {
    const control = this.demenciaForm.get(field);
    return control ? !control.valid && control.touched : false;
  }

  hasNegativeNumbers(): boolean {
    return Object.keys(this.demenciaForm.controls).some(field => {
      const control = this.demenciaForm.get(field);
      return control?.value < 0 && typeof control?.value === 'number';
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