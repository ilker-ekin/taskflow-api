// Central error handler: never exposes stack traces to the client.
export default function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'İstek gövdesi geçerli bir JSON değil.' });
  }

  console.error(err);
  res.status(500).json({ error: 'Sunucuda beklenmeyen bir hata oluştu.' });
}
