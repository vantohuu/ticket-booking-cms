import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Input, message } from "antd";
import {convertSeatsTo2DArray} from "../../utils/seatUtils";
import {
  fetchSeatsByRoom,
  showBeginEditModal,
  clearMessages,
} from "./actions";
import {
  selectSeats,
  selectIsLoading,
  selectSuccessMessage,
  selectFailedMessage,
} from "./selectors";
import PageLayout from "../../layouts/PageLayout";
import Loading from "../../components/Loading";
import SeatMap from "../../components/SeatMap";
import { useSearchParams } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_URL || "http://localhost:3000/";

const SeatMapByRoom = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [modalType, setModalType] = useState(null);
  const roomIdFromQuery = searchParams.get("roomId");
  const [selectedRoomId, setSelectedRoomId] = useState(
    roomIdFromQuery ? Number(roomIdFromQuery) : null
  );
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchText, setSearchText] = useState("");
  const messageText = useSelector(selectSuccessMessage);
  const errorText = useSelector(selectFailedMessage);
  const seats = useSelector(selectSeats) || [];
  console.log("Seats:", seats);

  const arraySeats = useMemo(() => {
    return convertSeatsTo2DArray(seats);
  }, [seats]);

  const isLoading = useSelector(selectIsLoading);
  useEffect(() => {
    dispatch(fetchSeatsByRoom(selectedRoomId));
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
        <h2 className="text-xl font-bold mb-4">Sơ đồ ghế</h2>
        <SeatMap seats={arraySeats} />
      </div>
    </PageLayout>
  );
};

export default SeatMapByRoom;
