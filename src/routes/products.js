const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add", async (req, res) => {
  const { name, price, stock, description } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || null, // Ensure description is null if not provided
        price,
        stock,
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update stock for a product
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { stock },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
