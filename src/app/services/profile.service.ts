import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService<IUser> {
  protected override source: string = 'users/me';
  private userSignal = signal<IUser>({});
  private snackBar = inject(MatSnackBar);

  get user$() {
    return  this.userSignal;
  }

  getUserInfoSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        this.userSignal.set(response);
      },
      error: (error: any) => {
        this.snackBar.open(
          `Error getting user profile info ${error.message}`,
           'Close', 
          {
            horizontalPosition: 'right', 
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
        )
      }
    })
  }

  editUser(user: IUser, imageFile: File) {
    const formData = new FormData();
    formData.append('user', JSON.stringify(user));
    formData.append('image', imageFile);
  
    return this.http.post(this.source, formData, {
      headers: new HttpHeaders({}),
    });
  }

  updateUser(user: IUser, imageFile: File) {
    console.log(user);

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

  
 
}
