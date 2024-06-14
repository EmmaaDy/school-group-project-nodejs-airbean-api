import db from '../database/database.js';
import { menuItemSchema } from '../models/menuSchema.js';
import { v4 as uuidv4 } from 'uuid';

// Function to show the menu
export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await db.menu.find({});
    res.send(allProducts);
  } catch (error) {
    console.error('Could not find the menu', error);
    res.status(500).send({ error: 'Could not find the menu' });
  }
};

// Function to add menu item
export const createMenuItem = async (newItem) => {
  try {
    const result = await db.menu.insert(newItem);
    return result;
  } catch (error) {
    console.error('Failed to add new menu item', error);
    throw error;
  }
};

// Function to validate if a title matches with a menu item in the database
export const findMenuItemByTitle = async (title) => {
  try {
    const menuItem = await db.menu.findOne({ title: title });
    return menuItem;
  } catch (error) {
    console.error('Failed to find menu item in db', error);
    throw error;
  }
};

// Function to update menu item
export const updateMenuItem = async (title, updatedMenuItem) => {
  try {
    const result = await db.menu.update({ title: title }, { $set: updatedMenuItem });
    return result;
  } catch (error) {
    console.error('Failed to update menu item', error);
    throw error;
  }
};

// Function to delete menu item
export const deleteMenuItem = async (title) => {
  try {
    const result = await db.menu.remove({ title: title });
    return result;
  } catch (error) {
    console.error('Failed to delete menu item', error);
    throw error;
  }
};
