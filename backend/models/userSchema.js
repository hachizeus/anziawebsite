/**
 * MongoDB User Schema Definition
 * 
 * This file defines the structure of user documents in MongoDB.
 * While MongoDB is schema-less, this serves as documentation and validation reference.
 */

const userSchema = {
  email: String,                // User email (unique)
  password: String,             // Hashed password
  name: String,                 // User's full name
  role: String,                 // User role: "user", "admin", "agent"
  profile_picture: String,      // URL to profile picture (stored in ImageKit)
  phone: String,                // Phone number
  address: Object,              // Address information
  created_at: Date,             // Account creation timestamp
  updated_at: Date,             // Last update timestamp
  last_login: Date,             // Last login timestamp
  active: Boolean,              // Account status
  email_verified: Boolean,      // Email verification status
  reset_token: String,          // Password reset token
  reset_token_expires: Date     // Password reset token expiration
};

export default userSchema;

/**
 * Example user document:
 * 
 * {
 *   _id: ObjectId("..."),
 *   email: "user@example.com",
 *   password: "$2b$10$...", // bcrypt hash
 *   name: "John Doe",
 *   role: "user",
 *   profile_picture: "https://ik.imagekit.io/q5jukn457/profile-pictures/user123.jpg",
 *   phone: "+1234567890",
 *   address: {
 *     street: "123 Main St",
 *     city: "Anytown",
 *     state: "State",
 *     zip: "12345",
 *     country: "Country"
 *   },
 *   created_at: ISODate("2023-01-10T08:15:00Z"),
 *   updated_at: ISODate("2023-02-15T14:30:00Z"),
 *   last_login: ISODate("2023-03-01T09:45:00Z"),
 *   active: true,
 *   email_verified: true,
 *   reset_token: null,
 *   reset_token_expires: null
 * }
 */