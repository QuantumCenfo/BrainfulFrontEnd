import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BadgeService } from './badge.service';
import { IBadge } from '../interfaces';
import Swal from 'sweetalert2';

describe('BadgeService', () => {
  let service: BadgeService;
  let httpMock: HttpTestingController;

  const mockBadges: IBadge[] = [
    { badgeId: 1, title: 'Badge 1', description: 'Description 1' },
    { badgeId: 2, title: 'Badge 2', description: 'Description 2' },
  ];


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BadgeService],
    });

    service = TestBed.inject(BadgeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });



  it('should fetch all badges', () => {
    service.getAllBadges();
    
     
    const req = httpMock.expectOne((req) => {
      
      return req.method === 'GET' && req.url === `${service.source}`;
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockBadges);
  
    expect(service.badges$()).toEqual(mockBadges.reverse());
  });

  it('should handle addBadge', () => {
    const mockBadge: IBadge = { badgeId: 3, title: 'Badge  3', description: 'Description 3' };
    const mockImageFile = new File([''], 'image.png', { type: 'image/png' });
  
    spyOn(Swal, 'fire');
  
    service.handleAddBadge(mockBadge, mockImageFile);
    
    const req = httpMock.expectOne(`${service.source}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockBadge);
  
    expect(service.badges$().some(badge => badge.badgeId === mockBadge.badgeId)).toBeTrue();
    expect(Swal.fire).toHaveBeenCalled();
  });
  
  
});
