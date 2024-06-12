import db from '../database/database.js';

// Function to fetch all shopping carts
async function getAllCarts() {
  try {
    // Retrieve all shopping carts from the database
    const carts = await db.cart.find({});
    return carts;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch carts');
  }
}

// Function to fetch a specific shopping cart by ID
async function getCart(id) {
  try {
    // Find the shopping cart with the specified ID
    const cart = await db.cart.findOne({ _id: id });
    if (!cart) {
      throw new Error('Cart not found');
    }
    return cart;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch cart');
  }
}

// Function to handle operations on the shopping cart
async function handleCartOperation(cart) {
  try {
    // Extract the titles of the products from the request
    const productTitles = cart.products.map(product => product.title);

    // Fetch only the products included in the request from the menu
    const menuProducts = await db.menu.find({ title: { $in: productTitles } });

    // Add price to each product in the shopping cart
    const productsWithPrices = cart.products.map(product => {
      const menuProduct = menuProducts.find(menuProduct => menuProduct.title === product.title);
      return {
        ...product,
        price: menuProduct ? menuProduct.price : 0, // Assume price 0 if not found, handle appropriately
      };
    });

    // Remove products that have quantity zero
    const products = productsWithPrices.filter(product => product.quantity > 0);

    // Calculate the total sum of the shopping cart
    const totalSum = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

    // Construct response message with detailed product information
    const response = constructResponse(products, totalSum);

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to construct response message with detailed product information
function constructResponse(products, totalSum) {
  const responseProducts = products.map(product => ({
    title: product.title,
    price: product.price,
    quantity: product.quantity,
    totalPrice: product.price * product.quantity
  }));

  return { products: responseProducts, totalSum };
}

// Function to create a new shopping cart
async function createCart(cart) {
  try {
    // Validate input data before proceeding
    if (!cart || !cart.products || cart.products.length === 0) {
      throw new Error('Invalid cart data');
    }

    const { products, totalSum } = await handleCartOperation(cart);
    const newCart = await db.cart.insert({ products, totalSum });
    return newCart; // Return only the created shopping cart, remove the response message
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create cart');
  }
}

// Function to update an existing shopping cart
async function updateCart(cartId, cart) {
  try {
    const existingCart = await db.cart.findOne({ _id: cartId });
    if (!existingCart) {
      throw new Error('Cart not found');
    }

    const { products, totalSum } = await handleCartOperation(cart);
    const updatedCart = await db.cart.update({ _id: cartId }, { products, totalSum });
    const response = constructResponse(products, totalSum);
    return { cart: updatedCart, ...response };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update cart');
  }
}

// Function to delete a shopping cart with a specific ID
function deleteCart(id) {
  db.cart.remove({ _id: id });
}

export { getAllCarts, getCart, createCart, updateCart, deleteCart };
