import mongoose, { model, models, Schema } from "mongoose";

const ExtraPriceSchema = new Schema({
  name: { type: String },
  price: { type: Number },
});

const MenuItemSchema = new Schema({
  image: { type: String },
  name: { type: String },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },  // Make sure to reference the appropriate model if using ObjectId
  basePrice: { type: Number },
  sizes: { type: [ExtraPriceSchema] },  // Array of subdocuments
  extraIngredientPrices: { type: [ExtraPriceSchema] },  // Array of subdocuments
}, { timestamps: true });

export const MenuItem = models?.MenuItem || model('MenuItem', MenuItemSchema);
