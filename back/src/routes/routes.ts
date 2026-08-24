
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { ProductController } from "../controllers/ProductController";
import { VariantController } from "../controllers/VariantController";

import { authenticateJWT } from "../middlewares/Authenticate";
import { WishListController } from "../controllers/WishListController";
import { CartController } from "../controllers/CartController";
import { CategoryController } from "../controllers/CategoryController";

import { CartItemController } from "../controllers/CartItemController";

import { CouponController } from "../controllers/CouponController";




const router = Router();

//User Routes
router.post("/users",UserController.create);
router.get("/users/:id", authenticateJWT, UserController.getById);
router.patch("/users/:id", authenticateJWT, UserController.update);
router.delete("/users/:id", authenticateJWT, UserController.delete);

//Product Routes
router.post("/products",authenticateJWT, ProductController.create);
router.get("/products/:id",authenticateJWT, ProductController.getById);
router.patch("/products/:id",authenticateJWT,  ProductController.update);
router.delete("/products/:id", authenticateJWT, ProductController.delete);

//Product Variant Routes
router.post("/productVariant",authenticateJWT, VariantController.create);
router.get("/productVariant/:id",authenticateJWT, VariantController.getById);
router.get("/productVariant/:productId", authenticateJWT, VariantController.getVariantByProduct);
router.patch("/productVariant/:id",authenticateJWT, VariantController.update);
router.patch("/productVariant/:id/stockQuantity",authenticateJWT, VariantController.updateStock);
router.delete("/productVariant/:id",authenticateJWT, VariantController.delete);

//Wishlist Routes
router.post("/wishlist/:userId",authenticateJWT,  WishListController.create);
router.get("/wishlist/:userId",authenticateJWT,  WishListController.get);
router.delete("/wishlist/:userId/product/:productId", authenticateJWT, WishListController.deleteOne);
router.delete("/wishlist/:userId",authenticateJWT, WishListController.deleteAll);

// Cart Routes
router.post("/cart",authenticateJWT, CartController.create);
router.get("/cart/:id",authenticateJWT, CartController.getbyId);
router.patch("/cart/:id",authenticateJWT, CartController.updatecart);
router.delete('/cart/:cartId/item/:itemId',authenticateJWT,CartController.removeItem);
router.post("/category",authenticateJWT, CategoryController.create);

// CartItem Routes
router.post("/cartitem",authenticateJWT, CartItemController.create);
router.get("/cartitem/:id",authenticateJWT,  CartItemController.get);
router.patch("/cartitem/:id",authenticateJWT,  CartItemController.update);
router.delete('/cartItem/cart/:userId/item/:variantId',authenticateJWT, CartItemController.delete);

//Coupon Routes
router.post("/coupon", CouponController.create);


export default router;