import { Router } from "express";
import { createOffering, getAllOfferings, deleteOffering } from '../controller/offerings.js';
import db from '../database/database.js';
import { checkAdmin } from '../middleware/auth.js';

const router = Router();
router.use(checkAdmin);

// Endpoint for adding a new offering
router.post('/offering', async (req, res) => {
  try {
    const { title, products, price } = req.body; // Korrigerat för att få produkterna direkt som en array

    // Log för felsökning
    console.log('Received offering:', { title, products, price });

    // Fetch all products from the menu
    const menuProducts = await db.menu.find({});
    console.log('Menu products:', menuProducts); // Log för felsökning

    // Check if all products in the offering exist in the menu
    const productsExist = products.every(product => 
      menuProducts.some(menuProduct => menuProduct.title === product)
    );

    // Log for debugging
    console.log('Products exist:', productsExist);

    // If all products exist, proceed with creating the offering
    if (productsExist) {
      const newOffering = {
        title,
        products,
        price,
        createdAt: new Date()
      };
      const createdOffering = await createOffering(newOffering);
      res.json({ message: 'New offering added successfully', offering: createdOffering });
    } else {
      // If any of the products are missing, return an error response
      res.status(400).json({ error: 'One or more products are not available' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add new offering' });
  }
});

// Endpoint to view offerings
router.get('/offering', getAllOfferings);

// Endpoint to delete offerings
router.delete('/offering/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteOffering(id);
    if (result > 0) {
      res.json({ message: 'Offering deleted successfully' });
    } else {
      res.status(404).json({ error: 'Offering not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete offering' });
  }
});

export default router;
