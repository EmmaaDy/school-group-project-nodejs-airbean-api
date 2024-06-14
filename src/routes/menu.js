import express from 'express';
import { createMenuItem } from '../controller/menu.js';
import { menuItemSchema } from '../models/menuSchema.js';
import { checkAdmin } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/', checkAdmin, async (req, res) => {
  try {
    // Validera inkommande data mot Joi-schema
    const { error, value } = menuItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Skapa ett nytt objekt med uuid som id om inget id finns i request
    const newItem = {
      id: value.id || uuidv4(),
      ...value,
      createdAt: new Date().toISOString()
    };

    // Skapa menyalternativ
    await createMenuItem(newItem);

    // Svara med framgångsmeddelande och det nya objektet
    res.status(201).json({
      message: 'Menu item added successfully',
      item: newItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add new menu item' });
  }
});

export default router;
