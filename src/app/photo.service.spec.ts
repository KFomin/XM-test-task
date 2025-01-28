import {TestBed} from '@angular/core/testing';
import {PhotoService} from './photo.service';
import {HttpClientModule} from '@angular/common/http';

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PhotoService],
    });
    service = TestBed.inject(PhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
