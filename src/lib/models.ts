import mongoose, { Schema, model, models } from "mongoose";

const SettingsSchema = new Schema({
  key: { type: String, unique: true, default: "main" },
  storeName: { type: String, default: "ServicesId Store" },
  tagline: { type: String, default: "Belanja produk digital dengan cepat & aman" },
  logoUrl: { type: String, default: "" },
  bannerUrl: { type: String, default: "" },
  primaryColor: { type: String, default: "#16a34a" },
  secondaryColor: { type: String, default: "#0f172a" },
  welcomeText: { type: String, default: "Selamat datang di ServicesId Store 💚" }
}, { timestamps: true });

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  emoji: { type: String, default: "📦" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const ProductSchema = new Schema({
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String, default: "" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const UserSchema = new Schema({
  telegramId: { type: String, unique: true, index: true },
  username: String,
  name: String,
  balance: { type: Number, default: 0 }
}, { timestamps: true });

const DepositSchema = new Schema({
  telegramId: { type: String, index: true },
  amount: Number,
  reference: { type: String, unique: true },
  status: { type: String, enum: ["PENDING", "PAID", "EXPIRED", "FAILED"], default: "PENDING" },
  qrText: String,
  qrImage: String,
  gatewayId: String,
  expiresAt: Date
}, { timestamps: true });

export const Settings = models.Settings || model("Settings", SettingsSchema);
export const Category = models.Category || model("Category", CategorySchema);
export const Product = models.Product || model("Product", ProductSchema);
export const User = models.User || model("User", UserSchema);
export const Deposit = models.Deposit || model("Deposit", DepositSchema);
