const SeatMap = ({ seats = [], bookedSeats = [], onSelect }) => {
  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded" />
          <span>Đã đặt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-400 rounded" />
          <span>Chưa đặt</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="grid gap-4">
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {row.map((seat) => {
              const isBooked = bookedSeats.includes(seat);
              return (
                <div
                  key={seat}
                  onClick={() => isBooked && onSelect(seat)}
                  className={`w-12 h-12 rounded flex items-center justify-center font-bold cursor-pointer
                    ${isBooked ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"}
                  `}
                >
                  {seat}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatMap;
