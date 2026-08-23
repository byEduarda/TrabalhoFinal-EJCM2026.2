
import { Router } from "express";

import { UserController } from "../controllers/UserController";
import { ProductController } from "../controllers/ProductController";
import { VariantController } from "../controllers/VariantController";
import { WishListController } from "../controllers/WishListController";
import { OrderController } from "../controllers/OrderController";
import { CategoryController } from "../controllers/CategoryController";

import { authenticateJWT } from "../middlewares/Authenticate";

const router = Router();

//User Routes
router.post("/users", UserController.create);
router.post("/login", UserController.login);

router.post("/users", authenticateJWT, UserController.create);
router.get("/users/:id", authenticateJWT, UserController.getById);
router.patch("/users/:id", authenticateJWT, UserController.update);
router.delete("/users/:id", authenticateJWT, UserController.delete);

//Product Routes
router.post("/products", authenticateJWT, ProductController.create);
router.get("/products/:id", authenticateJWT, ProductController.getById);
router.patch("/products/:id", authenticateJWT, ProductController.update);
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

//Order Routes
router.post("/orders", authenticateJWT, OrderController.create);
router.get("/orders/:id", authenticateJWT, OrderController.getById);
router.patch("/orders/:id", authenticateJWT, OrderController.update);
router.delete("/orders/:id", authenticateJWT, OrderController.delete);

//Category Routes
router.post("/categories", authenticateJWT, CategoryController.create);
router.get("/categories", authenticateJWT, CategoryController.getAll);
router.get("/categories/:id", authenticateJWT, CategoryController.getById);
router.patch("/categories/:id", authenticateJWT, CategoryController.update);
router.delete("/categories/:id", authenticateJWT, CategoryController.remove);

export default router;