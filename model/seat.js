const connectToDB = require("../config/dbconfig");

async function getAllSeats() {
  const connection = await connectToDB();
  try {
    const [seats] = await connection.execute("SELECT * FROM seats ORDER BY seat_number");
    return seats;
  } catch (error) {
    console.error("Database error while fetching seats:", error);
    throw new Error("Error fetching seats from database");
  } finally {
    await connection.end();
  }
}

async function getAvailableSeats() {
  const connection = await connectToDB();
  try {
    const [availableSeats] = await connection.execute("SELECT * FROM seats WHERE is_booked = FALSE ORDER BY seat_number");
    return availableSeats;
  } catch (error) {
    console.error("Database error while fetching available seats:", error);
    throw new Error("Error fetching available seats");
  } finally {
    await connection.end();
  }
}

async function getUserBookedSeats(userId) {
  const connection = await connectToDB();
  try {
    const [userSeats] = await connection.execute("SELECT * FROM seats WHERE booked_by = ? ORDER BY seat_number", [userId]);
    return userSeats;
  } catch (error) {
    console.error(`Database error fetching booked seats for user ${userId}:`, error);
    throw new Error("Error fetching user's booked seats");
  } finally {
    await connection.end();
  }
}

async function updateSeats(seatIds, userId) {
  const connection = await connectToDB();
  const placeholders = seatIds.map(() => "?").join(", ");
  try {
    await connection.execute(`UPDATE seats SET is_booked = TRUE, booked_by = ? WHERE id IN (${placeholders})`, [userId, ...seatIds]);
  } catch (error) {
    console.error(`Database error while booking seats for user ${userId}:`, error);
    throw new Error("Error updating seat status");
  } finally {
    await connection.end();
  }
}

async function cancelUserSeats(seatIds, userId) {
  const connection = await connectToDB();
  const placeholders = seatIds.map(() => "?").join(", ");
  try {
    await connection.execute(`UPDATE seats SET is_booked = FALSE, booked_by = NULL WHERE id IN (${placeholders}) AND booked_by = ?`, [...seatIds, userId]);
  } catch (error) {
    console.error(`Database error while canceling seats for user ${userId}:`, error);
    throw new Error("Error canceling seats");
  } finally {
    await connection.end();
  }
}

async function resetSeats() {
  const connection = await connectToDB();
  try {
    await connection.execute("TRUNCATE TABLE seats");
    const seats = [];
    for (let i = 1; i <= 80; i++) {
      seats.push([i, false, null]);
    }
    await connection.query("INSERT INTO seats (seat_number, is_booked, booked_by) VALUES ?", [seats]);
  } catch (error) {
    console.error("Database error while resetting seats:", error);
    throw new Error("Error resetting seats in the database");
  } finally {
    await connection.end();
  }
}

async function updateSeatCountsInDB() {
  const connection = await connectToDB();
  try {
    const [[{ available_count }]] = await connection.execute("SELECT COUNT(*) AS available_count FROM seats WHERE is_booked = FALSE");
    const [[{ reserved_count }]] = await connection.execute("SELECT COUNT(*) AS reserved_count FROM seats WHERE is_booked = TRUE");
    return { available_count, reserved_count };
  } catch (error) {
    console.error("Database error while updating seat counts:", error);
    throw new Error("Error updating seat counts");
  } finally {
    await connection.end();
  }
}

module.exports = { getAllSeats, getAvailableSeats, getUserBookedSeats, updateSeats, cancelUserSeats, resetSeats, updateSeatCountsInDB };
