import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PhotoService} from '../photo.service';
import {SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss']
})
export class PhotoDetailComponent implements OnInit {
  photoUrl: SafeUrl | null = null;
  photoId: string | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private photoService: PhotoService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.photoService.getPhotoDetails(String(id)).then(photo => {
          this.photoId = photo.id;
          this.photoUrl = photo.download_url;
        })
      }
      this.loading = false;
    })
  }

  removeFromFavorites() {
    if (this.photoId) {
      this.photoService.removePhotoFromFavorites(this.photoId).then(() =>
        this.router.navigate(['/favorites'])).catch(error => {
      });
    }
  }
}
