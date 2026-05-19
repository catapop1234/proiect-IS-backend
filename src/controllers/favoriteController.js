const favoriteService = require('../services/favoriteService');

const getFavorites = async (req, res) => {
  try {
    const result = await favoriteService.getFavorites(req.user.sub, req.query.type);
    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ error: 'Eroare server' });
  }
};

const addFavorite = async (req, res) => {
  try {
    const result = await favoriteService.addFavorite(req.user.sub, req.body);
    return res.status(201).json(result);
  } catch (err) {
    if (err.code === 'VALIDATION_ERROR') return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: 'Eroare server' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const result = await favoriteService.removeFavorite(req.user.sub, req.params.placeId);
    return res.status(200).json(result);
  } catch (err) {
    if (err.code === 'NOT_FOUND') return res.status(404).json({ error: err.message });
    return res.status(500).json({ error: 'Eroare server' });
  }
};

const checkFavorites = async (req, res) => {
  try {
    const placeIds = req.body.place_ids || [];
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(200).json(Object.fromEntries(placeIds.map((id) => [id, false])));
    }
    const favIds = await favoriteService.getFavoritePlaceIds(userId);
    const result = Object.fromEntries(placeIds.map((id) => [id, favIds.includes(id)]));
    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ error: 'Eroare server' });
  }
};

const favoriteStatus = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(200).json({ is_favorite: false });
    const status = await favoriteService.isFavorite(userId, req.params.placeId);
    return res.status(200).json({ is_favorite: status });
  } catch {
    return res.status(500).json({ error: 'Eroare server' });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite, checkFavorites, favoriteStatus };
