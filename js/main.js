let app = new Vue({
    el: '#app',
    data: {
        brand: 'Vue Mastery',
        product: "Socks",
        description: 'A pair of warm, fuzzy socks.',
        selectedVariant: 0,
        altText: "A pair of socks",
        link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
        inStock: true,
        inventory: 100,
        onSale:true,
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 10,
                onSale: true,
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 0,
                onSale: false,
            }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        cart: 0,
    },

    methods: {
        addToCart() {
            this.cart += 1
        },
        removeFromCart() {
            if (this.cart !== 0)
                this.cart -= 1
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        }



    },

    computed: {
        title() {
            if (this.variants[this.selectedVariant].onSale){
                return this.brand + ' ' + this.product + ' ' + 'Sale';
            }else {
                return this.brand + ' ' + this.product;
            }

        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity;
        },
    }



})