let eventBus = new Vue()

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },

    template: `
<div>
      
        <ul>
          <span class="tab" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="tab"
          >{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul v-else>
                <li v-for="(review, index) in reviews" :key="index">
                  <p>{{ review.name }}</p>
                  <p>Rating: {{ review.rating }}</p>
                  <p>{{ review.review }}</p>
                  <p>Recommendation: {{ review.choice }}</p>
                </li>
            </ul>
        </div>
        <div v-show="selectedTab === 'Make a Review'">
          <product-review></product-review>
        </div>
    
      </div>
`,

    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews',

        }
    }
})

Vue.component('info-tabs', {
    props: {
        shipping: {
            required: true
        },
        details: {
            type: Array,
            required: true
        },
        sizes: {
            type: Array,
            required: true
        }
    },
    template: `
      <div>
        <ul>
          <span class="tab" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="tab"
          >{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Shipping'">
          <p>{{ shipping }}</p>
        </div>
        <div v-show="selectedTab === 'Details'">
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
        </div>
        <div v-show="selectedTab === 'Sizes'">
          <ul>
            <li v-for="sizes in sizes">{{ sizes }}</li>
          </ul>
        </div>
      </div>
    `,
    data() {
        return {
            tabs: ['Shipping', 'Details', 'Sizes'],
            selectedTab: 'Shipping'
        }
    }
})

Vue.component('product-review', {
    template: `
<form class="review-form" @submit.prevent="onSubmit">
<p v-if="errors.length">
 <b>Please correct the following error(s):</b>
 <ul>
   <li v-for="error in errors">{{ error }}</li>
 </ul>
</p>
 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>
 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>
 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option v-show = "validRec">5</option>
     <option v-show = "validRec">4</option>
     <option v-show = "validRec1">3</option>
     <option v-show = "validRec1">2</option>
     <option v-show = "validRec1">1</option>
   </select>
 </p>
<fieldset>
    <legend >Would you recommend this product?</legend>
        <div class="radio-block">
            <label for="yes">Yes</label>
            <input type="radio" id="choice" name="choice" v-model="choice"  @change="validateRec()" value="Yes"/>
            <label for="no">No</label>
            <input type="radio" id="choice2" name="choice" v-model="choice"  @change="validateRec()" value="No"  />
        </div>
</fieldset>
<p>
   <input v-on:click="emptyErrors" type="submit" value="Submit"> 
 </p>
</form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            choice: null,
            errors: [],
            validRec: false,
            validRec1: false
        }
    },
    methods: {

        validateRec() {
            let val = document.getElementById("choice").value
            let val2 = document.getElementById("choice2").value

            console.log(val)
            console.log(val2)

            if (val = "yes") {
                this.validRec = true
            } else {
                this.validRec1 = true
            }
        },

        onSubmit() {
            if (this.name && this.review && this.rating && this.choice) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    choice: this.choice,
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.choice = null
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
                if (!this.choice) this.errors.push("Choice required.")
            }
        },
        emptyErrors(){
            if (
                this.name != null &&
                this.review != null &&
                this.rating != null &&
                this.choice != null
            ){
                this.errors = [];
            }

        }
    }
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
   <div class="product">
    <div class="product-image">
           <img :src="image" :alt="altText"/>
       </div>
       <div class="product-info">
           <h1>{{ title }}</h1>
           <span v-show="onSale"> SALE</span>
           <p>{{ description }}</p>
           <a :href="link">More products like this.</a>
           <p v-if="inStock">In stock</p>
            <p v-else :class="{ textLine: !inStock}">Out of Stock</p>
            <p v-else>Out of Stock</p>
           <info-tabs :shipping="shipping" :details="details" :sizes="sizes"></info-tabs>
           <div
                   class="color-box"
                   v-for="(variant, index) in variants"
                   :key="variant.variantId"
                   :style="{ backgroundColor:variant.variantColor }"
                   @mouseover="updateProduct(index)"
           ></div>
          
           <button
                   v-on:click="addToCart"
                   :disabled="!inStock"
                   :class="{ disabledButton: !inStock }"
           >
               Add to cart
           </button>  
           <button
                   v-on:click="removeFromCart"
                   :disabled="!inStock"
                   :class="{ disabledButton: !inStock }"
           >
               Remove from cart
           </button>  
       </div>   
       <div>    
            <product-tabs :reviews="reviews"></product-tabs>
       </div>           
       
 `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            inStock: true,
            inventory: 10,
            onSale:true,
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            description: 'A pair of warm, fuzzy socks.',
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                    price: 150,

                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                    price: 100,
                }
            ],
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].price);
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].price);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    },

    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(price) {
            this.cart.push(price);
            let add = function (arr) {
                return arr.reduce((a, b) => a + b, 0);
            };
            let sum = add(this.cart);
            for (let i = 0; i <= this.cart.length; ++i) {
                this.cart.shift();
            }
            this.cart.push(sum);
        },
        removeFromCart(price){
            this.cart.pop(price);
        }
    }
})