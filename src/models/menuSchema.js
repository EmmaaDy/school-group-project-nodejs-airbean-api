import Joi from 'joi';

const menuItemSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().min(3).max(50).required(),
  desc: Joi.string().required(),
  price: Joi.number().positive().precision(2).required(),
});

const updateMenuItemSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().min(3).max(50),
  desc: Joi.string(),
  price: Joi.number().positive().precision(2),
});

export { menuItemSchema, updateMenuItemSchema };

