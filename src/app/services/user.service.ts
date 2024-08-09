import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IUser } from "../interfaces";
import { Observable, catchError, tap, throwError } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import Swal from "sweetalert2";
import { SweetAlertService } from "./sweet-alert-service.service";

@Injectable({
  providedIn: "root",
})
export class UserService extends BaseService<IUser> {
  protected override source: string = "users";
  private userListSignal = signal<IUser[]>([]);
  private userSignal = signal<IUser>({});
  get users$() {
    return this.userListSignal;
  }
  get user$() {
    return this.userSignal;
  }
  constructor(private sweetAlertService: SweetAlertService) {
    super();
  }
  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        console.log(response);
        this.userListSignal.set(response);
      },
      error: (error: any) => {
        console.error("Error fetching users", error);
      },
    });
  }
  getUserInfoSignal() {
    const source = `${this.source}/me`;
    this.http.get(source).subscribe({
      next: (response: any) => {
        this.userSignal.set(response);
      },
      error: (error: any) => {
        console.error("Error fetching user info", error);
      },
    });
  }
  saveUserSignal(user: IUser): Observable<any> {
    return this.add(user).pipe(
      tap((response: any) => {
        this.userListSignal.update((users) => [response, ...users]);
      }),
      catchError((error) => {
        console.error("Error saving user", error);
        return throwError(error);
      })
    );
  }

  addUser(user: IUser, imageFile: File) {
    const formData = new FormData();
    formData.append("user", JSON.stringify(user));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    return this.http.post(this.source, formData, {
      headers: new HttpHeaders({}),
    });
  }

  addHandleUser(user: IUser, imageFile: File) {
    this.addUser(user, imageFile).subscribe({
      next: (res: any) => {
        this.userListSignal.update((users: any) => [res, ...users]);
        console.log("Response: ", res);
        this.sweetAlertService
          .showSuccess("El usuario ha sido creado")
          .then(() => {
            window.location.reload();
          });
      },
      error: (err: any) => {
        this.sweetAlertService.showError(
          "Hubo un problema al agregar el usuario"
        );
        console.log("Error: ", err);
      },
    });
  }

  getUser(userId: number) {
    this.findAll().subscribe({
      next: (res: any) => {
        res.reverse();
        this.userListSignal.set(res);
      },
      error: (err: any) => {
        console.error("Error fetching user by ID", err);
      },
    });
  }
  updateUser(user: IUser, imageFile: File): Observable<IUser> {
    const formData = new FormData();
    formData.append("user", JSON.stringify(user));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    return this.http.put(this.source + "/" + user.id, formData);
  }

  handleUpdateUser(user: IUser, imageFile: File) {
    this.sweetAlertService.showQuestion(
      "¿Está seguro que desea actualizar el usuario?"
    );
    this.sweetAlertService
      .showQuestion(
        "Esta seguro que desea actualizar el usuario?",
        "Esta acción no se puede deshacer."
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.updateUser(user, imageFile).subscribe({
            next: (res: any) => {
              const updatedUsers = this.userListSignal().map((u) =>
                u.id === user.id ? res : u
              );
              this.userListSignal.set(updatedUsers);
              console.log("Response: ", res);
              console.log("User updated successfully");
              Swal.fire({
                title: "¡Éxito!",
                text: "El usuario ha sido actualizado",
                icon: "success",
                iconColor: "white",
                color: "white",
                background: "#16c2d5",
                timer: 2000,
                showConfirmButton: false,
              }).then(() => {
                window.location.reload();
              });
            },
            error: (err: any) => {
              console.log("Error: ", err);
              this.sweetAlertService.showError(
                "Hubo un problema al actualizar el usuario"
              );
            },
          });
        }
      });
  }

  updateUserSignal(user: IUser): Observable<any> {
    return this.edit(user.id, user).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().map((u) =>
          u.id === user.id ? response : u
        );
        this.userListSignal.set(updatedUsers);
      }),
      catchError((error) => {
        console.error("Error saving user", error);
        return throwError(error);
      })
    );
  }

  deleteUserSignal(userId: number): Observable<any> {
    return this.del(userId).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().filter(
          (u) => u.id !== userId
        );
        this.userListSignal.set(updatedUsers);
      }),
      catchError((error) => {
        console.error("Error saving user", error);
        return throwError(error);
      })
    );
  }

  deleteUser(userId: number) {
    this.sweetAlertService
      .showQuestion(
        "¿Está seguro que desea eliminar el usuario?",
        "No podrá recuperar la información"
      )
      .then((res) => {
        if (res.isConfirmed) {
          this.del(userId).subscribe({
            next: () => {
              const deletedUser = this.userListSignal().filter(
                (u: IUser) => u.id !== userId
              );
              this.userListSignal.set(deletedUser);
              this.sweetAlertService.showSuccess(
                "El usuario ha sido eliminado"
              );
              window.location.reload();
            },
            error: (err: any) => {
              console.log("error");
              this.sweetAlertService.showError("Error al borrar el usuario");
            },
          });
        }
      });
  }
}
