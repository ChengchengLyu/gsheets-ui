import { useEffect, useState } from "react";
import {
    API_BASE_URL,
    SPREADSHEET_ID,
    INVENTORY_WORKSHEET_NAME
} from '../constants';
import ProductCard from "./ProductCard";
import Cart from "./Cart";

const Dashboard = ({token, onLogout}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState(null);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false); // useState set as false means not display
    const [cartItemId, setCartItemId] = useState(0);


    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try{
                const response = await fetch(
                    `${API_BASE_URL}/api/${SPREADSHEET_ID}/${INVENTORY_WORKSHEET_NAME}/read`,
                    {
                        headers:{
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setProducts(data);
                console.log("API response", data);
            }catch(error){
                console.log("Failed to fetch  products", error);
                setProducts(null);
            }
            setIsLoading(false);
        }
        fetchProducts()
    }, [token]); // each time we change token, relog in a new user we re-run the function

    const handleAddToCart = (product) =>{
        setCart((preCart) => [...preCart, {...product, cartItemId:cartItemId}]);
        setCartItemId((prevId) => prevId + 1);
    };

    const handleRemoveFromCart = (cartItemId) => {
        setCart((prevCart) => prevCart.filter((product) => product.cartItemId != cartItemId))
    }

    const handleOnSuccessfulCheckOut = () => {
        setCart([]);
        setIsCartOpen(false);
    }

    return (
        <div>
            <header className="bg-blue-500 text-white py-4 px-8 flex items-center justify-between">
                <h2 className="text-xl font-bold">Welcome!</h2>
                <div>
                <botton className="bg-white text-red-500 font-bold py-2 px-4 rounded-md hover:bg-gray-100 mr-4"
                    onClick = {onLogout}
                    >Logout </botton>

                    <botton className="bg-white text-blue-500 font-bold py-2 px-4 rounded-md hover:bg-gray-100 mr-4"
                    onClick = {() => setIsCartOpen(true)}
                    >
                        View Cart ({cart.length})</botton>
                </div> 
            </header>
            
            <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
                {products && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {
                            products.map((product, index)=>(
                                <ProductCard product = {product} 
                                key={index}
                                onAddToCart={handleAddToCart} />
                            ))
                        }
                        </div>
                    )}

            </div>
            {
                isCartOpen && <Cart 
                cart={cart} 
                token = {token}
                onRemoveFromCart={handleRemoveFromCart}
                onSuccessfulCheckOut={handleOnSuccessfulCheckOut}
                onClose={() => setIsCartOpen(false)} />
            }
        </div>
    );
};

export default Dashboard;