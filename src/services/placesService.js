const axios = require('axios');

const PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

const transformPlace = (place, placeType = null) => {
  const result = {
    place_id: place.place_id,
    name: place.name,
    address: place.formatted_address,
  };
  if (placeType) result.place_type = placeType;
  if (place.geometry?.location) result.location = place.geometry.location;
  if (place.rating !== undefined) result.rating = place.rating;
  if (place.user_ratings_total !== undefined) result.user_ratings_total = place.user_ratings_total;
  if (place.price_level !== undefined) result.price_level = place.price_level;
  if (place.photos?.length) result.photos = place.photos.slice(0, 5);
  if (place.geometry) result.geometry = place.geometry;
  if (place.opening_hours) result.opening_hours = place.opening_hours;
  if (place.website) result.website = place.website;
  if (place.formatted_phone_number) result.formatted_phone_number = place.formatted_phone_number;
  if (place.url) result.url = place.url;
  return result;
};

const searchPlaces = async (query, pageToken = null) => {
  const apiKey = process.env.PLACES_API_KEY;
  const params = { key: apiKey, query };
  if (pageToken) {
    params.pagetoken = pageToken;
  } else {
    params.language = 'en';
  }

  try {
    const resp = await axios.get(`${PLACES_BASE_URL}/textsearch/json`, { params, timeout: 10000 });
    const data = resp.data;
    if (data.status === 'OK') {
      return {
        results: data.results.map((p) => transformPlace(p)),
        next_page_token: data.next_page_token || null,
      };
    }
    return { results: [], error: data.status };
  } catch (err) {
    return { results: [], error: err.message };
  }
};

const getPlaceDetails = async (placeId) => {
  const apiKey = process.env.PLACES_API_KEY;
  const params = {
    key: apiKey,
    placeid: placeId,
    fields: 'place_id,name,formatted_address,geometry,rating,user_ratings_total,price_level,photos,opening_hours,website,formatted_phone_number,url,types',
    language: 'en',
  };

  const resp = await axios.get(`${PLACES_BASE_URL}/details/json`, { params, timeout: 10000 });
  const data = resp.data;
  if (data.status === 'OK' && data.result) {
    return transformPlace(data.result);
  }
  throw Object.assign(new Error(data.status || 'Locul nu a fost găsit'), { code: 'NOT_FOUND' });
};

const getNearbyPlaces = async ({ lat, lng, currentType }) => {
  const apiKey = process.env.PLACES_API_KEY;
  const complementary = {
    hotel: 'tourist attractions', hotels: 'tourist attractions',
    restaurant: 'hotels', restaurants: 'hotels',
    tourist_attraction: 'hotels', attractions: 'hotels',
  };
  const queryType = complementary[currentType] || 'hotels';

  const params = {
    key: apiKey,
    location: `${lat},${lng}`,
    radius: 5000,
    type: queryType.replace(' ', '_'),
    language: 'en',
  };

  const resp = await axios.get(`${PLACES_BASE_URL}/nearbysearch/json`, { params, timeout: 10000 });
  const data = resp.data;
  if (data.status === 'OK') {
    return {
      results: data.results.slice(0, 10).map((p) => transformPlace(p, queryType)),
      type: queryType,
    };
  }
  return { results: [], error: data.status };
};

module.exports = { searchPlaces, getPlaceDetails, getNearbyPlaces };
