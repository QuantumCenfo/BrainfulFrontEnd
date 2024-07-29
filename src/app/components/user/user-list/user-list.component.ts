import { Component, effect, inject } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { IUser } from "../../../interfaces";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ModalComponent } from "../../modal/modal.component";
import { UserFormComponent } from "../user-from/user-form.component";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import Swal from "sweetalert2";
import { throwError } from "rxjs";

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    UserFormComponent,
    MatSnackBarModule,
  ],
  templateUrl: "./user-list.component.html",
  styleUrl: "./user-list.component.scss",
})
export class UserListComponent {
  public search: String = "";
  public userList: IUser[] = [];
  private service = inject(UserService);
  private snackBar = inject(MatSnackBar);
  public currentUser: IUser = {

    authorities: [],
    birthDate: "",
    createdAt: "",
    email: "",
    id: 0,
    image: "",
    lastname: "",
    name: "",
    password: "",
    role: {name: ''},
    updatedAt: "",
  };
  
  public selectedImg: File|null=null


  public userService = inject(UserService)

  onFormEventCalled(event: { user: IUser; file: File | null }) {
    this.userService.handleUpdateUser(event.user, event.file!);
  }


  constructor() {
    this.service.getAllSignal();
    effect(() => {
      this.userList = this.service.users$();
    });
  }

  showDetail(user: IUser, modal: any) {

    this.currentUser = {...user}; 
    console.log(user)
    this.currentUser = { ...user };
    modal.show();
  }

  deleteUser(user: IUser) {
    Swal.fire({
      title: "Seguro que desea eliminar el usuario?",
      text: "No podrá recuperar la información",
      icon: "warning",
      iconColor: "white",
      color: "white",
      background: "#d54f16",
      position: "center",
      confirmButtonColor: "#ff9f1c",
      cancelButtonColor: "#16c2d5",
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if(res.isConfirmed){
        this.service.deleteUserSignal(user).subscribe({
          next: () => {
            Swal.fire({
              title: "¡Éxito!",
              text: "El usuario ha sido eliminado",
              icon: "success",
              iconColor: "white",
              color: "white",
              background: "#16c2d5",
              timer: 2000,
              showConfirmButton: false,
            });
          },
          error: (err: any) => {
            console.log("error")  
              Swal.fire({
                icon: 'warning',
                title: 'Lo sentimos',
                iconColor: 'white',
                color: 'white',
                background:'#d54f16',
                position: 'center',
                text: 'No puedes borrar un usuario con insignias asginadas',
                showConfirmButton: false,
                timer: 10000,
                timerProgressBar: true,
              });
              return throwError(() => new Error('Error al agregar el usuario'));
          },
        });
      }
    });
    
  }

   
  };


