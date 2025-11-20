import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ChallengeListComponent } from './challenge-list.component';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

// IMPORTA LOS SERVICIOS REALES (tokens de clase)
import { ParticipationOutdoorService } from '../../services/participation-outdoor.service';
import { SweetAlertService } from '../../services/sweet-alert-service.service';

// ---- Interfaces mínimas locales (solo para tipar datos de prueba)
interface IUser { email?: string; authorities?: Array<{ authority: string }>; }
interface IChallengeOutdoor { outdoorChallengeId?: number; name?: string; description?: string; [k: string]: any; }
interface IPartcipationOutdoor {
  participationOutdoorId?: number;
  evidence?: string;
  status?: string;
  fechaPublicacion?: string;
  fechaRevision?: string;
  challengeOutdoor?: IChallengeOutdoor;
  user?: IUser;
}

// ---- Mocks de servicios
class ParticipationOutdoorServiceMock {
  participationOutdoorSignal = { update: jasmine.createSpy('update') };
  addParticipation = jasmine.createSpy('addParticipation')
    .and.returnValue(of({ participationOutdoorId: 101, saved: true }));
}
class SweetAlertServiceMock {
  showWarning = jasmine.createSpy('showWarning');
}

describe('ChallengeListComponent (standalone)', () => {
  let component: ChallengeListComponent;
  let fixture: any;
  let participationSvc: ParticipationOutdoorServiceMock;
  let alertSvc: SweetAlertServiceMock;

  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeListComponent], // componente standalone
      providers: [
        // ⬇️ Usa tokens de CLASE, no strings
        { provide: ParticipationOutdoorService, useClass: ParticipationOutdoorServiceMock },
        { provide: SweetAlertService, useClass: SweetAlertServiceMock },

        // ⬇️ Por si algún otro servicio interno pidiera HttpClient en el futuro
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
      // Evitar dependencias del template en estas pruebas unitarias
      .overrideComponent(ChallengeListComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(ChallengeListComponent);
    component = fixture.componentInstance;

    // Recupera los mocks ya inyectados
    participationSvc = TestBed.inject(ParticipationOutdoorService) as any;
    alertSvc = TestBed.inject(SweetAlertService) as any;

    // El componente crea Router con `new Router()`. Lo sobrescribimos con un spy.
    (component as any).router = routerSpy;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(Array.isArray(component.colors)).toBeTrue();
  });

  it('showDetail should clone challenge and call modal.show()', () => {
    const challenge: IChallengeOutdoor = { outdoorChallengeId: 1, name: 'C-1', description: 'desc' };
    const modal = { show: jasmine.createSpy('show') };

    component.showDetail(challenge, modal);

    expect(modal.show).toHaveBeenCalled();
    expect(component.currentOutDoorChallenge).toEqual(challenge);
    expect(component.currentOutDoorChallenge).not.toBe(challenge); // copia, no misma referencia
  });

  it('onFormEventCalled should call addParticipation() and update signal when file is provided', () => {
    const participation: IPartcipationOutdoor = {
      participationOutdoorId: 10,
      status: 'PENDING',
      challengeOutdoor: { outdoorChallengeId: 33, name: 'Outdoor X' },
      user: { email: 'u@acme.com' },
    };
    const file = new File(['x'], 'evidence.png', { type: 'image/png' });

    component.onFormEventCalled({ participation, file });

    expect(participationSvc.addParticipation).toHaveBeenCalledWith(participation, file);
    expect(participationSvc.participationOutdoorSignal.update).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('onFormEventCalled should call showWarning when file is missing', () => {
    const participation: IPartcipationOutdoor = {
      participationOutdoorId: 11,
      status: 'PENDING',
      challengeOutdoor: { outdoorChallengeId: 44, name: 'Outdoor Y' },
    };

    component.onFormEventCalled({ participation, file: null });

    expect(alertSvc.showWarning).toHaveBeenCalledWith('Por favor suba una imagen');
    expect(participationSvc.addParticipation).not.toHaveBeenCalled();
  });

  it('onFormEventCalled should handle addParticipation error gracefully', () => {
    participationSvc.addParticipation.and.returnValue(throwError(() => new Error('boom')));
    spyOn(console, 'log');

    const participation: IPartcipationOutdoor = {
      participationOutdoorId: 12,
      status: 'PENDING',
      challengeOutdoor: { outdoorChallengeId: 55, name: 'Outdoor Z' },
    };
    const file = new File(['y'], 'evidence2.png', { type: 'image/png' });

    component.onFormEventCalled({ participation, file });

    expect(participationSvc.addParticipation).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalled(); // "Error: ", err
    expect(participationSvc.participationOutdoorSignal.update).not.toHaveBeenCalled();
  });

  it('goToGames should navigate to ["app/games"]', () => {
    component.goToGames();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['app/games']);
  });
});
