const placesService = require('../services/placesService');
const historyService = require('../services/historyService');

const doSearch = (searchType) => async (req, res) => {
  try {
    const { city, page_token } = req.body;
    if (!city && !page_token) {
      return res.status(400).json({ error: 'City este obligatoriu' });
    }

    const query = page_token ? '' : `${searchType} in ${city}`;
    const result = await placesService.searchPlaces(query, page_token);

    result.results.forEach((r) => { r.place_type = searchType; });

    if (req.user && city) {
      historyService.saveSearch(req.user.sub, { city, type: searchType, radius: req.body.radius }).catch(() => {});
    }

    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ error: 'Eroare server' });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const history = await historyService.getHistory(req.user.sub, 3);
    const items = history.items;
    if (!items.length) return res.status(200).json({ results: [] });

    const latest = items[0];
    const result = await placesService.searchPlaces(`${latest.type} in ${latest.city}`);
    result.results.forEach((r) => { r.place_type = latest.type; });

    return res.status(200).json({
      results: result.results,
      based_on: { city: latest.city, type: latest.type },
    });
  } catch {
    return res.status(500).json({ error: 'Eroare server' });
  }
};

const nearbyPlaces = async (req, res) => {
  try {
    const { lat, lng, current_type } = req.body;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat și lng sunt obligatorii' });
    }
    const result = await placesService.getNearbyPlaces({ lat, lng, currentType: current_type });
    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ error: 'Eroare server' });
  }
};

module.exports = { doSearch, getRecommendations, nearbyPlaces };
