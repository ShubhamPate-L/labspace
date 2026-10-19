const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { requireAuth } = require('../middleware/auth');

router.get('/me', requireAuth, bookingController.getMyBookings);
router.delete('/:id', requireAuth, bookingController.cancelBooking);

module.exports = router;
