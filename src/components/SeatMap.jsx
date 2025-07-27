import { Card } from "antd";
import dayjs from "dayjs";

const SeatMap = ({
  seats = [],
  bookedSeats = [],
  onSelect,
  selectedTicket,
  showtime,
}) => {
  const isSelectedSeatScanned =
    selectedTicket?.isScanned ?? false; // trạng thái quét QR ghế đang chọn

  return (
    <div className="flex gap-10 items-start">
      {/* Legend */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-lg">Chú thích</div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded" />
          <span>Đã đặt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-400 rounded" />
          <span>Chưa đặt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded" />
          <span>Đã quét QR (Vé đã được duyệt)</span>
        </div>
      </div>

      {/* Thông tin vé */}
      {selectedTicket && (
        <Card
          title="Thông tin vé"
          size="small"
          className="max-w-sm flex-shrink-0"
          style={{ minWidth: 300 }}
        >
          <p>
            <strong>Showtime ID:</strong> {showtime.id}
          </p>
          <p>
            <strong>Thời gian bắt đầu chiếu:</strong>{" "}
            {dayjs(showtime.startTime).format("DD/MM/YYYY HH:mm:ss")}
          </p>
          <p>
            <strong>Rạp chiếu:</strong> {showtime.cinemaName}
          </p>
          <p>
            <strong>Phòng chiếu:</strong> {showtime.room.name}
          </p>
          <p>
            <strong>Ghế:</strong> {selectedTicket.seatName}
          </p>
          <p>
            <strong>Giá:</strong> {selectedTicket.price} USD
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {selectedTicket.status ? "Đã đặt" : "Chưa đặt"}
          </p>
          <p>
            <strong>QR Code:</strong>{" "}
            {isSelectedSeatScanned ? (
              <span className="text-green-600 font-semibold">Đã quét</span>
            ) : (
              <span className="text-red-600 font-semibold">Chưa quét</span>
            )}
          </p>
          <p>
            <strong>Khách hàng:</strong> {selectedTicket.customer.firstName}{" "}
            {selectedTicket.customer.lastName}
          </p>
          <p>
            <strong>ID Khách hàng:</strong> {selectedTicket.customer.id}
          </p>
        </Card>
      )}

      {/* Seat Grid */}
      <div className="flex flex-col gap-4">
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {row.map((seat) => {
              const isBooked = bookedSeats.includes(seat);
              // Nếu ghế đang chọn và đã quét thì tô xanh lá
              const isThisSeatSelected = selectedTicket?.seatName === seat;
              const seatIsScanned = isThisSeatSelected && isSelectedSeatScanned;

              let seatClass = `w-12 h-12 rounded flex items-center justify-center font-bold cursor-pointer `;

              if (!isBooked) {
                seatClass += "bg-gray-400 cursor-not-allowed text-black";
              } else if (seatIsScanned) {
                seatClass += "bg-green-500 text-white";
              } else {
                // Ghế đã đặt nhưng chưa quét hoặc không phải ghế đang chọn
                seatClass += "bg-blue-500 text-white";
              }

              return (
                <div
                  key={seat}
                  onClick={() => isBooked && onSelect(seat)}
                  className={seatClass}
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
