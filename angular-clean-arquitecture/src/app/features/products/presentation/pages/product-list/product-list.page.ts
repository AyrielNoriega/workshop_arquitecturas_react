import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PaginationComponent } from '@shared/ui/pagination/pagination';
import { SpinnerComponent } from '@shared/ui/spinner/spinner';

import { ProductsStore } from '../../store/products.store';

const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-product-list-page',
  imports: [CurrencyPipe, RouterLink, PaginationComponent, SpinnerComponent],
  templateUrl: './product-list.page.html',
})
export class ProductListPage implements OnInit {
  protected readonly store = inject(ProductsStore);

  private readonly searchTerms = new Subject<string>();

  constructor() {
    this.searchTerms
      .pipe(debounceTime(SEARCH_DEBOUNCE_MS), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.store.search(term));
  }

  ngOnInit(): void {
    this.store.load();
    this.store.loadCategories();
  }

  protected onSearchInput(term: string): void {
    this.searchTerms.next(term);
  }

  protected onCategoryChange(slug: string): void {
    this.store.filterByCategory(slug || null);
  }
}
