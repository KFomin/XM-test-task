import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HomeComponent} from './home.component';
import {Photo, PhotoService} from '../photo.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {MatCardModule} from "@angular/material/card";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatToolbarModule} from "@angular/material/toolbar";

class MockPhotoService {
  // empty array for initialization.
  photosSubject = new Subject<Photo[]>();
  loading = new BehaviorSubject<boolean>(true);
  pageSubject = new BehaviorSubject<number>(1);

  getAllPhotos() {
    return [];
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let photoService: PhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        MatCardModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatButtonModule
      ],
      providers: [{provide: PhotoService, useClass: MockPhotoService}]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    photoService = TestBed.inject(PhotoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize photos and loading states', () => {
    component.ngOnInit();
    expect(component.photos).toEqual([]);
    expect(component.loading).toBe(true);
  });

  it('should track by photo id',
    () => {
      const mockPhoto = {
        id: '1',
        author: 'Author',
        download_url: 'url',
        url: 'url'
      };

      expect(component.trackByPhotoId(0, mockPhoto)).toBe('1');
    });

  it('should handle window scroll', () => {
    // Mocking the scroll values
    Object.defineProperty(window, 'scrollY', {value: 800, writable: true});
    Object.defineProperty(document.documentElement, 'offsetHeight', {value: 900});

    // Spy on next method for loading and pageSubject
    const loadingSpy = spyOn(photoService.loading, 'next').and.callThrough();
    const pageSpy = spyOn(photoService.pageSubject, 'next').and.callThrough();

    // Call the window scroll handler
    component.onWindowScroll();

    // Check loading state is triggered
    expect(loadingSpy).toHaveBeenCalledWith(true);

    // Check that the next page value is called
    expect(pageSpy).toHaveBeenCalledWith(2);
  });
});
