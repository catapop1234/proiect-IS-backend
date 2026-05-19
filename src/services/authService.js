const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../utils/jwt');

const prisma = new PrismaClient();

const signup = async ({ email, password, passwordConfirm, name }) => {
  if (!email || !password || !name) {
    throw Object.assign(new Error('Câmpuri obligatorii lipsă'), { code: 'VALIDATION_ERROR' });
  }
  if (password !== passwordConfirm) {
    throw Object.assign(new Error('Parolele nu coincid'), { code: 'VALIDATION_ERROR' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw Object.assign(new Error('Email deja înregistrat'), { code: 'CONFLICT' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  const token = generateToken(user);
  const { password: _, ...record } = user;
  return { token, record };
};

const signin = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw Object.assign(new Error('Credențiale invalide'), { code: 'INVALID_CREDENTIALS' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw Object.assign(new Error('Credențiale invalide'), { code: 'INVALID_CREDENTIALS' });
  }

  const token = generateToken(user);
  const { password: _, ...record } = user;
  return { token, record };
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  if (!user) throw Object.assign(new Error('Utilizator negăsit'), { code: 'NOT_FOUND' });
  return { record: user };
};

const updateUser = async (userId, data) => {
  const updateData = {};
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.password && data.passwordConfirm) {
    if (data.password !== data.passwordConfirm) {
      throw Object.assign(new Error('Parolele nu coincid'), { code: 'VALIDATION_ERROR' });
    }
    updateData.password = await bcrypt.hash(data.password, 12);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, email: true, name: true, createdAt: true },
  });
  return { record: user };
};

module.exports = { signup, signin, getMe, updateUser };
