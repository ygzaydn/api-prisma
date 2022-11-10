import { Router } from "express";
import { body, validationResult } from "express-validator";
import { getProducts, getProduct } from "./handlers/product";

const router = Router();

/** Product **/
router.get("/product", getProducts);

// :id is parameter here
router.get("/product/:id", getProduct);
router.post("/product", (req, res) => {});
router.put("/product/:id", body("name").exists(), (req, res) => {
    const error = validationResult(req);
    console.log(error.isEmpty());
    if (!error.isEmpty()) {
        res.status(400);
        console.log("asd");
        res.json({ error: error.array() });
    }
});
router.delete("/product/:id", (req, res) => {});

/** Update **/

router.get("/update", (req, res) => {});
router.get("/update/:id", (req, res) => {});
router.post("/update", (req, res) => {});
router.put("/update/:id", (req, res) => {});
router.delete("/update/:id", (req, res) => {});

/** UpdatePoint **/

router.get("/updatepoint", (req, res) => {});
router.get("/updatepoint/:id", (req, res) => {});
router.post("/updatepoint", (req, res) => {});
router.put("/updatepoint/:id", (req, res) => {});
router.delete("/updatepoint/:id", (req, res) => {});

export default router;
