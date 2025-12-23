"use client"

import { Card } from "antd"
import dayjs from "dayjs"

/* ======================
    SEAT MAP
====================== */
const SeatMap = ({
  seats = [],
  bookedSeats = [],
  scannedSeats = [],
  onSelect,
  selectedTicket,
  showtime,
}) => {
  /* ======================
      RENDER 1 GHẾ
  ====================== */
  const renderSeat = (seatData) => {
    const { name: seat, seatType } = seatData
    const isBooked = bookedSeats.includes(seat)
    const isScanned = scannedSeats.includes(seat)
    const isCouple = seatType === "COUPLE"

    let seatClass =
      "relative rounded-t-lg flex items-center justify-center font-bold text-xs " +
      "before:content-[''] before:absolute before:bottom-[-6px] before:h-2 before:rounded-b-lg " +
      "transition-all select-none h-10 "

    /* ===== SIZE ===== */
    seatClass += isCouple
      ? "flex-[2] min-w-[96px] "
      : "flex-1 min-w-[48px] "

    seatClass += isCouple
      ? "before:left-2 before:right-2 "
      : "before:left-1 before:right-1 "

    /* ===== COLOR ===== */
    if (!isBooked) {
      seatClass += "cursor-not-allowed "
      if (seatType === "VIP") {
        seatClass += "bg-[#a9e36f] text-[#9C2D12] before:bg-[#F8BEAB]"
      } else if (seatType === "COUPLE") {
        seatClass += "bg-[#F6C1E1] text-[#7A1D4F] before:bg-[#E48FC6]"
      } else {
        seatClass += "bg-[#DEF3FF] text-[#0A4C8A] before:bg-[#96C5E7]"
      }
    } else if (isScanned) {
      seatClass += "bg-orange-400 text-white before:bg-orange-600"
    } else {
      seatClass += "bg-gray-400 text-white before:bg-gray-600 cursor-pointer"
    }

    return (
      <div
        key={seat}
        onClick={() => isBooked && onSelect(seat)}
        className={seatClass}
        title={`${seat} - ${seatType}`}
      >
        {seat}
      </div>
    )
  }

  /* ======================
      RENDER 1 ROW
  ====================== */
  const renderRow = (row, rowIndex) => {
    const renderedRow = []
    let col = 0

    while (col < row.length) {
      const seatData = row[col]

      if (!seatData) {
        renderedRow.push(
          <div
            key={`empty-${rowIndex}-${col}`}
            className="flex-1 min-w-[48px]"
          />
        )
        col++
        continue
      }

      renderedRow.push(renderSeat(seatData))
      col += seatData.seatType === "COUPLE" ? 2 : 1
    }

    return renderedRow
  }

  return (
    <div className="flex gap-10 mt-4 items-start w-full">

      {/* ======================
          LEGEND
      ====================== */}
      <div className="flex flex-col gap-4 min-w-[180px]">
        <div className="font-semibold text-lg">Chú thích</div>

        <div>
          <div className="font-medium text-sm mb-2">Loại ghế</div>
          <Legend label="Standard" className="bg-[#DEF3FF] text-[#0A4C8A] before:bg-[#96C5E7]" />
          <Legend label="VIP" className="bg-[#a9e36f] text-[#9C2D12] before:bg-[#F8BEAB]" />
          <Legend label="Couple" className="bg-[#F6C1E1] text-[#7A1D4F] before:bg-[#E48FC6]" />
        </div>

        {bookedSeats.length > 0 && (
          <div className="border-t pt-2">
            <div className="font-medium text-sm mb-2">Trạng thái</div>
            <LegendSimple label="Đã đặt" className="bg-gray-400" />
            <LegendSimple label="Đã quét QR" className="bg-orange-400" />
          </div>
        )}
      </div>

      {/* ======================
          SEAT GRID + AXIS
      ====================== */}
      <div className="flex flex-col flex-1">

        {/* COLUMN HEADER */}
        <div className="flex gap-4 mb-2 ml-8">
          {Array.from({ length: seats[0]?.length || 0 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 min-w-[48px] text-center font-semibold text-sm text-gray-600"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* ROWS */}
        <div className="flex flex-col gap-4">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 items-center">

              {/* ROW LABEL */}
              <div className="w-6 text-center font-semibold text-gray-600">
                {String.fromCharCode(65 + rowIndex)}
              </div>

              {/* SEATS */}
              <div className="flex gap-4 w-full">
                {renderRow(row, rowIndex)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================
          TICKET INFO
      ====================== */}
      {selectedTicket && (
        <Card
          title="Thông tin vé"
          className="font-semibold bg-blue-100/50"
          size="small"
          style={{ minWidth: 300 }}
        >
          <p><strong>Showtime ID:</strong> {showtime.id}</p>
          <p><strong>#Ticket:</strong> {selectedTicket.id}</p>
          <p><strong>Thời gian:</strong> {dayjs(showtime.startTime).format("DD/MM/YYYY HH:mm:ss")}</p>
          <p><strong>Rạp:</strong> {showtime.cinemaName}</p>
          <p><strong>Phòng:</strong> {showtime.room.name}</p>
          <p><strong>Ghế:</strong> {selectedTicket.seatName}</p>
          <p><strong>Giá:</strong> {selectedTicket.price} VND</p>
          <p>
            <strong>QR:</strong>{" "}
            {selectedTicket.isScanned ? (
              <span className="text-green-600 font-semibold">Đã quét</span>
            ) : (
              <span className="text-red-600 font-semibold">Chưa quét</span>
            )}
          </p>
        </Card>
      )}
    </div>
  )
}

/* ======================
    LEGEND
====================== */
const Legend = ({ label, className }) => (
  <div className="flex items-center gap-2 mb-1">
    <div
      className={`relative w-6 h-6 rounded-t before:content-[''] before:absolute before:bottom-[-4px] before:h-2 before:rounded-b ${className}`}
    />
    <span className="text-sm">{label}</span>
  </div>
)

const LegendSimple = ({ label, className }) => (
  <div className="flex items-center gap-2 mb-1">
    <div className={`w-6 h-6 rounded ${className}`} />
    <span className="text-sm">{label}</span>
  </div>
)

export default SeatMap
