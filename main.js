Vue.component('product-review', {
    template: `<div>

    <div>
    <h3>Rating</h3>
    </div>
    <form @submit.prevent="onSubmit">
    <div  v-if="errors.length">
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Warning!</strong> <ul>
  <li v-for="error in errors">{{error}}
  </li>
  </ul>

</div></div>
  <div class="form-group">
    <label for="reviewerName">Name</label>
    <input v-model="reviewerName"  class="form-control" id="reviewerName" placeholder="Your Name">
  </div>
  <div class="form-group">
    <label for="exampleFormControlSelect1">Rate this Product</label>
    <select v-model.number="reviewerRating" class="form-control" id="reviewerRating">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
  </div>

  <div class="form-group">
    <label for="exampleFormControlTextarea1">Your Review</label>
    <textarea v-model="Message" class="form-control" id="reviewerMessage" rows="3"></textarea>
  </div>
  <button class="btn btn-primary" type="submit">Submit</button>
</form>
    </div>
    `,
    data() {
        return {
            reviewerName: null,
            reviewerRating: null,
            Message: null,
            errors:[]

        }
        
},
methods: {
onSubmit(){
    if(this.reviewerName && this.reviewerRating && this.Message)
    {
        this.errors = [];
        let productReview = {
            name: this.reviewerName,
            rating: this.reviewerRating,
            message: this.Message
    
        }
        this.$emit('review-submitted', productReview)
        this.reviewerName = null,
        this.reviewerRating = null,
        this.Message = null
    }
    else {
        this.errors = [];
        if(!this.reviewerName) this.errors.push("Name is required.");
        if(!this.reviewerRating) this.errors.push("Please select rating.");
        if(!this.Message) this.errors.push("Please put something as a review.");
    }

}
}
})

Vue.component('product',{
    template: `  <div>
    

    <div class="container pt-5" >
        <div class="row">
            <div class="col-md-6" id="p-image">
                    <img v-bind:src="image" class="img-fluid" alt="Responsive image">      
            </div>
            <div class="col-md-6" id="p-info">
                <div >
                    <h1>{{ product }}</h1>
                    <p v-if="inStock">In Stock</p>
                   
                    <p v-else :class="{linethrough: !inStock}">Out of Stock</p>
                    <p>Shipping: {{ shipping }}</p>
                    <p>User is premium: {{ premium }} </p>
                    
                </div>
                <div>
                  <ul >
                    <li v-for="size in sizes">{{size}}</li>
                  </ul>
                </div>
                <div>
                <h2>
                  Products Details:
                </h2>


                  <h1>Colors:</h1>

                  <div 
                  class="color-box"
                     v-for="(variant, index) in variants" 
                     :key="variant.variantId" 
                      @mouseover="updateProdImg(index)" 
                      :style="{backgroundColor: variant.variantColor}" >
                    </div>
                   
              
                </div>
                <div>
                    <button v-on:click="addToCart" class="btn btn-primary"  :class="{makeBtnDisabled: !inStock}" :disabled="!inStock">Add to Cart</button>
                    <button class="btn btn-danger" v-on:click="removeFromCart" >Remove Recent Item</button>
                    
                </div>
            </div>
        </div>


        <div>
        <h3>Reviews</h3>
        <p v-if="!allReviews.length">There is no review yet. Be the first one to put review on this product</p>
        <ul>
          <li v-for="review in allReviews">
           <p>Name:  {{review.name}} </p>
           <p> Rating: {{review.rating}} </p>
           <p> Message: {{review.message}} </p>
          </li>
        </ul>
      </div>
        <div class="container">
        <div class="row">
        <div class="col-md-12">
        <product-review @review-submitted="addReview"></product-review>

</div></div></div>

    </div>
  </div>
`
,
props: {
    premium: {
        type: Boolean,
        required: true
    }
},
data() {
    return {
        product: 'Shoes',
        selectedImage: 0,
        onSale: true,
        sizes: ["Small","Medium","Large","Extra Large"],
        details: "This product is too good and this is the deatil of that product",
        allReviews: [],
        variants: [
            {
                variandId: 1,
                variantColor: 'Green',
                variantImage: './assets/g-socks.png',
                variantQuantity: 5
                
            },
            {
                variandId: 2,
                variantColor: 'Blue',
                variantImage: './assets/b-socks.png',
                variantQuantity: 0
            }
        ],
        
    }
},
methods: {

    updateProdImg(index) {
        this.selectedImage = index;

    },
    addToCart()
    {
        this.$emit('add-to-cart', this.variants[this.selectedImage].variandId)
    },
    removeFromCart(){
        this.$emit('minus-last-item',this.variants[this.selectedImage].variandId)
    },
    addReview(review){
        this.allReviews.push(review);
      }
},
computed: {
    image() {
        return this.variants[this.selectedImage].variantImage;
    },
    inStock() {
        return this.variants[this.selectedImage].variantQuantity;
    },
    shipping() {
        if(this.premium)
        {
            return "Free"
        }
        return 2.99
    }
}

});
Vue.component('product-details',{
    props: {
        details: {
            type: String,
            required: true
        }
    },
    template: `<ul>
    <li>
    {{details}}
    
    </li>
    </ul>`
})

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: [],
        

        
    },
    methods: {
        updateCart(id){
            this.cart.push(id);
      },
      minusLastItem(id){
        for(var i = this.cart.length - 1; i >= 0; i-- )
        {
            if(this.cart[i] === id)
            {
                this.cart.splice(i,1);
            }
        }
      },

    }
});
