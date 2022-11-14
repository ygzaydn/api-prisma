import { Router } from "express";
import { body, oneOf } from "express-validator";
import {
    getProducts,
    getProduct,
    postProduct,
    updateProduct,
    deleteProduct,
} from "./handlers/product";
import { handleInputErrors } from "./middlewares/validation";

const router = Router();

/** Product **/
router.get("/product", handleInputErrors, getProducts);

// :id is parameter here
router.get(
    "/product/:id",
    body("id").exists(),
    body("id").isString(),
    handleInputErrors,
    getProduct
);
router.post(
    "/product",
    body("name").exists(),
    body("name").isString(),
    handleInputErrors,
    postProduct
);
router.put(
    "/product/:id",
    body("name").exists(),
    body("name").isString(),
    handleInputErrors,
    updateProduct
);
router.delete(
    "/product/:id",
    body("name").exists(),
    body("name").isString(),
    handleInputErrors,
    deleteProduct
);

/** Update **/

router.get("/update", (req, res) => {});
router.get("/update/:id", (req, res) => {});
router.post(
    "/update",
    body("title").exists().isString(),
    body("body").exists().isString(),
    body("productId").exists().isString(),
    (req, res) => {}
);
router.put(
    "/update/:id",
    body("title").optional(),
    body("body").optional(),
    body("status").isIn(["IN_PROGRESS", "LIVE", "DEPRECATED", "ARCHIVED"]),
    handleInputErrors,
    (req, res) => {}
);
router.delete("/update/:id", (req, res) => {});

/** UpdatePoint **/

router.get("/updatepoint", (req, res) => {});
router.get("/updatepoint/:id", (req, res) => {});
router.post("/updatepoint", (req, res) => {});
router.put("/updatepoint/:id", (req, res) => {});
router.delete("/updatepoint/:id", (req, res) => {});

export default router;
