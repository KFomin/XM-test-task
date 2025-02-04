import {ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';
import {Photo, PhotoService} from '../photo.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent implements OnInit {
  photos: Photo[] = [];
  loading = true;

  constructor(private photoService: PhotoService) {
  }

  ngOnInit(): void {
    this.photoService.photosSubject.subscribe((photos: Photo[]) => {
      this.photos = photos;
    })
    this.photoService.loading.subscribe((loading: boolean) => {
      this.loading = loading
    })
    if (this.photos.length === 0) {
      this.photos = this.photoService.getAllPhotos();
    }
  }

  trackByPhotoId(index: number, photo: Photo): string {
    return photo.id;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const windowScroll = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.offsetHeight;

    if (windowScroll >= documentHeight - 100) {
      this.photoService.loading.next(true);
      this.photoService.pageSubject.next(this.photoService.pageSubject.value + 1);
    }
  }

  addToFavoritePhoto(photo: Photo): void {
    this.photoService.addFavoritePhoto(photo);
  }

  isFavorite(photo: Photo) {
    return this.photoService.getFavoritePhotos().map(a => a.id).includes(photo.id)
  }
}
