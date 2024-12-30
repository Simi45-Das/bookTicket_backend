const { fetchSeats, bookSeats, cancelSeats, resetAllSeats, updateSeatCounts, getSeatCountsFromDB } = require("../services/seat");

async function getSeatsController(req, res) {
  console.log("Fetching seats for user:", req.user ? req.user.id : "Anonymous");
  try {
    const seats = await fetchSeats();
    res.json(seats);
  } catch (err) {
    console.error("Error fetching seats:", err);
    res.status(500).send(err.message);
  }
}

async function bookSeatsController(req, res) {
  try {
    console.log(`Booking seats for user ${req.user.id}:`, req.body.seatsRequested);
    const seatIds = await bookSeats(req.body.seatsRequested, req.user.id);
    await updateSeatCounts(); 
    res.send(`Seats ${seatIds.join(", ")} booked successfully`);
  } catch (err) {
    console.error("Error booking seats:", err);
    res.status(400).send(err.message);
  }
}

async function cancelSeatsController(req, res) {
  try {
    console.log(`Canceling seats for user ${req.user.id}:`, req.body.seatsToCancel);
    const seatIds = await cancelSeats(req.body.seatsToCancel, req.user.id);
    await updateSeatCounts(); 
    res.send(`Seats ${seatIds.join(", ")} canceled successfully`);
  } catch (err) {
    console.error("Error canceling seats:", err);
    res.status(400).send(err.message);
  }
}

async function resetSeatsController(req, res) {
  try {
    console.log("Resetting all seats");
    await resetAllSeats();
    await updateSeatCounts(); 
    res.send("Seats reset successfully");
  } catch (err) {
    console.error("Error resetting seats:", err);
    res.status(500).send(err.message);
  }
}

async function getSeatCounts(req, res) {
  try {
    const seatCounts = await getSeatCountsFromDB();
    res.json(seatCounts); 
  } catch (err) {
    console.error("Error fetching seat counts:", err);
    res.status(500).send(err.message);
  }
}

module.exports = { getSeatsController, bookSeatsController, cancelSeatsController, resetSeatsController, getSeatCounts };
