import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Input, message, Select } from "antd";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  fetchRooms,
  fetchCinemas,
  showBeginEditModal,
  deleteRoom,
  clearMessages,
} from "./actions";
import {
  selectRooms,
  selectCinemas,
  selectIsLoading,
  selectSuccessMessage,
  selectFailedMessage,
} from "./selectors"; // cần có selectCinemas
import PageLayout from "../../layouts/PageLayout";
import AddEditRoom from "./AddEditPage";
import Loading from "../../components/Loading";
import SeatMap from "../../components/SeatMap";
const { Option } = Select;
const BASE_URL = process.env.REACT_APP_URL || "http://localhost:3000/";

const RoomList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cinemaIdFromQuery = searchParams.get("cinemaId");
  const [modalType, setModalType] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedCinemaId, setSelectedCinemaId] = useState(
    cinemaIdFromQuery ? Number(cinemaIdFromQuery) : null
  );
  const rooms = useSelector(selectRooms) || [];
  const cinemas = useSelector(selectCinemas) || []; 
  const messageText = useSelector(selectSuccessMessage);
  const errorText = useSelector(selectFailedMessage);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(fetchRooms());
    dispatch(fetchCinemas());
  }, [dispatch]);

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

  const handleAddClick = () => {
    setModalType("add");
    setSelectedRoom(null);
    dispatch(showBeginEditModal());
  };

  const handleEditClick = (room) => {
    setModalType("edit");
    setSelectedRoom(room);
    dispatch(showBeginEditModal());
  };

  const handleDeleteClick = (room) => {
    dispatch(deleteRoom(room.id));
  };

  const handleCinemaChange = (value) => {
    setSelectedCinemaId(value);
    const params = new URLSearchParams();
    if (value !== null) {
      params.set("cinemaId", value);
    }
    navigate(`?${params.toString()}`);
  };
  const cinemaIdToName = useMemo(() => {
    const map = {};
    cinemas.forEach((cinema) => {
      map[cinema.id] = cinema.name;
    });
    return map;
  }, [cinemas]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchName = room.name.toLowerCase().includes(searchText);
      const matchCinema =
        selectedCinemaId === null || room.cinemaId === selectedCinemaId;
      return matchName && matchCinema;
    });
  }, [rooms, searchText, selectedCinemaId]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
      width: "30%",
    },
    {
      title: "Số ghế",
      dataIndex: "totalSeats",
      key: "totalSeats",
      sorter: (a, b) => a.totalSeats - b.totalSeats,
      width: "15%",
    },
    {
      title: "Tên rạp",
      dataIndex: "cinemaId",
      key: "cinemaName",
      render: (cinemaId) => cinemaIdToName[cinemaId] || "Không rõ",
      filters: cinemas.map((c) => ({ text: c.name, value: c.id })),
      onFilter: (value, record) => record.cinemaId === value,
      width: "20%",
    },
    {
      title: "Sơ đồ ghế",
      dataIndex: "id",
      key: "id",
      width: "10%",
      render: (_, room) => (
        <a href={`${BASE_URL}seat-map?roomId=${room.id}`} target="_blank">
          Xem sơ đồ ghế
        </a>
      ),
    },
    {
      title: "Sửa",
      key: "edit",
      width: "7.5%",
      render: (_, room) => (
        <Button onClick={() => handleEditClick(room)}>Sửa</Button>
      ),
    },
    {
      title: "Xóa",
      key: "delete",
      width: "7.5%",
      render: (_, room) => (
        <Button danger onClick={() => handleDeleteClick(room)}>
          Xóa
        </Button>
      ),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <PageLayout>
      <div>
        <h2 className="text-xl font-bold mb-4">Danh sách phòng chiếu</h2>
        <div className="mb-4 flex gap-4 items-center flex-wrap">
          <Input.Search
            placeholder="Tìm theo tên phòng"
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            placeholder="Lọc theo rạp"
            onChange={handleCinemaChange}
            allowClear
            style={{ width: 200 }}
            value={selectedCinemaId} 
          >
            <Option value={null}>Tất cả rạp</Option>
            {cinemas.map((cinema) => (
              <Option key={cinema.id} value={cinema.id}>
                {cinema.name}
              </Option>
            ))}
          </Select>

          <Button type="primary" onClick={handleAddClick}>
            Thêm phòng mới
          </Button>
        </div>

        <Table
          bordered
          columns={columns}
          dataSource={filteredRooms}
          rowKey="id"
        />
        <AddEditRoom type={modalType} room={selectedRoom} />
      </div>
    </PageLayout>
  );
};

export default RoomList;
