const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Add a sale
router.post("/", async (req, res) => {
  const { products, date } = req.body;

  try {
    const sales = [];
    let totalAmount = 0;
    let description = 'Sale of multiple products: ';

    for (const item of products) {
      const { productId, quantity } = item;

      // Get product details
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product || product.stock < quantity) {
        return res.status(400).json({ error: `Insufficient stock or invalid product for productId: ${productId}` });
      }

      // Create sale
      const saleAmount = product.price * quantity;
      totalAmount += saleAmount;
      const sale = await prisma.sale.create({
        data: {
          productId,
          quantity,
          totalAmount: saleAmount,
          date: new Date(date),
        },
      });

      // Update stock
      await prisma.product.update({
        where: { id: productId },
        data: { stock: product.stock - quantity },
      });

      sales.push(sale);
      description += `${product.name} (x${quantity}), `;
    }

    // Remove trailing comma and space
    description = description.substring(0, description.length - 2);

    // Add financial record
    await prisma.financialRecord.create({
      data: {
        type: "income",
        amount: totalAmount,
        description: description,
        createdAt: new Date(date), // Use the same date as the sale
      },
    });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;