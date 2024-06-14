import Joi from 'joi';

const menuItemSchema = Joi.object({
  id: Joi.string().optional(), // Gör id valfritt
  title: Joi.string().min(3).max(100).required(),
  desc: Joi.string().min(10).max(500).required(),
  price: Joi.number().positive().required()
});

export { menuItemSchema };
