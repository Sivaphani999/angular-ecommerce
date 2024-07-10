import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { State } from '@popperjs/core';
import { environment } from '../../../environments/environment';
import { PaymentInfo } from '../../common/payment-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  checkOutFormGroup!: FormGroup;
  totalQuantity: number = 0;
  totalPrice: number = 0;
  countries : any = [];
  shippingAddressStates : any = [];
  billingAddressStates : any = [];

  creditCardYears: number[] =[];
  creditCardMonths: number[]= [];

  storage: Storage = sessionStorage;

  isDisabled: boolean = false;

  //intialise Stripe API
  stripe = Stripe(environment.stripePublisableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any;

  constructor(private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService,
    private cartService: CartService,
    private checkOutService:CheckoutService,
    private router: Router
  ){}

  ngOnInit(){

    const email = JSON.parse(this.storage.getItem('userEmail') as string);

    this.checkOutFormGroup = this.formBuilder.group({
      customer : this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        email : new FormControl(email, [Validators.required, 
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Luv2ShopValidators.notOnlyWhitespace])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        street : new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        zipcode: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        street : new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        zipcode: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace])
      }),
      // creditCard: this.formBuilder.group({
      //   cardType: new FormControl('',[Validators.required]),
      //   nameOnCard: new FormControl('',[Validators.required, Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace]),
      //   cardNumber: new FormControl('',[Validators.pattern('[0-9]{16}'),Validators.required]),
      //   securityCode : new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
      //   expirationMonth: new FormControl('',[Validators.required]),
      //   expirationYear: new FormControl('',[Validators.required]),
      // })
    })

    // let startMonth = new Date().getMonth()  + 1;
    // this.luv2ShopFormService.getCreditCartMonth(startMonth).subscribe(data => {
    //   console.log("Retrieved CreditCard Months : "+ JSON.stringify(data));
    //   this.creditCardMonths = data;
    // })

    // this.luv2ShopFormService.getCreditCardYears().subscribe(data => {
    //   console.log("Retrieved Credit Card Years : "+ JSON.stringify(data));
    //   this.creditCardYears = data;
    // })

    this.luv2ShopFormService.getCountries().subscribe(response => {
      console.log("Retrieved Countries :" + JSON.stringify(response));
      this.countries = response.data;
    })
    
    this.setupStripePaymentForm();

    this.reviewDetails();
  }
  setupStripePaymentForm() {
    
    //get a handle to stripe elements
    var elements = this.stripe.elements();

    //Create a card element
    this.cardElement = elements.create('card', {hidePostalCode: true});

    //Add an instance of card UI component into card-element div
    this.cardElement.mount('#card-element')

    //Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) =>{

      //get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');
      if(event.complete){
        this.displayError.textContent = "";
      } else if(event.error){
        this.displayError.textContent = event.error.message;
      }
    })

  }

  reviewDetails(){
    this.cartService.totalPrice.subscribe(totalPrice  => this.totalPrice=totalPrice);
    this.cartService.totalQuantity.subscribe(totalQuantity => this.totalQuantity = totalQuantity);
  }

  onSubmit(){
    if(this.checkOutFormGroup.invalid){
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItem = this.cartService.cartItems;
    let orderItems = cartItem.map(tempCartItem => new OrderItem(tempCartItem))

    let purchase : Purchase = new Purchase();

    purchase.customer = this.checkOutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkOutFormGroup.controls['shippingAddress'].value;
    const shippingState: any = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry : any = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState;
    purchase.shippingAddress.country = shippingCountry;

    purchase.billingAddress = this.checkOutFormGroup.controls['billingAddress'].value;
    const billingState : any = JSON.parse(JSON.stringify(purchase.billingAddress.state))
    const billingCountry : any =  JSON.parse(JSON.stringify(purchase.billingAddress.country))
    purchase.billingAddress.state = billingState;
    purchase.billingAddress.country = billingCountry;

    purchase.order = order;
    purchase.orderItems = orderItems;

    //compute payment info

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail=purchase.customer.email;
    // if valid form then
    // -create payment intent
    // -confirm card payment
    //-place order

    if(!this.checkOutFormGroup.invalid && this.displayError.textContent === ""){

      this.isDisabled= true;

      this.checkOutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,{
            payment_method:{
              card: this.cardElement,
              billing_details:{
                email: purchase.customer.email,
                name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                address:{
                  line1 : purchase.billingAddress.street,
                  city: purchase.billingAddress.city,
                  state: purchase.billingAddress.state,
                  postal_code: purchase.billingAddress.zipCode,
                  country: this.billingAddressCountry?.value.code
                }
              }
            }
          }, {handleActions : false})
          .then((result: any) =>{
            if(result.error){
              //inform customer there was an error
              alert(`There was an error: ${result.error.message}`);
              this.isDisabled=false;
            } else{
              //call REST API via CheckOut Service
              this.checkOutService.placeOrder(purchase).subscribe({
                next: (response: any) => {
                  alert(`Your order has been received. \nOrder tracking number: ${response.data?.orderTrackingNumber}`)

                  this.resetCart();
                  this.isDisabled=false;
                },
                error: (err : any) => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled=false;
                }
              })
            }
          }); 
        }
      )
    }
    else{
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }
   }

   resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.presistCartItems();

    this.checkOutFormGroup.reset();


    this.router.navigateByUrl("/products");
   }
  copyBillingAddressToShippingAddress(event: any){
    if(event.target.checked){
      this.checkOutFormGroup.controls['billingAddress'].setValue(
        this.checkOutFormGroup.controls['shippingAddress'].value
      );
      this.billingAddressStates = this.shippingAddressStates;
    }
    else{
      this.checkOutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears(){
    const creditCardForm = this.checkOutFormGroup.get('creditCard');
    
    let currentMonth = creditCardForm?.get('expirationYear')?.value > new Date().getFullYear() ? 1 : new Date().getMonth() + 1;

    this.luv2ShopFormService.getCreditCartMonth(currentMonth).subscribe(data => {
      this.creditCardMonths = data
    })
  }

  getStateDetails(form?: string){
    const addressForm = (form === 'shippingAddress') ? this.checkOutFormGroup.get('shippingAddress') : this.checkOutFormGroup.get('billingAddress');

    console.log(form);
    let state = addressForm?.get('country')?.value;

    let code = "";
    for(let country of this.countries){
      if(country.name === state){
        code =country.code;
      }
    }
    this.luv2ShopFormService.getStates(code).subscribe(response => {
      (form === 'shippingAddress') ? this.shippingAddressStates = response.data : this.billingAddressStates = response.data;
    })
  }
  
  get firstName(){ return this.checkOutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkOutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkOutFormGroup.get('customer.email'); }

  get shippingAddressStreet(){ return this.checkOutFormGroup.get('shippingAddress.street'); }
  get shippingAddressZipcode(){ return this.checkOutFormGroup.get('shippingAddress.zipcode'); }
  get shippingAddressCity(){ return this.checkOutFormGroup.get('shippingAddress.city'); }
  get shippingAddressCountry(){ return this.checkOutFormGroup.get('shippingAddress.country'); }
  get shippingAddressState(){ return this.checkOutFormGroup.get('shippingAddress.state'); }

  get billingAddressStreet(){ return this.checkOutFormGroup.get('billingAddress.street'); }
  get billingAddressZipcode(){ return this.checkOutFormGroup.get('billingAddress.zipcode'); }
  get billingAddressCity(){ return this.checkOutFormGroup.get('billingAddress.city'); }
  get billingAddressCountry(){ return this.checkOutFormGroup.get('billingAddress.country'); }
  get billingAddressState(){ return this.checkOutFormGroup.get('billingAddress.state'); }

  get creditCardCardType(){ return this.checkOutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard(){ return this.checkOutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardCardNumber(){ return this.checkOutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode(){ return this.checkOutFormGroup.get('creditCard.securityCode'); }
  get creditCardExpirationMonth(){ return this.checkOutFormGroup.get('creditCard.expirationMonth'); }
  get creditCardExpirationYear(){ return this.checkOutFormGroup.get('creditCard.expirationYear'); }
}
