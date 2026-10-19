const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');

const getMyBookings = async (req, res) => {
  try {
    const userId = req.session.userId;
    const bookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'equipment',
        select: 'name equipmentId lab',
        populate: {
          path: 'lab',
          select: 'name wing'
        }
      });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.session.userId;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only cancel your own bookings' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    if (booking.date < todayStr) {
      return res.status(400).json({ success: false, message: 'Cannot cancel a booking in the past' });
    }

    booking.status = 'cancelled';
    booking.isActive = false;
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getMyBookings,
  cancelBooking
};
