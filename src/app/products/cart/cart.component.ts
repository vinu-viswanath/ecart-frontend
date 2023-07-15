import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  //proceedtopay
  proccedtopay:boolean = false;

  // From Paypal
  public payPalConfig?: IPayPalConfig;

  //Paypal showSuccess
  showSuccess: boolean = false;

  //To hold discount
  discountStatus : boolean = false;

  //To hold offer section
  offerClick : boolean = false;

  //To hold username
  username:any

  //To hold address
  HouseNumber:any

  //To hold pincode
  pincode:any

  // To hold phone number 
  phone:any

  //To hold payment status information
  paymentStatus:boolean = false;

  //To hold total price
  totalPrice: number=0

//To hold the array cart icons
  allCart: any = []
  constructor(private api: ApiService, private fb:FormBuilder) { }

  //Address form
  addressForm = this.fb.group({ //group
    //arrays
    username:['',[Validators.required,Validators.pattern(`[a-zA-Z]*`)]],
    housenumber:['',[Validators.required,Validators.pattern(`[0-9]*`)]],
    street:['',[Validators.required,Validators.pattern(`[a-zA-Z]*`)]],
    state:['',[Validators.required,Validators.pattern(`[a-zA-Z]*`)]],
    pincode:['',[Validators.required,Validators.pattern(`[0-9]*`)]],
    mobileNumber:['',[Validators.required,Validators.pattern(`[0-9]*`)]]
  })


  ngOnInit(): void {
    //Paypal function call
    this.initConfig();


    this.api.getCart().subscribe((result: any) => {
      console.log(result);
      this.allCart = result
      this.getCartTotal()
    },
      (result: any) => {
        console.log(result.error); //error message
      }
    )
  }

  removeCartItem(id: any) {
    this.api.removeCartItem(id).subscribe((result: any) => {
      console.log(result);
      //remaining cart items added to the allCarts
      this.allCart = result 
      this.api.cartCount()
    },
      (result: any) => {
        console.log(result.error);//error message 
      }
    )
  }

  //get cart total
  getCartTotal(){
    let total = 0;
    this.allCart.forEach((item:any)=>{
      total = total + item.grandTotal
      this.totalPrice = Math.ceil(total)
    })
  }

  //Increment cart
  incrementCart(id:any){
    this.api.incrementCartCount(id).subscribe((result:any)=>{ //update cart details
      this.allCart=result
    },
    (result:any)=>{
      alert(result.error)
    })
  }

  //Decrement cart
  decrementCart(id:any){
    this.api.decrementCartCount(id).subscribe((result:any)=>{ //update cart details
      this.allCart=result
    },
    (result:any)=>{
      alert(result.error)
    })
  }

  submitForm(){

    //check the address is valid

    if(this.addressForm.valid){
      this.paymentStatus = true
      this.username = this.addressForm.value.username
      this.HouseNumber = this.addressForm.value.housenumber
      this.pincode = this.addressForm.value.pincode
      this.phone = this.addressForm.value.mobileNumber
    }

    else{
      alert("Please enter Valid details")
    }

  }

  //offer clicked

  offerClicked(){
    this.offerClick=true;

    
  }
  discount(value:any){
    this.totalPrice = Math.ceil(this.totalPrice*(100-value)/100)
    this.offerClick = false
    this.discountStatus = true
  }

  makepay(){
    this.proccedtopay = true;
  }

  modalclose(){
    this.addressForm.reset()
    this.showSuccess = false
    this.paymentStatus = false 
  }

  //Paypal Function

  private initConfig(): void {
    this.payPalConfig = {
    currency: 'EUR',
    clientId: 'sb',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: '9.99',
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: '9.99'
              }
            }
          },
          items: [
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'EUR',
                value: '9.99',
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details:any) => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }


}
