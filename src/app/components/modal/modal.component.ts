import { Component, Input, ViewChild } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-modal",
  standalone: true,
  imports: [],
  template: `
    <ng-template #modal>
      <div class="modal-content rounded-3">
        <div class="modal-header p-3">
          <h5 class="modal-title">{{ title }}</h5>
        </div>
        <div class="modal-body p-4">
          <ng-content></ng-content>
        </div>
        <div class="modal-footer p-3">
          <button type="button" class="btn btn-secondary" (click)="hide()">
            Cerrar
          </button>
        </div>
      </div>
    </ng-template>
  `,
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent {
  
  @Input() size?: string;
  @Input() title?: string;
  @ViewChild("modal") modal: any;
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  public show() {
    this.modalRef = this.modalService.open(this.modal, {
      ariaLabelledBy: "modal-component",
      centered: true,
      size: this.size ?? "md",
    });
  }

  public hide() {
    this.modalRef?.dismiss();
  }
}
