import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([])
    const { count } = useLoaderData()
    const [currentPages, setCurrentPages] = useState(0);
    const [itemaPerPages, setitemaPerPage] = useState(10);
    const numberofPages = Math.ceil(count / itemaPerPages);

    const pages = []
    for (let i = 0; i < numberofPages; i++) {
        pages.push(i)
    }
    console.log(pages);

    useEffect(() => {
        fetch(`http://localhost:5000/Prodect?page=${currentPages}&size=${itemaPerPages}`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Fetch error:', error));
    }, [currentPages, itemaPerPages]);
    /**
     * DONE 1: get the total number of prodects
     * DONE 2: number of items per page dynamic
     * TODO 3: get the current pages
     * **/


    useEffect(() => {
        const storedCart = getShoppingCart();
        const savedCart = [];
        // step 1: get id of the addedProduct
        for (const id in storedCart) {
            // step 2: get product from products state by using id
            const addedProduct = products.find(product => product._id === id)
            if (addedProduct) {
                // step 3: add quantity
                const quantity = storedCart[id];
                addedProduct.quantity = quantity;
                // step 4: add the added product to the saved cart
                savedCart.push(addedProduct);
            }
            // console.log('added Product', addedProduct)
        }
        // step 5: set the cart
        setCart(savedCart);
    }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const handleItemsChange = e => {
        const val = parseInt(e.target.value);
        console.log(val)
        setitemaPerPage(val)
        setCurrentPages(0)
    }

    const handlePrevPages = () => {
        if (currentPages > 0) {
            setCurrentPages(currentPages - 1);
        }
    }
    const hhandleNextPages = () => {
        if(currentPages < pages.length -1){
            setCurrentPages(currentPages + 1)
        }
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='Pagination'>
                <p>Currnet Pages: {currentPages}</p>
                <button onClick={handlePrevPages}>Prev</button>
                {
                    pages.map(page => <button
                        className={currentPages === page && 'selected'}
                        onClick={() => setCurrentPages(page)}
                        key={page}>
                        {
                            page
                        }

                    </button>)
                }
                <button onClick={hhandleNextPages}>Next</button>
                <select name={itemaPerPages} onChange={handleItemsChange} id="">
                    <option value="20">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="50">60</option>
                    <option value="50">70</option>
                    <option value="50">80</option>
                </select>
            </div>
        </div>
    );
};

export default Shop;