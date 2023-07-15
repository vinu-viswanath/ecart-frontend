import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  //To hold cart count
    getCartItemCount =new BehaviorSubject(0) //initial value is zero

  //To hold search Term
    searchTerm = new BehaviorSubject('')

  //backend path
  BASE_URL ='http://localhost:5000'
  

  constructor(private http:HttpClient) {
    this.cartCount()
   }

  //get all products
  getAllProducts(){
    return this.http.get(`${this.BASE_URL}/products/all-products`)
  }

  //view particular product
  viewProduct(id:any){
    return this.http.get(`${this.BASE_URL}/products/viewproduct/${id}`)
  }

  //add to wishlist product
  addToWishlist(id:any,title:string,price:any,image:string){
    const body={
      id,
      title,
      price,
      image
    }
    return this.http.post(`${this.BASE_URL}/products/addtowishlist`, body)
  }

  //get wishlist products
  getWishlist(){
    return this.http.get(`${this.BASE_URL}/products/getwishlist`)
  }
  //delete wishlist products
  deleteWishlist(id:any){
    return this.http.delete(`${this.BASE_URL}/products/deletewishlist/${id}`)
  }

  //add to cart
  addToCart(product:any){
    const body={
      id:product.id,
      title:product.title,
      price:product.price,
      image:product.image,
      quantity:product.quantity
    }
    return this.http.post(`${this.BASE_URL}/products/addtocart`,body)
  }

  //get carts
  getCart(){
    return this.http.get(`${this.BASE_URL}/products/getcart`)
}


  //cart count
  cartCount(){
    this.getCart().subscribe((result:any)=>{ //cart array
      this.getCartItemCount.next(result.length); //cart count => length of cart array
    })
  }

  //delete cart item
  removeCartItem(id:any){
    return this.http.delete(`${this.BASE_URL}/products/deletecart/${id}`)
  }

  //Increment cart count
  incrementCartCount(id:any){
    return this.http.get(`${this.BASE_URL}/products/increment/${id}`)
  }

    //decrement cart count
    decrementCartCount(id:any){
      return this.http.get(`${this.BASE_URL}/products/decrement/${id}`)
    }

}
