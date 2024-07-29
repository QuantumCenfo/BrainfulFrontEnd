import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<IUser> {
  protected override source: string = 'users';
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
        console.error('Error fetching users', error);
      }
    });
  }

  saveUserSignal(user: IUser): Observable<any> {
    return this.add(user).pipe(
      tap((response: any) => {
        this.userListSignal.update(users => [response, ...users]);
      }),
      catchError(error => {
        console.error('Error saving user', error);
        return throwError(error);
      })
    );
  }

  addUser(user: IUser, imageFile: File) {
    const formData = new FormData();
    formData.append('user', JSON.stringify(user));
    formData.append('image', imageFile);
  
    return this.http.post(this.source, formData, {
      headers: new HttpHeaders({}),
    });
  }


  addHandleUser(user: IUser, imageFile: File) {
    if (imageFile) {
      this.addUser(user, imageFile).subscribe({
        next: (res: any) => {
          this.userListSignal.update(users => [res, ...users]);
          console.log('Response: ', res);
          console.log('Image added successfully');
          Swal.fire({
            title: '¡Éxito!',
            text: 'El usuario fue registrado',
            icon: 'success',
            iconColor: 'white',
            color: 'white',
            background: '#16c2d5',
            confirmButtonColor: '#ff9f1c',
          });
        },
        error: (err: any) => {
          console.log('Error: ', err);
        },
      });
    } else {
      Swal.fire({
        title: 'Oops...',
        text: 'Por favor suba una imagen',
        icon: 'warning',
        iconColor: 'white',
        color: 'white',
        background: '#16c2d5',
        confirmButtonColor: '#ff9f1c',
      });
    }
  }

  updateUser(user: IUser, imageFile: File) {
    const userCopy: { [key: string]: any } = { ...user };
    
    delete userCopy['enabled'];
    delete userCopy['username'];
    delete userCopy['authorities'];
    delete userCopy['accountNonExpired'];
    delete userCopy['accountNonLocked'];
    delete userCopy['credentialsNonExpired'];
  
    const formData = new FormData();
    formData.append('user', JSON.stringify(userCopy));
    if (imageFile) {
      formData.append('image', imageFile);
    }
  
    return this.http.put(`${this.source}/${user.id}`, formData);
  }

  handleUpdateUser(user: IUser, imageFile: File) {
    Swal.fire({
      title: '¿Está seguro que desea actualizar el usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
    }).then(result => {
      if (result.isConfirmed) {
        this.updateUser(user, imageFile).subscribe({
          next: (res: any) => {
            const updatedUsers = this.userListSignal().map(u => u.id === user.id ? res : u);
            this.userListSignal.set(updatedUsers);
            console.log('Response: ', res);
            console.log('User updated successfully');
            Swal.fire({
              title: '¡Éxito!',
              text: 'El usuario ha sido actualizado',
              icon: 'success',
              iconColor: 'white',
              color: 'white',
              background: '#16c2d5',
              timer: 2000,
            });
          },
          error: (err: any) => {
            console.log('Error: ', err);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al actualizar el usuario',
              icon: 'error',
              iconColor: 'white',
              color: 'white',
              background: '#16c2d5',
            });
          },
        });
      }
    });
  }

  updateUserSignal(user: IUser): Observable<any> {
    return this.edit(user.id, user).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().map(u => u.id === user.id ? response : u);
        this.userListSignal.set(updatedUsers);
      }),
      catchError(error => {
        console.error('Error saving user', error);
        return throwError(error);
      })
    );
  }

  deleteUserSignal(user: IUser): Observable<any> {
    return this.del(user.id).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().filter(u => u.id !== user.id);
        this.userListSignal.set(updatedUsers);
      }),
      catchError(error => {
        console.error('Error saving user', error);
        return throwError(error);
      })
    );
  }
}
