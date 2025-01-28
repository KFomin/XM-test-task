import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FavoritesComponent} from './favorites.component';
import {Photo, PhotoService} from '../photo.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';

class MockPhotoService {
  favoritePhotosSubject = new Subject<Photo[]>();

  getFavoritePhotos(): Photo[] {
    return [];
  }
}

class MockRouter {
  navigate(commands: any[]) {
    return Promise.resolve(true);
  }
}

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let photoService: MockPhotoService;
  let router: MockRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoritesComponent],
      providers: [
        {provide: PhotoService, useClass: MockPhotoService},
        {provide: Router, useClass: MockRouter},
      ]
    });

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    photoService = TestBed.inject(PhotoService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize favorite photos', () => {
    const mockPhotos = [
      {id: '1', author: 'Author 1', download_url: 'url1', url: 'url1'},
      {id: '2', author: 'Author 2', download_url: 'url2', url: 'url2'}
    ];

    component.ngOnInit();
    photoService.favoritePhotosSubject.next(mockPhotos);

    expect(component.photos).toEqual(mockPhotos);
  });

  it('should track by photo id', () => {
    const mockPhoto = {id: '1', author: 'Author', download_url: 'url', url: 'url'};
    expect(component.trackByPhotoId(0, mockPhoto)).toBe('1');
  });

  it('should navigate to photo details', () => {
    const photoId = '1';
    const navigateSpy = spyOn(router, 'navigate');

    component.getIntoDetails(photoId);

    expect(navigateSpy).toHaveBeenCalledWith(['/photos', photoId]);
  });
});
