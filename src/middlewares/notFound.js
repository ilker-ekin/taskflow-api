export default function notFound(req, res) {
  res.status(404).json({ error: `İstenen adres bulunamadı: ${req.method} ${req.originalUrl}` });
}
