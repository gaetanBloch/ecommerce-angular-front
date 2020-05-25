import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;

  totalPrice = 0;
  totalQuantity = 0;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.checkoutForm = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        cardHolder: [''],
        cardNumber: [''],
        expirationMonth: [''],
        expirationYear: [''],
        securityCode: ['']
      })
    });
  }

  copyShippingToBilling = (event): void => {
    if (event.target.checked) {
      this.checkoutForm.controls.billingAddress.setValue(
        this.checkoutForm.controls.shippingAddress.value
      );
    } else {
      this.checkoutForm.controls.billingAddress.reset();
    }
  }

  onSubmit = (): void => {
    console.log(this.checkoutForm.get('customer').value);
  }

}
