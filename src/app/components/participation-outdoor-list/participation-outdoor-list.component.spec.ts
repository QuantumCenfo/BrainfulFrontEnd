import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticipationOutdoorListComponent } from './participation-outdoor-list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParticipationOutdoorService } from '../../services/participation-outdoor.service';
import { ModalComponent } from '../modal/modal.component';
import { ValidationModalComponent } from '../validation-modal/validation-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { IPartcipationOutdoor } from '../../interfaces';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ParticipationOutdoorListComponent', () => {
  let component: ParticipationOutdoorListComponent;
  let fixture: ComponentFixture<ParticipationOutdoorListComponent>;
  let mockModalService: jasmine.SpyObj<NgbModal>;
  let mockParticipationService: jasmine.SpyObj<ParticipationOutdoorService>;

  beforeEach(async () => {
    mockModalService = jasmine.createSpyObj('NgbModal', ['open']);
    mockParticipationService = jasmine.createSpyObj('ParticipationOutdoorService', ['getParticipations']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ModalComponent,
        ValidationModalComponent,
        HttpClientTestingModule, 
        ParticipationOutdoorListComponent 
      ],
      providers: [
        { provide: NgbModal, useValue: mockModalService },
        { provide: ParticipationOutdoorService, useValue: mockParticipationService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipationOutdoorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display participation list correctly', () => {
    const mockParticipationList: IPartcipationOutdoor[] = [
      { participationOutdoorId: 1, challengeOutdoor: { name: 'Challenge 1', description: 'Description 1' }, fechaPublicacion: "2024-06-08", status: 'pendiente', user: { name: 'User 1' },evidence:"prueba 1" },
      { participationOutdoorId: 2, challengeOutdoor: { name: 'Challenge 2', description: 'Description 2' }, fechaPublicacion:"2024-02-21", status: 'pendiente', user: { name: 'User 2' },evidence:"prueba 1" }
    ];
    component.participationList = mockParticipationList;
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(mockParticipationList.length);
    expect(rows[0].textContent).toContain('Challenge 1');
    expect(rows[1].textContent).toContain('Challenge 2');
  });

  it('should call showDetail and open the modal', () => {
    const mockParticipation: IPartcipationOutdoor = { participationOutdoorId: 1, challengeOutdoor: { name: 'Challenge 1', description: 'Description 1' }, fechaPublicacion: "2024-06-08", status: 'pendiente', user: { name: 'User 1' },evidence:"prueba 1" };
    const mockModal = { show: jasmine.createSpy('show') };
    spyOn(component.modalService, 'open').and.returnValue(mockModal as any);
    component.showDetail(mockParticipation, mockModal);

    expect(component.currentParticipation).toEqual(mockParticipation);
    expect(mockModal.show).toHaveBeenCalled();
  });


});
