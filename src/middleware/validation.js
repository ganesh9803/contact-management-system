import Joi from 'joi';

/**
 * Validation schema for user registration
 */
const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

/**
 * Validation schema for user login
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

/**
 * Validation schema for contact creation/updating
 */
const contactSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(15).required(),
  address: Joi.string().optional(),
  timezone: Joi.string().optional(),
});

/**
 * Middleware to validate user data (registration or login)
 */
export const validateUser = (req, res, next) => {
  let schema;

  // Determine the schema to use based on the request URL or method
  if (req.method === 'POST' && req.url.includes('register')) {
    schema = userSchema;  // For registration
  } else if (req.method === 'POST' && req.url.includes('login')) {
    schema = loginSchema;  // For login
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  next();
};

/**
 * Middleware to validate contact data
 */
export const validateContact = (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

 