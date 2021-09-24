import React, { useEffect, useState } from 'react';
import { addToDb, getStoredCart } from '../../../utilities/fakedb';
import Cart from '../../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [displayProducts, setDisplayProducts] = useState([]);

    useEffect( () => {
        fetch('./products.JSON')
        .then(res => res.json())
        .then(data => {
            setProducts(data);
            setDisplayProducts(data);
            // console.log('product recived');
        })
    }, []);

    useEffect( () => { 
        // console.log('LocalStorage called');
        if( products.length){
            const savedCart = getStoredCart();
            const storedCart = [];
        for( const key in savedCart) {
            //console.log(key, savedCart[key]);
            const addedProduct = products.find( product => product.key === key);
            if(addedProduct) {
                const quantity = savedCart[key];
                addedProduct.quantity = quantity;
                // console.log(addedProduct);
                storedCart.push(addedProduct);
                }           
            }
            setCart(storedCart);
        }
    } , [products])

    const handleAddToCart = (product) => {
        //console.log(product);
        const newCart = [...cart, product];
        setCart(newCart);
        //save to local storage (for now)
        addToDb(product.key);
    }

    const handleSearch = event => {
        const searchText = event.target.value;
        const matchProducts = products.filter(product => product.name.toLowerCase().includes(searchText.toLowerCase()));
        setDisplayProducts(matchProducts);
        console.log(matchProducts.length);


        // console.log(event.target.value);

    }

    return (
       <>
        <div className="search-container">
            <input type="text" onChange={handleSearch} placeholder="Search Product" />
        </div>
        <div className="shop-container">
            <div className="product-container">
                {
                    displayProducts.map(product => <Product
                        key={product.key}
                        product={product}
                        handleAddToCart = {handleAddToCart}
                        >
                       </Product>)
                }
                </div>            
            <div className="cart-container">
               <Cart cart={cart}></Cart>
                </div>            
        </div>
    </>
    );
};
        
export default Shop;