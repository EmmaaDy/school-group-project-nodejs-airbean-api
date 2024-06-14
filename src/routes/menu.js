import { Router } from "express";
import { getAllProducts, createMenuItem, findMenuItemByTitle, updateMenuItem, deleteMenuItem } from "../controller/menu.js";
import { menuItemSchema, updateMenuItemSchema } from "../models/menuSchema.js"; // Se till att du importerar både menuItemSchema och updateMenuItemSchema
import { checkAdmin } from "../middleware/auth.js";

const router = Router();

router.get('/', getAllProducts);

// POST new menu item. Also adding a new parameter 'createdAt' to log the menu update.
// Check if logged-in user has admin-role, which gives access to update menu.
router.post('/', checkAdmin, async (req, res) => {
  try {
    // Validate that the input menu item corresponds to expected form.
    const { error, value } = menuItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Add createdAt parameter
    const createdAt = new Date().toISOString();
    const newItem = {
      ...value,
      id: value.id || uuidv4(), // Generate unique id if not provided
      createdAt
    };

    // Include new menu item in response. Response info from the request body.
    await createMenuItem(newItem);
    res.json({
      message: "Menu item added successfully",
      item: newItem  // Use the newItem data from the request body
    });
  } catch (error) {
    console.error('Failed to add new menu item', error);
    res.status(500).json({ error: 'Failed to add new menu item' });
  }
});

// Update menu item. Add parameter 'modifiedAt'.
router.put('/:title', checkAdmin, async (req, res) => {
  try {
    // Check if the entered menu-item exists in database.
    const menuItem = await findMenuItemByTitle(req.params.title);
    if (!menuItem) {
      return res.status(404).json({ error: 'Failed to find menu item. Is it correctly spelled?' });
    }

    // Validate that the updates correspond to expected form.
    const { error, value } = updateMenuItemSchema.validate(req.body); // Använd updateMenuItemSchema här
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Add modifiedAt parameter
    const modifiedAt = new Date().toISOString();
    const updatedItem = {
      ...value,
      modifiedAt
    };

    await updateMenuItem(req.params.title, updatedItem);
    
    // Retrieve updated menu item from the database for response.
    const updatedMenuItem = await findMenuItemByTitle(req.params.title);

    res.json({ message: "Menu updated successfully", item: updatedMenuItem });
  } catch (error) {
    console.error('Failed to update menu item', error);
    res.status(500).json({ error: 'Failed to update menu item', details: error.message });
  }
});

// Delete a menu item
router.delete('/:title', checkAdmin, async (req, res) => {
  try {
    // Check if the entered menu-item exists in database.
    const menuItem = await findMenuItemByTitle(req.params.title);
    if (!menuItem) {
      return res.status(404).json({ error: 'Failed to find menu item. Is it correctly spelled?' });
    }

    // Response includes the name of deleted item, retrieved from the URL input.
    await deleteMenuItem(req.params.title);
    res.json({ message: "Menu item deleted successfully", item: req.params.title });
  } catch (error) {
    console.error('Failed to delete menu item', error);
    res.status(500).json({ error: 'Failed to delete menu item', details: error.message });
  }
});

export default router;
