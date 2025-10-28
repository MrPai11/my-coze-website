// api/test.js
export default async (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date().toISOString() });
};
