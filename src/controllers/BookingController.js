const Booking = require("../models/Booking");

module.exports = {
  async store(req, res) {
    const { date } = req.body;
    const { user_id } = req.headers;
    const { spot_id } = req.params;

    const booking = await Booking.create({
      user: user_id,
      spot: spot_id,
      date
    });

    await booking
      .populate("spot")
      .populate("user")
      .execPopulate();

    const ownerSocket = req.connectedUsers[booking.spot.user];

    console.log("Booking: ", booking);
    console.log("Owner: ", ownerSocket);
    console.log("Users: ", req.connectedUsers);

    if (ownerSocket) {
      req.io.to(ownerSocket).emit("booking_request", booking);
    }

    return res.json(booking);
  }
};
