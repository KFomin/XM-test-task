import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, delay, lastValueFrom, map, Subject} from 'rxjs';
import {SafeUrl} from '@angular/platform-browser';

export interface Photo {
  id: string;
  author: string;
  download_url: string;
  url: SafeUrl;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private allPhotos: Photo[] = [];
  private favoritePhotos: { [id: string]: Photo } = {};
  loading = new BehaviorSubject<boolean>(true);
  pageSubject = new BehaviorSubject<number>(1);
  photosSubject = new Subject<Photo[]>();
  favoritePhotosSubject = new Subject<Photo[]>();

  constructor(private http: HttpClient) {
    this.pageSubject.pipe(delay(this.randomDelayBetween200and300())).subscribe(page => {
      this.fetchPhotos(page);
    })
  }

  randomDelayBetween200and300(): number {
    return Math.floor(Math.random() * (300 - 200 + 1)) + 200;
  }

  getAllPhotos(): Photo[] {
    return this.allPhotos
  }

  fetchPhotos(page: number): void {
    const url = `https://picsum.photos/v2/list?page=${page}&limit=21`;

    this.http.get<Photo[]>(url).subscribe(response => {
      const photos = this.normalizePhotos(response);

      this.loading.next(false);
      this.allPhotos = [...this.allPhotos, ...photos];
      this.photosSubject.next(this.allPhotos);
    });
  }

  normalizePhotos(data: any[]): Photo[] {
    return data.map(photo => {
      // use smaller size to reduce memory usage
      let download_url_parts = photo.download_url.split('/');
      download_url_parts[download_url_parts.length - 2] = '200';
      download_url_parts[download_url_parts.length - 1] = '300';

      return {
        id: photo.id,
        author: photo.author,
        download_url: download_url_parts.join('/'),
        url: photo.url,
      }
    });
  }

  addFavoritePhoto(photo: Photo): void {
    if (!this.favoritePhotos[photo.id]) {
      this.favoritePhotos[photo.id] = photo;
      this.favoritePhotosSubject.next(Object.values(this.favoritePhotos));
    }
  }

  getFavoritePhotos(): Photo[] {
    return Object.values(this.favoritePhotos);
  }

  getPhotoDetails(id: number): Promise<Photo> {
    const imageDetailsUrl = `https://picsum.photos/id/${id}/info`
    return lastValueFrom(
      this.http.get<Photo>(imageDetailsUrl).pipe(
        map(photo =>
          ({
            id: photo.id,
            author: photo.author,
            download_url: photo.download_url,
            url: photo.url,
          })
        )
      )
    )
      ;
  }

  removePhotoFromFavorites(id: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.favoritePhotos[id]) {
        delete this.favoritePhotos[id];
        this.favoritePhotosSubject.next(Object.values(this.favoritePhotos));
      }
      resolve();
    });
  }

}
