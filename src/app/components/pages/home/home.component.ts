import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrailerService } from '../../../core/services/trailer.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafePipe } from '../../../safe.pipe';
import { PokemonService } from '../../../core/services/pokemon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [CommonModule, SafePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy  {
  constructor(
    private trailerService: TrailerService,
    private prokemonService: PokemonService,
    private sanitizer: DomSanitizer
  ) {}
  trailers: any[] = [];
  pokemons: any[] = [];
  safeUrls: SafeResourceUrl[] = [];
  currentIndex = 0;
  private autoSlideInterval: any;

  ngOnInit(): void {
    this.getTrailers();
    this.getPokemons();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  prevSlide(): void {
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.trailers.length - 1;
    this.resetAutoSlide();
  }

  nextSlide(): void {
    this.currentIndex = this.currentIndex < this.trailers.length - 1 ? this.currentIndex + 1 : 0;
    this.resetAutoSlide();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetAutoSlide();
  }

  private startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  private resetAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  getTrailers(): void {
    this.trailerService.getTrailers().subscribe(
      (data) => {
        this.trailers = data;
      },
      (error) => {
        console.error('Có lỗi khi gọi API:', error);
      }
    );
  }

  getPokemons(): void {
    this.prokemonService.get(1, 10).subscribe(
      (data: any) => {
        this.pokemons = data.data;
      },
      (error) => {
        console.error('Có lỗi khi gọi API:', error);
      }
    );
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toggleFavorite(pokemon: any): void {
    this.prokemonService.toggleFavorite(pokemon.id).subscribe(
      (data: any) => {
        pokemon.isFavorite = !pokemon.isFavorite;
        if (pokemon.isFavorite) {
          Swal.fire({
            title: 'Liked!',
            text: `${pokemon.name} has been added to your favorites.`,
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Unliked!',
            text: `${pokemon.name} has been removed from your favorites.`,
            icon: 'info',
            confirmButtonText: 'OK',
          });
        }
      },
      (error) => {
        console.error('Có lỗi khi gọi API:', error);
      }
    );
  }
}
