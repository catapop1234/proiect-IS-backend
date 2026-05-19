const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getHistory = async (userId, limit = 20) => {
  const items = await prisma.searchHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return { items };
};

const saveSearch = async (userId, { city, type, radius = 10 }) => {
  if (!city || !type) {
    throw Object.assign(new Error('City și type sunt obligatorii'), { code: 'VALIDATION_ERROR' });
  }
  const item = await prisma.searchHistory.create({
    data: { userId, city, type, radius },
  });
  return item;
};

const clearHistory = async (userId) => {
  await prisma.searchHistory.deleteMany({ where: { userId } });
  return { message: 'Istoricul a fost șters' };
};

module.exports = { getHistory, saveSearch, clearHistory };
