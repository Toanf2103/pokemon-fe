import { Component, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {
  constructor(
    private trailerService: TrailerService,
    private prokemonService: PokemonService,
    private sanitizer: DomSanitizer
  ) {}
  trailers: any[] = [];
  pokemons: any[] = [];
  safeUrls: SafeResourceUrl[] = [];

  ngOnInit(): void {
    this.getTrailers();
    this.getPokemons();
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
        console.log('Pokemons:', this.pokemons);
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
