const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Get financial records
router.get("/", async (req, res) => {
  try {
    const records = await prisma.financialRecord.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/total-income", async (req, res) => {
    try {
      const totalIncome = await prisma.financialRecord.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          type: "income",
        },
      });
      res.json({ totalIncome: totalIncome._sum.amount || 0 });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
