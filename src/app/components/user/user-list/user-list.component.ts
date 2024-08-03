import {
  Component,
  effect,
  inject,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { UserService } from "../../../services/user.service";
import { IUser } from "../../../interfaces";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ModalComponent } from "../../modal/modal.component";
import { UserFormComponent } from "../user-from/user-form.component";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { NgOptimizedImage } from "@angular/common";
import Swal from "sweetalert2";
import { last, throwError } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RolService } from "../../../services/rol.service";
import { FilterPipe } from "./filter.pipe";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from "@angular/material/paginator";
import { MatSort, MatSortModule, Sort } from "@angular/material/sort";
import { MatFormFieldModule } from "@angular/material/form-field";

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
  styleUrl: "./user-list.component.scss",
})
export class UserListComponent implements OnInit {
  public search: String = "";
  filterText: string = "";
  private userService = inject(UserService);
  public rolService = inject(RolService);
  public modalService = inject(NgbModal);
  @Input() userList: IUser[] = [];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public selectedUser: IUser = {};

  public selectedImg: File | null = null;

  dataSource = new MatTableDataSource<IUser>([]);

  ngOnInit(): void {
    this.dataSource.data = this.userList;
    console.log("User List: ", this.dataSource);
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

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

  deleteUser(user: number) {
    this.userService.deleteUser(user);
  }

  calculateAge(birthDate: any) {
    birthDate = new Date(birthDate);

    var timeDiff = Math.abs(Date.now() - birthDate);

    return Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
  }
}
