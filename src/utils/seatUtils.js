export function convertSeatsTo2DArray(seats) {
  const maxRow = Math.max(...seats.map((seat) => seat.seatRow));
  const maxCol = Math.max(...seats.map((seat) => seat.seatColumn));

  const grid = Array.from({ length: maxRow }, () =>
    Array.from({ length: maxCol }, () => null)
  );

  for (const seat of seats) {
    const row = seat.seatRow - 1;
    const col = seat.seatColumn - 1;
    grid[row][col] = seat.name;
  }
  return grid;
}

export function convertTicketsTo1DSeatArray(tickets) {
  const result = [];
  if (tickets) {
    tickets.forEach((ticket) => {
      result.push(ticket.seatName);
    });
  }
  return result;
}
