import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/\d/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export const listingBasicsSchema = z.object({
  title: z.string().min(1, 'Title required').max(120),
  listingType: z.enum(['sale', 'rent']),
  propertyType: z.enum(['house', 'condo', 'townhouse', 'multi-family', 'land', 'commercial', 'manufactured']),
  price: z.number({ invalid_type_error: 'Price must be a number' }).int().min(0),
  description: z.string().min(1, 'Description required').max(5000),
});

export const listingAddressSchema = z.object({
  street: z.string().min(1, 'Street required'),
  city: z.string().min(1, 'City required'),
  state: z.string().min(1, 'State required'),
  zip: z.string().min(1, 'ZIP required'),
  neighborhood: z.string().optional(),
});

export const listingFeaturesSchema = z.object({
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  squareFootage: z.number().min(0),
  lotSize: z.number().min(0).optional(),
  lotSizeUnit: z.enum(['sqft', 'acres']).optional(),
  yearBuilt: z.number().min(1700).max(new Date().getFullYear()).optional(),
  stories: z.number().min(1).optional(),
  garageSpaces: z.number().min(0).optional(),
  parkingType: z.enum(['garage', 'driveway', 'street', 'none']).optional(),
});

export const leadSchema = z.object({
  message: z.string().min(1, 'Message required').max(1000),
  tourRequested: z.boolean().optional(),
  requestedTourTime: z.string().optional(),
  guestContact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
  }).optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});
