import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit {
  productId:string=""
  constructor(private viewRoute:ActivatedRoute,private api:ApiService){}

  //To hold particular product details
  product:any=[]

  ngOnInit(): void {
    //To fetch parameter details
    this.viewRoute.params.subscribe((result:any)=>{
      console.log(result);//{productId:"2"}
      
      console.log(result.productId);//2
      this.productId=result.productId;

      //To fetch particular product details
      this.api.viewProduct(this.productId).subscribe((result:any)=>{
        console.log(result);
        this.product=result
        
      },

      (result:any)=>{
        console.log(result.error);//error message
        
      })
      
    })
  }

  //api function to add product to wishlist
  addtowishlist(){

    //destructuring
    const {id,title,price,image}=this.product

    //api function
    this.api.addToWishlist(id,title,price,image).subscribe((result:any)=>{
      this.api.cartCount()
      alert(result);
    },
    (result:any)=>{
      alert(result.error);//error message
    })

  }

  addToCart(product:any){
    console.log(product);

    //add quantity to cart
    Object.assign(product,{quantity:1})
    console.log(product);

    //api call to add quantity
    this.api.addToCart(product).subscribe((result:any)=>{
      //call cart count
      this.api.cartCount()
      alert(result) //added to cart
    },

    (result:any)=>{
      alert(result.error) //error message
    })
  }
}
