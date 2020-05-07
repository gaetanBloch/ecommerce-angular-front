import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../models/product-category.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {
  productCategories: ProductCategory[];

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.productService.getProductCategories().subscribe(categories => {
      this.productCategories = categories;
    });
  }
}
