import { Router } from "express";
import { body, oneOf } from "express-validator";
import {
    getProducts,
    getProduct,
    postProduct,
    updateProduct,
    deleteProduct,
} from "./handlers/product";

import {
    getUpdate,
    getUpdates,
    postUpdate,
    updateUpdate,
    deleteUpdate,
} from "./handlers/update";

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

router.get("/update", getUpdate);
router.get("/update/:id", getUpdates);
router.post(
    "/update",
    body("title").exists().isString(),
    body("body").exists().isString(),
    body("productId").exists().isString(),
    postUpdate
);
router.put(
    "/update/:id",
    body("title").optional(),
    body("body").optional(),
    body("status")
        .isIn(["IN_PROGRESS", "LIVE", "DEPRECATED", "ARCHIVED"])
        .optional(),
    handleInputErrors,
    updateUpdate
);
router.delete("/update/:id", deleteUpdate);

/** UpdatePoint **/

router.get("/updatepoint", (req, res) => {});
router.get("/updatepoint/:id", (req, res) => {});
router.post("/updatepoint", (req, res) => {});
router.put("/updatepoint/:id", (req, res) => {});
router.delete("/updatepoint/:id", (req, res) => {});

export default router;
