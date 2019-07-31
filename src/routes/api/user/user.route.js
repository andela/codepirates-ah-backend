import express from 'express';

const router = express.Router();

router.post('/signin', (req, res) => {
  const { firstname, lastname } = req.body;
  return res.status(200).json({ status: 200, data: { firstname, lastname } });
});
export default router;
