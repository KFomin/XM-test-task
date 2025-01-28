import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Photo, PhotoService} from "../photo.service";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  photos: Photo[] = [];

  constructor(private photoService: PhotoService,
              private router: Router) {
  }

  ngOnInit() {
    window.scrollTo({top: 0, behavior: 'smooth'}); //scroll to top on page open.
    this.photoService.favoritePhotosSubject.subscribe((photos: Photo[]) => {
      this.photos = photos;
    })
    if (this.photos.length === 0) {
      this.photos = this.photoService.getFavoritePhotos();
    }
  }

  trackByPhotoId(index: number, photo: Photo): string {
    return photo.id;
  }

  getIntoDetails(id: string) {
    this.router.navigate(['/photos', id]);
  }
}
