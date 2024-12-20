import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../../core/services/pokemon.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  pokemons: any[] = [];
  currentPage: number = 1;
  totalPages: number[] = [];;
  totalItems: number = 0;
  limit: number = 10;
  importFile: File | null = null;

  filters = {
    type: '',
    legendary: '',
    minSpeed: '',
    maxSpeed: '',
    search: '',
  };
  timeDebounce = 300;
  private debounceTimer: any;

  private searchSubject = new Subject<string>();

  constructor(private pokemonService: PokemonService) {
    // Setup search debounce
    this.searchSubject
      .pipe(
        debounceTime(500), // Đợi 500ms sau lần nhập cuối
        distinctUntilChanged() // Chỉ gọi API khi giá trị thay đổi
      )
      .subscribe((searchTerm) => {
        this.filters.search = searchTerm;
        this.currentPage = 1; // Reset về trang 1 khi search
        this.getPokemons();
      });
  }

  ngOnInit() {
    this.getPokemons();
  }

  getPokemons(): void {
    this.pokemonService
      .getPokemons(this.currentPage, this.limit, this.filters)
      .subscribe({
        next: (response) => {
          this.pokemons = response.data;
          this.totalItems = response.total;
          this.totalPages = Array(Math.ceil(this.totalItems / this.limit))
            .fill(0)
            .map((_, i) => i + 1);
        },
        error: (error) => {
          console.error('Error fetching pokemons:', error);
          // Thêm xử lý lỗi ở đây (hiển thị thông báo, etc.)
        },
      });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.debounceGetPokemons();
  }

  onSearch(): void {
    this.debounceGetPokemons();
  }

  debounceGetPokemons(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.getPokemons();
    }, this.timeDebounce);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.debounceGetPokemons();
  }

  import(event: any){
    const file = event.target.files[0];
    if (file) {
      this.pokemonService.uploadFile(file).subscribe(
        (response) => {
          Swal.fire({
            title: 'Import successfully!',
            text: 'Import successfully!',
            icon: 'success', 
            confirmButtonText: 'OK'
          });
          this.getPokemons();
          console.log('File uploaded successfully:', response);
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    }
  }

  get startPage(): number {
    return Math.max(this.currentPage - 5, 0);
  }
  
  get endPage(): number {
    return Math.min(this.currentPage + 5, this.totalPages.length - 1);
  }
}
