import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  onSearch(form: NgForm): void {
    this.router.navigate(['/search', form.value.search]);
  }
}
