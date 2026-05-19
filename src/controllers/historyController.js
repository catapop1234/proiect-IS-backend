const historyService = require('../services/historyService');

const getHistory = async (req, res) => {
  try {
    const result = await historyService.getHistory(req.user.sub);
    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ error: 'Eroare server' });
  }
};

const saveHistory = async (req, res) => {
  try {
    const result = await historyService.saveSearch(req.user.sub, req.body);
    return res.status(201).json(result);
  } catch (err) {
    if (err.code === 'VALIDATION_ERROR') return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: 'Eroare server' });
  }
};

const clearHistory = async (req, res) => {
  try {
    const result = await historyService.clearHistory(req.user.sub);
    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ error: 'Eroare server' });
  }
};

module.exports = { getHistory, saveHistory, clearHistory };
