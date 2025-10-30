// Last-resort middleware: converts unmatched routes into a JSON 404.
export default function notFound(_req, res) {
  res.status(404).json({ message: 'Not found' });
}
