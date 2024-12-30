const connectToDB = require("../config/dbconfig");

const { getAllSeats, getAvailableSeats, getUserBookedSeats, updateSeats, cancelUserSeats, resetSeats, updateSeatCountsInDB } = require("../model/seat");

async function fetchSeats() {
  return await getAllSeats();
}



async function bookSeats(seatsRequested, userId) {


  seatsRequested = parseInt(seatsRequested);

  if (seatsRequested < 1 || seatsRequested > 7)
    return res.status(400).send("You can book between 1 and 7 seats");

  try {
    const connection = await connectToDB();
    const [availableSeats] = await connection.execute(
      "SELECT * FROM seats WHERE is_booked = FALSE ORDER BY seat_number"
    );

    if (availableSeats.length < seatsRequested) {
      await connection.end();
      return res.status(400).send("Not enough seats available");
    }

   
    const rows = {};
    availableSeats.forEach((seat) => {
      const row = Math.ceil(seat.seat_number / 7); 
      if (!rows[row]) rows[row] = [];
      rows[row].push(seat);
    });

    let booking = [];

    
    for (const row of Object.values(rows)) {
      if (row.length >= seatsRequested) {
        booking = row.slice(0, seatsRequested); 
        break;
      }
    }

  
    if (booking.length < seatsRequested) {
      let closestSeats = [];
      for (let i = 0; i < availableSeats.length; i++) {
       
        let currentBooking = [availableSeats[i]];
        for (let j = i + 1; j < availableSeats.length; j++) {
          
          if (
            currentBooking.length < seatsRequested &&
            availableSeats[j].seat_number ===
              currentBooking[currentBooking.length - 1].seat_number + 1
          ) {
            currentBooking.push(availableSeats[j]);
          }
        }
        
        if (
          currentBooking.length === seatsRequested &&
          (closestSeats.length === 0 ||
            currentBooking[0].seat_number < closestSeats[0].seat_number)
        ) {
          closestSeats = currentBooking;
        }
      }
      booking = closestSeats;
    }

    
    if (booking.length < seatsRequested) {
      booking = availableSeats.slice(0, seatsRequested);
    }

    const seatIds = booking.map((seat) => seat.id);
    const placeholders = seatIds.map(() => "?").join(", "); 
    const query = `UPDATE seats SET is_booked = TRUE, booked_by = ? WHERE id IN (${placeholders})`;

    
    await connection.execute(query, [userId, ...seatIds]);
    await connection.end();

   

    return seatIds;
  } catch (err) {
    
    throw err;
  }

}


async function cancelSeats(seatsToCancel, userId) {
  if (seatsToCancel < 1) {
    throw new Error("You must cancel at least one seat");
  }

  const userBookedSeats = await getUserBookedSeats(userId);
  if (seatsToCancel > userBookedSeats.length) {
    throw new Error("You cannot cancel more seats than you have booked");
  }

  const seatIds = userBookedSeats.slice(0, seatsToCancel).map((seat) => seat.id);
  await cancelUserSeats(seatIds, userId);

  return seatIds;
}

async function resetAllSeats() {
  await resetSeats();
}

async function updateSeatCounts() {
  await updateSeatCountsInDB();
}

async function getSeatCountsFromDB() {
  return await updateSeatCountsInDB(); 
}

module.exports = { fetchSeats, bookSeats, cancelSeats, resetAllSeats, updateSeatCounts, getSeatCountsFromDB };
