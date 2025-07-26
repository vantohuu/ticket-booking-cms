export function convertSeatsTo2DArray(seats) {
  const seatMap = {};

  seats.forEach(seat => {
    console.log(seat)
    const row = seat.name[0]; 
    if (!seatMap[row]) {
      seatMap[row] = [];
    }
    seatMap[row].push(seat.name);
  });

  const sortedRows = Object.keys(seatMap).sort();
  const result = sortedRows.map(row => seatMap[row].sort((a, b) => {
    const numA = parseInt(a.slice(1));
    const numB = parseInt(b.slice(1));
    return numA - numB;
  }));

  return result;
}

export function convertSeatsTo1DArray(seats) {
  const result = [];
  if (seats)
  {
    seats.forEach(seat => {
      result.push(seat.name);
    });
  }
  return result;
}