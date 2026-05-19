const authService = require('../services/authService');

const signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    return res.status(201).json(result);
  } catch (err) {
    if (err.code === 'VALIDATION_ERROR') return res.status(400).json({ error: err.message });
    if (err.code === 'CONFLICT') return res.status(409).json({ error: err.message });
    return res.status(500).json({ error: 'Eroare server' });
  }
};

const signin = async (req, res) => {
  try {
    const result = await authService.signin(req.body);
    return res.status(200).json(result);
  } catch (err) {
    if (err.code === 'INVALID_CREDENTIALS') return res.status(401).json({ error: err.message });
    return res.status(500).json({ error: 'Eroare server' });
  }
};

const me = async (req, res) => {
  try {
    const result = await authService.getMe(req.user.sub);
    return res.status(200).json(result);
  } catch (err) {
    if (err.code === 'NOT_FOUND') return res.status(404).json({ error: err.message });
    return res.status(500).json({ error: 'Eroare server' });
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await authService.updateUser(req.user.sub, req.body);
    return res.status(200).json(result);
  } catch (err) {
    if (err.code === 'VALIDATION_ERROR') return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: 'Eroare server' });
  }
};

module.exports = { signup, signin, me, updateUser };
