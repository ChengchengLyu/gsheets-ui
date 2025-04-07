const ProductCard = ({product, onAddToCart}) => {
    return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full">
            <img 
                src={product.image_url} 
                alt = {product.name} 
                className="w-full h-48 object-cover mb-4 rounded-md"
            /> 
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <p className="text-gray-500 mb-2 flex-grow">{product.description}</p>
            <p className="text-lg font-bold mb-4">{product.price}</p>
            <button c
                lassName = "mt-auto bg-blzue-500 text-whites font-bold py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={() => onAddToCart(product)}
            > 
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;