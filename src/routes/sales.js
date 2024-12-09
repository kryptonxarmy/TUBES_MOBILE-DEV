const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Add a sale
router.post("/", async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock or invalid product" });
    }

    // Create sale
    const totalAmount = product.price * quantity;
    const sale = await prisma.sale.create({
      data: {
        productId,
        quantity,
        totalAmount,
      },
    });

    // Update stock
    await prisma.product.update({
      where: { id: productId },
      data: { stock: product.stock - quantity },
    });

    // Add financial record
    await prisma.financialRecord.create({
      data: {
        type: "income",
        amount: totalAmount,
        description: `Sale of ${quantity}x ${product.name}`,
      },
    });

    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
