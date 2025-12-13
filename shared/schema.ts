import { z } from "zod";

export const userGeoSchema = z.object({
  lat: z.string(),
  lng: z.string(),
});

export const userAddressSchema = z.object({
  street: z.string(),
  suite: z.string(),
  city: z.string(),
  zipcode: z.string(),
  geo: userGeoSchema,
});

export const userCompanySchema = z.object({
  name: z.string(),
  catchPhrase: z.string(),
  bs: z.string(),
});

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  address: userAddressSchema,
  phone: z.string(),
  website: z.string(),
  company: userCompanySchema,
});

export const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

export const commentSchema = z.object({
  postId: z.number(),
  id: z.number(),
  name: z.string(),
  email: z.string(),
  body: z.string(),
});

export type UserGeo = z.infer<typeof userGeoSchema>;
export type UserAddress = z.infer<typeof userAddressSchema>;
export type UserCompany = z.infer<typeof userCompanySchema>;
export type User = z.infer<typeof userSchema>;
export type Post = z.infer<typeof postSchema>;
export type Comment = z.infer<typeof commentSchema>;
