import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Input, message } from "antd";
import dayjs from "dayjs";
import {
  fetchShowtimes,
  fetchCinemas,
  fetchMovies,
  deleteShowtime,
  showBeginEditModal,
  clearMessages,
} from "./actions";
import {
  selectShowtimes,
  selectIsLoading,
  selectSuccessMessage,
  selectFailedMessage,
} from "./selectors";
import PageLayout from "../../layouts/PageLayout";
import AddEditShowtime from "./AddEditPage";
import Loading from "../../components/Loading";

const BASE_URL = process.env.REACT_APP_URL || "http://localhost:3000/";

const ShowtimeList = () => {
  const dispatch = useDispatch();
  const [modalType, setModalType] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [searchText, setSearchText] = useState("");
  const messageText = useSelector(selectSuccessMessage);
  const errorText = useSelector(selectFailedMessage);
  const showtimes = useSelector(selectShowtimes) || [];
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(fetchShowtimes());
    dispatch(fetchCinemas());
    dispatch(fetchMovies());
  }, []);

  useEffect(() => {
    if (messageText) {
      message.success(messageText);
      dispatch(clearMessages());
    }
  }, [messageText]);

  useEffect(() => {
    if (errorText) {
      message.error(errorText);
      dispatch(clearMessages());
    }
  }, [errorText]);

  const handleAddClick = () => {
    setModalType("create");
    setSelectedShowtime(null);
    dispatch(showBeginEditModal());
  };

  const handleEditClick = (showtime) => {
    setModalType("edit");
    setSelectedShowtime(showtime);
    dispatch(showBeginEditModal());
  };

  const handleDeleteClick = (showtime) => {
    dispatch(deleteShowtime(showtime.id));
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "5%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Phim",
      key: "movieTitle",
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.movie?.title?.toLowerCase().includes(value),
      sorter: (a, b) => a.movie?.title?.localeCompare(b.movie?.title),
      width: "20%",
      render: (text, record) => record.movie?.title || "N/A",
    },
    {
      title: "Rạp chiếu",
      dataIndex: "cinemaName",
      key: "cinemaName",
      sorter: (a, b) => a.cinemaName.localeCompare(b.cinemaName),
      width: "15%",
      render: (text, record) => record.cinemaName || "N/A",
    },
    {
      title: "Phòng chiếu",
      dataIndex: "roomName",
      key: "roomName",
      sorter: (a, b) => a.roomName.localeCompare(b.roomName),
      width: "15%",
      render: (text, record) => record.room?.name || "N/A",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      sorter: (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      width: "10%",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Giá vé",
      dataIndex: "ticketPrice",
      key: "ticketPrice",
      sorter: (a, b) => a.ticketPrice - b.ticketPrice,
      width: "10%",
    },
    {
      title: "Quản lí vé",
      dataIndex: "id",
      key: "id",
      width: "30%",
      render: (_, showtime) => (
        <a
          href={`${BASE_URL}seat-management?showtimeId=${showtime.id}`}
          target="_blank"
        >
          Xem trạng thái vé phòng chiếu
        </a>
      ),
    },
    {
      title: "Sửa",
      key: "edit",
      width: "5%",
      render: (_, showtime) => (
        <Button onClick={() => handleEditClick(showtime)}>Sửa</Button>
      ),
    },
    {
      title: "Xóa",
      key: "delete",
      width: "5%",
      render: (_, showtime) => (
        <Button danger onClick={() => handleDeleteClick(showtime)}>
          Xóa
        </Button>
      ),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <PageLayout>
      <div>
        <h2 className="text-xl font-bold mb-4">Danh sách suất chiếu</h2>
        <div className="mb-4">
          <Input.Search
            placeholder="Tìm theo tên phim"
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
            style={{ width: 300, marginRight: 16 }}
            allowClear
          />
          <Button type="primary" onClick={handleAddClick}>
            Thêm suất chiếu
          </Button>
        </div>

        <Table bordered columns={columns} dataSource={showtimes} rowKey="id" />
        <AddEditShowtime type={modalType} showtime={selectedShowtime} />
      </div>
    </PageLayout>
  );
};

export default ShowtimeList;
