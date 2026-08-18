
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { ProductController } from "../controllers/ProductController";
import { VariantController } from "../controllers/VariantController";

const router = Router();

//User Routes
router.post("/users", UserController.create);
router.get("/users/:id", UserController.getById);
router.patch("/users/:id", UserController.update);
router.delete("/users/:id", UserController.delete);

//Product Routes
router.post("/products", ProductController.create);
router.get("/products/:id", ProductController.getById);
router.patch("/products/:id", ProductController.update);
router.delete("/products/:id", ProductController.delete);

//Product Variant Routes
router.post("/product_variant",VariantController.create);
router.get("/product_variant/:id",VariantController.getById);
router.patch("/product_variant/:id",VariantController.update);
router.delete("/product_variant/:id",VariantController.delete);

export default router;