import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PhotoDetailComponent} from './photo-detail.component';
import {Photo, PhotoService} from '../photo.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {of, Subject} from 'rxjs';

class MockPhotoService {
  favoritePhotosSubject = new Subject<Photo[]>();

  getPhotoDetails(id: string): Promise<any> {
    return Promise.resolve({id, download_url: 'url'});
  }

  removePhotoFromFavorites(id: string): Promise<void> {
    return Promise.resolve();
  }
}

class MockRouter {
  navigate(commands: any[]) {
    return Promise.resolve(true);
  }
}

class MockActivatedRoute {
  params = of({id: '1'});
}

describe('PhotoDetailComponent', () => {
  let component: PhotoDetailComponent;
  let fixture: ComponentFixture<PhotoDetailComponent>;
  let photoService: MockPhotoService;
  let router: MockRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoDetailComponent],
      imports: [HttpClientModule],
      providers: [
        {provide: PhotoService, useClass: MockPhotoService},
        {provide: Router, useClass: MockRouter},
        {provide: ActivatedRoute, useClass: MockActivatedRoute}
      ]
    });

    fixture = TestBed.createComponent(PhotoDetailComponent);
    component = fixture.componentInstance;
    photoService = TestBed.inject(PhotoService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize photoUrl and photoId on ngOnInit', async () => {
    await component.ngOnInit();

    expect(component.photoId).toBe('1');
    expect(component.photoUrl).toBe('url');
    expect(component.loading).toBe(false);
  });

  it('should navigate to favorites on removeFromFavorites', async () => {
    spyOn(photoService, 'removePhotoFromFavorites').and.returnValue(Promise.resolve());
    const navigateSpy = spyOn(router, 'navigate');

    component.photoId = '1';
    await component.removeFromFavorites();

    expect(photoService.removePhotoFromFavorites).toHaveBeenCalledWith('1');
    expect(navigateSpy).toHaveBeenCalledWith(['/favorites']);
  });
});
