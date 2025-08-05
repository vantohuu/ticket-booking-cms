import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, message } from "antd";
import {
  fetchSeatsByRoom,
  fetchShowtimeById,
  clearMessages,
  fetchBookedTickets,
} from "./actions";
import {
  selectSeats,
  selectBookedTickets,
  selectShowtime,
  selectIsLoading,
  selectSuccessMessage,
  selectFailedMessage,
} from "./selectors";
import PageLayout from "../../layouts/PageLayout";
import Loading from "../../components/Loading";
import SeatMap from "../../components/SeatMap";
import {
  convertSeatsTo2DArray,
  convertTicketsTo1DSeatArray,
} from "../../utils/seatUtils";
import { useSearchParams, useNavigate } from "react-router-dom";

const SeatManagement = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roomIdFromQuery = searchParams.get("roomId");
  const showtimeIdFromQuery = searchParams.get("showtimeId");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [showtimeIdInput, setShowtimeIdInput] = useState(
    showtimeIdFromQuery || ""
  );

  const [selectedRoomId, setSelectedRoomId] = useState(roomIdFromQuery || null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(
    showtimeIdFromQuery || null
  );

  const messageText = useSelector(selectSuccessMessage);
  const errorText = useSelector(selectFailedMessage);
  const bookedTickets = useSelector(selectBookedTickets) || [];
  const showtime = useSelector(selectShowtime);
  const room = showtime?.room || null;
  const seats = room?.seats || [];

  const isLoading = useSelector(selectIsLoading);

  const arraySeats = useMemo(() => convertSeatsTo2DArray(seats), [seats]);

  const arrayBookedSeats = useMemo(
    () => convertTicketsTo1DSeatArray(bookedTickets),
    [bookedTickets]
  );

  const arrayScannedSeats = useMemo(() =>
    convertTicketsTo1DSeatArray(
      bookedTickets.filter(ticket => ticket.isScanned)
    ),
    [bookedTickets]
  );
  console.log("scannedSeats:", arrayScannedSeats);

  console.log("Booked Tickets:", bookedTickets);
  const handleSelectSeat = (seatName) => {
    const ticket = bookedTickets.find((t) => t.seatName === seatName);
    if (ticket) {
      setSelectedTicket(ticket);
    }
  };

  // Khi state filter chính thay đổi thì gọi API
  useEffect(() => {
    if (selectedShowtimeId) {
      dispatch(fetchBookedTickets(Number(selectedShowtimeId)));
      dispatch(fetchShowtimeById(Number(selectedShowtimeId)));
    }
  }, [selectedRoomId, selectedShowtimeId, dispatch]);

  useEffect(() => {
    if (messageText) {
      message.success(messageText);
      dispatch(clearMessages());
    }
  }, [messageText, dispatch]);

  useEffect(() => {
    if (errorText) {
      message.error(errorText);
      dispatch(clearMessages());
    }
  }, [errorText, dispatch]);

  if (isLoading) return <Loading />;

  const handleSearch = () => {
    const showtimeId = showtimeIdInput.trim();

    // Cập nhật state
    setSelectedShowtimeId(showtimeId ? Number(showtimeId) : null);

    // Cập nhật URL
    const queryParams = new URLSearchParams();
    if (showtimeId) queryParams.set("showtimeId", showtimeId);

    navigate(`?${queryParams.toString()}`);
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Quản lí vé</h2>
        <div className="mb-4 flex items-end gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Showtime ID</label>
            <Input
              type="number"
              placeholder="Nhập Showtime ID"
              value={showtimeIdInput}
              onChange={(e) => setShowtimeIdInput(e.target.value)}
              style={{ width: 180 }}
              allowClear
            />
          </div>

          <Button type="primary" onClick={handleSearch}>
            Tìm
          </Button>
        </div>

        <SeatMap
          seats={arraySeats}
          bookedSeats={arrayBookedSeats}
          scannedSeats={arrayScannedSeats}
          onSelect={handleSelectSeat}
          selectedTicket={selectedTicket}
          showtime={showtime}
        />
      </div>
    </PageLayout>
  );
};

export default SeatManagement;
