import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Input, message } from "antd";
import {convertSeatsTo2DArray, convertSeatsTo1DArray} from "../../utils/seatUtils";
import {
  fetchSeatsByRoom,
  clearMessages,
  fetchBookedTickets
} from "./actions";
import {
  selectSeats,
  selectBookedTickets,
  selectIsLoading,
  selectSuccessMessage,
  selectFailedMessage,
} from "./selectors";
import PageLayout from "../../layouts/PageLayout";
import Loading from "../../components/Loading";
import SeatMap from "../../components/SeatMap";
import { useSearchParams } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_URL || "http://localhost:3000/";

const SeatManagement = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const roomIdFromQuery = searchParams.get("roomId");
  const showtimeIdFromQuery = searchParams.get("showtimeId");

  const [selectedRoomId, setSelectedRoomId] = useState(
    roomIdFromQuery ? Number(roomIdFromQuery) : null
  );
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(
    showtimeIdFromQuery ? Number(showtimeIdFromQuery) : null
  );
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchText, setSearchText] = useState("");
  const messageText = useSelector(selectSuccessMessage);
  const errorText = useSelector(selectFailedMessage);
  const seats = useSelector(selectSeats) || [];
  const bookedTickets = useSelector(selectBookedTickets) || [];

  const arraySeats = useMemo(() => {
    return convertSeatsTo2DArray(seats);
  }, [seats]);
  const arrayBookedSeats = useMemo(() => {
    return convertSeatsTo1DArray(bookedTickets);
  }, [bookedTickets]);

  const isLoading = useSelector(selectIsLoading);
  useEffect(() => {
    dispatch(fetchSeatsByRoom(selectedRoomId));
    dispatch(fetchBookedTickets(selectedShowtimeId));
  }, []);

 useEffect(() => {
  if (messageText != null && messageText !== "") {
    message.success(messageText);
    dispatch(clearMessages());
  }
}, [messageText]);

useEffect(() => {
  if (errorText != null && errorText !== "") {
    message.error(errorText);
    dispatch(clearMessages());
  }
}, [errorText]);

  if (isLoading) return <Loading />;

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Quản lí vé</h2>
        <SeatMap seats={arraySeats} bookedSeats={arrayBookedSeats} />
      </div>
    </PageLayout>
  );
};

export default SeatManagement;
