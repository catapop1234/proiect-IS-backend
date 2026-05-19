const placesService = require('../services/placesService');
const axios = require('axios');

const getDetails = async (req, res) => {
  try {
    const result = await placesService.getPlaceDetails(req.params.placeId);
    return res.status(200).json(result);
  } catch (err) {
    if (err.code === 'NOT_FOUND') return res.status(404).json({ error: err.message });
    return res.status(500).json({ error: 'Eroare server' });
  }
};

const getPhoto = async (req, res) => {
  const { reference, max_width = 400 } = req.query;
  if (!reference) return res.status(400).json({ error: 'reference este obligatoriu' });

  try {
    const resp = await axios.get('https://maps.googleapis.com/maps/api/place/photo', {
      params: { key: process.env.PLACES_API_KEY, maxwidth: max_width, photoreference: reference },
      responseType: 'arraybuffer',
      timeout: 10000,
    });
    res.set('Content-Type', 'image/jpeg');
    return res.status(200).send(resp.data);
  } catch {
    return res.status(500).json({ error: 'Nu s-a putut obține fotografia' });
  }
};

module.exports = { getDetails, getPhoto };
