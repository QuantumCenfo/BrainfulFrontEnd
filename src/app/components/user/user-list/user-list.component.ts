import { Component, inject, Input, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { IUser } from "../../../interfaces";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ModalComponent } from "../../modal/modal.component";
import { UserFormComponent } from "../user-from/user-form.component";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { NgOptimizedImage } from "@angular/common";
import Swal from "sweetalert2";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RolService } from "../../../services/rol.service";
import { FilterPipe } from "./filter.pipe";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AuthService } from "../../../services/auth.service"; // Import your auth service
import { SweetAlertService } from "../../../services/sweet-alert-service.service";

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    UserFormComponent,
    MatSnackBarModule,
    NgOptimizedImage,
    FilterPipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
  ],
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit {
  public search: string = "";
  filterText: string = "";
  private userService = inject(UserService);
  private authService = inject(AuthService); // Inject your auth service
  public rolService = inject(RolService);
  public modalService = inject(NgbModal);
  @Input() userList: IUser[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public selectedUser: IUser = {};
  public selectedImg: File | null = null;
  public currentUserId: number | null = null; 
  public alertService = inject(SweetAlertService);

  dataSource = new MatTableDataSource<IUser>([]);

  ngOnInit(): void {
    this.dataSource.data = this.userList;
    console.log("User List: ", this.dataSource);
    this.currentUserId = this.getUserIdFromLocalStorage(); // Use 'this' to call instance method
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFormEventCalled(event: { user: IUser; file: File | null }) {
    this.userService.handleUpdateUser(event.user, event.file!);
    this.modalService.dismissAll();
  }

  pageEvent(event: PageEvent) {
    console.log("Event", event);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  showDetail(user: IUser, modal: any) {
    console.log("Usuario: ", user, "modal: ", modal);
    this.selectedUser = { ...user };
    modal.show();
  }

  getUserIdFromLocalStorage(): number | null {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.id ? Number(user.id) : null; 
    }
    return null; 
  }
  

  deleteUser(userId: number) {
    if (userId !== this.currentUserId) { 
      this.userService.deleteUser(userId);
    } else {
      this.alertService.showError('Lo sentimos','No puedes borrar el usuario actualmente loggeado').then(() => {
        window.location.reload();
      });
    }
  }

  calculateAge(birthDate: any) {
    birthDate = new Date(birthDate);
    var timeDiff = Math.abs(Date.now() - birthDate);
    return Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
  }
}
