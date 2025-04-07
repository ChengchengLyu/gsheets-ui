import {
    API_BASE_URL,
    SPREADSHEET_ID,
    ORDERS_WORKSHEET_NAME,
} from "../constants";
import { useState } from "react";


// Run on app backend page append some information, run successfully, then get information from Curl:
// curl -X 'POST' \
//   'https://google-sheets-python-api-ten.vercel.app/api/1OOv0uKjvXQg73laJp_L28Kf7NI6DpVYrlrIyyxof0Fo/orders/append?auto_increment_id=false' \
//   -H 'accept: application/json' \
//   -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc0Mzk5NDI2OX0.ZaUqYpYNBWgL_NFnf-Nvj7NqrPhuGNepqkumDCpB3Dc' \
//   -H 'Content-Type: application/json' \
//   -d '[
//   {
//    "order_id":"abcd123",
// "item_id": "3",
// "description": "some product"
// }
// ]'

import shortUUID from "short-uuid"; // downloaded library function

const Cart = ({cart, token, onRemoveFromCart, onSuccessfulCheckOut, onClose}) => {

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const totalAmount = cart.reduce(
        (sum, item) => sum + (Number(item?.price) || 0), 
        0).toFixed(2); // round to 2 decimal

    const handleCheckOut = async() =>{
        setIsCheckingOut(true);

        try{
            const orderId = shortUUID.generate();
            await fetch(
                `${API_BASE_URL}/api/${SPREADSHEET_ID}/${ORDERS_WORKSHEET_NAME}/append?auto_increment_id=false`,
                {
                    method:"POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        accept: "application/json"
                    },
                    body: JSON.stringify(cart.map(item => (
                        {
                            order_id: orderId,
                            item_id: item.id,
                            description: item.description,
                            price: item.price,
                            order_datetime: new Date().toDateString(),
                        }
                    )))
                }
            );
            onSuccessfulCheckOut();
        } catch (error){
            console.log("Failed to checkout: ", error);
            }
            setIsCheckingOut(false);
        };


    return (
    <div className="fixed inset-0 flex z-50">
        <div className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity"
        onClick={onClose}></div>

    <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto"
    >
        <div className="mt-4, px-4">
            {
                cart.length == 0 ? (
                    <p> Your cart is empty.</p>
                ) :(
                    <>
                    {cart.map((product, index) => (
                        <div key={index}
                            className="flex items-center justify-between mb-4"
                        >
                            <div>
                                <h3
                                className="text-lg font-bold"
                                
                                >{product.name}</h3>
                                <p className="text-gray-500"
                                >{product.price}</p>
                            </div>

                            <button
                            className="bg-red-500 text-white font-bold py-1 px-2 rounded-md hover:bg-red-600"
                            onClick={() => onRemoveFromCart(product.cartItemId)}
                            >Remove</button>

                        </div>
                    ))}

                    <div
                    className="mt-8 border-t pt-4">
                        <div className="flex justify-between items-center"> 
                            <span className="text-lg font-semibold"
                            >Total: </span>
                            <span className="text-xl font-bold"
                            >${totalAmount}</span>
                        </div>
                    </div>
                    <button 
                        onClick={()=>handleCheckOut()}
                        className="w-full mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600"
                        disabled={cart.length == 0 || isCheckingOut}
                    >
                        {isCheckingOut ? "Cheking out..." :
                        `Checkout (${totalAmount})`}</button>
                    </>
                )
            }
        </div>
    </div>

    </div>);
};

export default Cart;