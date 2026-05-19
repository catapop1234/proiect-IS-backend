const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getFavorites = async (userId, placeType) => {
  const where = { userId };
  if (placeType) where.placeType = placeType;

  const items = await prisma.favorite.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  return { items };
};

const addFavorite = async (userId, data) => {
  const { place_id, name, address, place_type, rating } = data;
  if (!place_id || !name) {
    throw Object.assign(new Error('place_id și name sunt obligatorii'), { code: 'VALIDATION_ERROR' });
  }

  const favorite = await prisma.favorite.upsert({
    where: { userId_placeId: { userId, placeId: place_id } },
    update: {},
    create: {
      userId,
      placeId: place_id,
      name,
      address: address || null,
      placeType: place_type || null,
      rating: rating || null,
    },
  });
  return favorite;
};

const removeFavorite = async (userId, placeId) => {
  const existing = await prisma.favorite.findUnique({
    where: { userId_placeId: { userId, placeId } },
  });
  if (!existing) {
    throw Object.assign(new Error('Favorit negăsit'), { code: 'NOT_FOUND' });
  }
  await prisma.favorite.delete({
    where: { userId_placeId: { userId, placeId } },
  });
  return { message: 'Favorit eliminat' };
};

const getFavoritePlaceIds = async (userId) => {
  const favs = await prisma.favorite.findMany({
    where: { userId },
    select: { placeId: true },
  });
  return favs.map((f) => f.placeId);
};

const isFavorite = async (userId, placeId) => {
  const fav = await prisma.favorite.findUnique({
    where: { userId_placeId: { userId, placeId } },
  });
  return !!fav;
};

module.exports = { getFavorites, addFavorite, removeFavorite, getFavoritePlaceIds, isFavorite };
