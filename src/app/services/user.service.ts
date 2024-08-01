import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IRole, IUser } from "../interfaces";
import { Observable, catchError, tap, throwError } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class UserService extends BaseService<IUser> {
  protected override source: string = "users";
  private userListSignal = signal<IUser[]>([]);

  get users$() {
    return this.userListSignal;
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
        Swal.fire({
          title: "¡Éxito!",
          text: "El usuario ha sido agregado",
          icon: "success",
          iconColor: "white",
          color: "white",
          showConfirmButton: false,
          background: "#16c2d5",
          timer: 2000,
        }).then(() => {
          window.location.reload();
        });
      },
      error: (err: any) => {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al agregar el usuario",
          icon: "error",
          iconColor: "white",
          color: "white",
          background: "#16c2d5",
        });
        console.log("Error: ", err);
      },
    });
  }

  // updateUser(user: IUser, imageFile: File) {
  //   const userCopy: { [key: string]: any } = { ...user };

  //   delete userCopy["enabled"];
  //   delete userCopy["username"];
  //   delete userCopy["authorities"];
  //   delete userCopy["accountNonExpired"];
  //   delete userCopy["accountNonLocked"];
  //   delete userCopy["credentialsNonExpired"];

  //   const formData = new FormData();
  //   formData.append("user", JSON.stringify(userCopy));
  //   if (imageFile) {
  //     formData.append("image", imageFile);
  //   }

  //   return this.http.put(`${this.source}/${user.id}`, formData);
  // }

  updateUser(user: IUser, imageFile: File): Observable<IUser> {
    const formData = new FormData();
    formData.append("user", JSON.stringify(user));
    formData.append("image", imageFile);

    return this.http.put(this.source + "/" + user.id, formData);
  }

  handleUpdateUser(user: IUser, imageFile: File) {
    Swal.fire({
      title: "Esta seguro que desea actualizar el usuario?",
      icon: "question",

      iconColor: "white",
      color: "white",
      background: "#d54f16",
      position: "center",
      confirmButtonColor: "#ff9f1c",
      cancelButtonColor: "#16c2d5",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Si, actualizar",
    }).then((result) => {
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
            Swal.fire({
              title: "Error",
              text: "Hubo un problema al actualizar el usuario",
              icon: "error",
              iconColor: "white",
              color: "white",
              background: "#16c2d5",
            });
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
      if (res.isConfirmed) {
        this.del(userId).subscribe({
          next: () => {
            const deletedUser = this.userListSignal().filter(
              (u: IUser) => u.id !== userId
            );
            this.userListSignal.set(deletedUser);
            Swal.fire({
              title: "¡Éxito!",
              text: "El usuario ha sido eliminado",
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
            console.log("error");

            return throwError(() => new Error("Error al borrar el usuario"));
          },
        });
      }
    });
  }
}
