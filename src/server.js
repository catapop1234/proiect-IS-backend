const app = require('./app');

const PORT = process.env.PORT || 3099;

app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
