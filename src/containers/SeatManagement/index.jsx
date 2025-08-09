import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, message, Select } from "antd";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import {
  fetchShowtimes,
  fetchShowtimeById,
  clearMessages,
  fetchBookedTickets,
  fetchCinemas,
  fetchRoomsByCinema,
} from "./actions";
import {
  selectCinemas,
  selectShowtimes,
  selectRooms,
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
  dayjs.extend(utc);

  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchParams] = useSearchParams();

  const showtimeIdFromQuery = searchParams.get("showtimeId");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [selectedShowtimeId, setSelectedShowtimeId] = useState(
    showtimeIdFromQuery || null
  );

  const cinemas = useSelector(selectCinemas);
  const rooms = useSelector(selectRooms);

  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const messageText = useSelector(selectSuccessMessage);
  const errorText = useSelector(selectFailedMessage);
  const bookedTickets = useSelector(selectBookedTickets) || [];
  const showtime = useSelector(selectShowtime);
  const showtimes = useSelector(selectShowtimes) || [];

  const room = showtime?.room || null;
  const seats = room?.seats || [];

  const isLoading = useSelector(selectIsLoading);

  const arraySeats = useMemo(() => convertSeatsTo2DArray(seats), [seats]);

  const arrayBookedSeats = useMemo(
    () => convertTicketsTo1DSeatArray(bookedTickets),
    [bookedTickets]
  );

  const arrayScannedSeats = useMemo(
    () =>
      convertTicketsTo1DSeatArray(
        bookedTickets.filter((ticket) => ticket.isScanned)
      ),
    [bookedTickets]
  );
  const handleSelectSeat = (seatName) => {
    const ticket = bookedTickets.find((t) => t.seatName === seatName);
    if (ticket) {
      setSelectedTicket(ticket);
    }
  };

  useEffect(() => {
    dispatch(fetchCinemas());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCinemaId) {
      dispatch(fetchRoomsByCinema(selectedCinemaId));
    }
  }, [selectedCinemaId, dispatch]);

  useEffect(() => {
    if (selectedShowtimeId) {
      dispatch(fetchBookedTickets(Number(selectedShowtimeId)));
      dispatch(fetchShowtimeById(Number(selectedShowtimeId)));
    }
  }, [selectedShowtimeId, dispatch]);

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

  console.log("Showtime:", showtime);
  const handleCinemaChange = (cinemaId) => {
    setSelectedCinemaId(cinemaId);
    setSelectedCinemaId(cinemaId);
    setSelectedShowtimeId(null);
    setSelectedDate(null);
    setSelectedRoomId(null);
  };

  const handleRoomChange = (roomId) => {
    setSelectedRoomId(roomId);
    setSelectedShowtimeId(null);
    setSelectedDate(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(dayjs(date).utc(true));
    setSelectedShowtimeId(null);
    if (selectedRoomId && date) {
      dispatch(fetchShowtimes({ startTime: dayjs(date).utc(true), roomId: selectedRoomId }));
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Quản lí vé</h2>
        <div className="mb-4 flex flex-wrap items-end gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Chọn Cinema</label>
            <Select
              placeholder="Chọn rạp"
              style={{ width: 180 }}
              value={selectedCinemaId}
              onChange={handleCinemaChange}
              allowClear
              options={cinemas.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Chọn Room</label>
            <Select
              placeholder="Chọn phòng"
              style={{ width: 180 }}
              value={selectedRoomId}
              onChange={handleRoomChange}
              allowClear
              disabled={!selectedCinemaId}
              options={rooms.map((r) => ({
                label: r.name,
                value: r.id,
              }))}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Chọn ngày</label>
            <DatePicker
              style={{ width: 180 }}
              value={selectedDate}
              onChange={handleDateChange}
              allowClear
              format="DD-MM-YYYY"
              disabled={!selectedRoomId}
              placeholder="Chọn ngày chiếu"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Chọn Showtime</label>
            <Select
              placeholder="Chọn suất chiếu"
              style={{ width: 580 }}
              value={selectedShowtimeId}
              onChange={(value) => setSelectedShowtimeId(value)}
              disabled={!selectedRoomId || !selectedDate}
              options={showtimes.map((s) => ({
                label: `Thời gian: ${dayjs(s.startTime).format(
                  "HH:mm"
                )} - ${dayjs(s.endTime).format("HH:mm")} | Phim: ${
                  s.movie.title
                }`,
                value: s.id,
              }))}
              allowClear
            />
          </div>
        </div>
        {selectedShowtimeId && (
          <SeatMap
            seats={arraySeats}
            bookedSeats={arrayBookedSeats}
            scannedSeats={arrayScannedSeats}
            onSelect={handleSelectSeat}
            selectedTicket={selectedTicket}
            showtime={showtime}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default SeatManagement;
