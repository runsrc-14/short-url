// middleware.js
export function validateURL(req, res, next) {
    const { originalUrl } = req.body;
    // Basic URL validation example
    if (!originalUrl || !isValidURL(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }
    next();
  }
  
  function isValidURL(url) {
    // Implement your URL validation logic here
    // This is a basic example; consider using a library for robust URL validation
    return url.startsWith('http://') || url.startsWith('https://');
  }
  