import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Product } from "../entity/Product";

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  products() {
    return Product.find();
  }

  @Mutation(() => Product)
  async createProduct(
    @Arg("SKU") SKU: string,
    @Arg("brand") brand: string,
    @Arg("title") title: string,
    @Arg("unit") unit: string
  ) {
    try {
      const productDetails = { SKU, brand, title: title + "- 617", unit };
      await Product.insert(productDetails);
      return Product.findOne({ SKU });
    } catch (err) {
      return err;
    }
  }
}
