import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { GetResponseProducts, ProductService } from '../product.service';
import { Product } from '../models/product.model';
import { CartService } from '../../cart/cart.service';
import { CartItem } from '../../cart/cart-item.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  private readonly ID = 'id';
  private readonly KEYWORD = 'keyword';

  products: Product[];
  searchMode: boolean;
  categoryName: string;
  searchKeyword: string;
  previousCategoryId: number;

  // For pagination
  pageNumber = 1;
  pageSize = 4;
  totalElements = 0;

  private paramsSubscription: Subscription;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has(this.KEYWORD);
    if (this.searchMode) {
      const keyword = this.route.snapshot.paramMap.get(this.KEYWORD);
      this.searchKeyword = keyword === '' ? 'All' : keyword;
      this.handleSearchProducts(keyword);
    } else {
      this.handleProducts(this.route.snapshot.paramMap);
    }
  }

  onUpdatePageSize(event): void {
    this.pageSize = +event.target.value;
    this.pageNumber = 1;
    this.listProducts();
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(new CartItem(product));
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  private handleSearchProducts(keyword: string): void {
    this.fetchSearchProducts(keyword);
  }

  private fetchSearchProducts(keyword: string): void {
    this.productService.getProductsByKeyword(keyword, this.pageNumber - 1, this.pageSize)
      .subscribe(this.handleResponseProducts.bind(this));
  }

  private handleProducts(params: ParamMap): void {
    if (params.has(this.ID)) {
      const currentCategoryId = +params.get(this.ID);

      // Check if we have a different category than previous
      // Note: Angular will reuse a component if it is currently being viewed
      // If we have a different category id than previous then set thePageNumber back to 1
      if (this.previousCategoryId !== currentCategoryId) {
        this.pageNumber = 1;
      }
      this.previousCategoryId = currentCategoryId;

      this.fetchProductsByCategoryId(currentCategoryId);
      this.fetchCategoryById(currentCategoryId);

    } else {
      this.fetchProducts();
      this.categoryName = 'All';
    }
  }

  private fetchProducts(): void {
    this.productService.getProductList(this.pageNumber - 1, this.pageSize)
      .subscribe(this.handleResponseProducts.bind(this));
  }

  private fetchProductsByCategoryId(categoryId: number): void {
    this.productService.getProductListByCategory(categoryId, this.pageNumber - 1, this.pageSize)
      .subscribe(response => {
        this.handleResponseProducts(response);
      });
  }

  private handleResponseProducts(response: GetResponseProducts) {
    this.products = response._embedded.products;
    this.pageNumber = response.page.number + 1;
    this.pageSize = response.page.size;
    this.totalElements = response.page.totalElements;
  }

  private fetchCategoryById(categoryId: number) {
    this.productService.getProductCategoryById(categoryId).subscribe(productCategory => {
      this.categoryName = productCategory.categoryName;
    });
  }
}
