import { Component, inject, Input, OnInit, ViewChild } from "@angular/core";
import { IContent } from '../../interfaces';
import { ContentService } from './../../services/content.service';
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "../modal/modal.component";
import { AddButtonComponent } from "../add-button/add-button.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentFormComponent } from "../content-form/content-form.component";

@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ModalComponent,
    ContentFormComponent,
    AddButtonComponent
  ],
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit {
  @Input() contentList: IContent[] = [];
  public contentService = inject(ContentService);
  public modalService = inject(NgbModal);
  public selectedContent: IContent = {};
  sanitizer: DomSanitizer = inject(DomSanitizer);
  @ViewChild("formModal") formModal!: ModalComponent;
  currentIndex: number = 0;

  ngOnInit(): void {
    this.getContents();
  }

  getContents(): void {
    this.contentService.getAllContents();
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.contentList.length - 1;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex < this.contentList.length - 1) ? this.currentIndex + 1 : 0;
  }

  getSanitizedUrl(url?: string): SafeResourceUrl | null {
    if (!url) return null;

    const videoId = this.extractVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractVideoId(url: string): string | null {
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  redirectToUrl(url: string): void {
    window.open(url, '_blank');
  }

  showModal() {
    this.formModal.show();
  }

  onFormEventCalled(params: IContent) {
    console.log("Content Data to Save:", params);
    this.contentService.save(params);
    this.modalService.dismissAll();
  }

  deleteCurrentContent() {
    const currentContent = this.contentList[this.currentIndex];
    if (currentContent) {
      const currentContentId = currentContent.mediaId;
      if (currentContentId) {
        this.contentService.deleteContent(currentContentId);
      }
    }
  }
}

