import { TestBed } from '@angular/core/testing';
import { BadgeFormComponent } from './badge-form.component';
import { IBadge } from '../../interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Mock sencillo para NgbModal
class NgbModalMock {
  dismissAll = jasmine.createSpy('dismissAll');
}

describe('BadgeFormComponent (standalone)', () => {
  let fixture: any;
  let component: BadgeFormComponent;
  let modal: NgbModalMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeFormComponent], // componente standalone
      providers: [{ provide: NgbModal, useClass: NgbModalMock }],
    })
      // No necesitamos el template real para estas pruebas
      .overrideComponent(BadgeFormComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(BadgeFormComponent);
    component = fixture.componentInstance;
    modal = TestBed.inject(NgbModal) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // valores por defecto del input badge
    expect(component.badge).toEqual({ title: '', description: '', url: '' });
    expect(component.actualFile).toBeNull();
    expect(component.btn).toBe('');
  });

  it('onFileChange should set file from input event', () => {
    const fake = new File(['abc'], 'logo.png', { type: 'image/png' });
    const event = { target: { files: [fake] } } as any;

    component.onFileChange(event);

    expect(component.file).toBe(fake);
  });

  it('addEditBadge should emit {badge, file} and dismiss modal', () => {
    // prepara inputs
    const customBadge: IBadge = { title: 'A', description: 'B', url: 'C' };
    component.badge = customBadge;
    const fake = new File(['abc'], 'logo.png', { type: 'image/png' });
    component.file = fake;

    const emitSpy = spyOn(component.callParentEvent, 'emit');

    component.addEditBadge();

    expect(emitSpy).toHaveBeenCalledWith({ badge: customBadge, file: fake });
    expect(modal.dismissAll).toHaveBeenCalled();
  });

  it('should accept external inputs (badge, actualFile, btn) without errors', () => {
    const extFile = new File(['x'], 'ext.png', { type: 'image/png' });
    component.badge = { title: 'T', description: 'D', url: 'U' };
    component.actualFile = extFile;
    component.btn = 'Guardar';

    fixture.detectChanges();

    expect(component.badge.title).toBe('T');
    expect(component.actualFile).toBe(extFile);
    expect(component.btn).toBe('Guardar');
  });
});
