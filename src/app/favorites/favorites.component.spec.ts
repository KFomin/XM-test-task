import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FavoritesComponent} from './favorites.component';
import {HttpClientModule} from "@angular/common/http";
import {PhotoService} from "../photo.service";

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoritesComponent],
      imports: [HttpClientModule],
      providers: [PhotoService],
    });
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
