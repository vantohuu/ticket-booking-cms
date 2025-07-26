import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Input, message } from "antd";
import {
  fetchCinemas,
  showBeginEditModal,
  deleteCinema,
  clearMessages,
} from "./actions";
import {
  selectCinemas,
  selectIsLoading,
  selectSuccessMessage,
  selectFailedMessage,
} from "./selectors";
import PageLayout from "../../layouts/PageLayout";
import AddEditCinema from "./AddEditPage";
import Loading from "../../components/Loading";

const BASE_URL = process.env.REACT_APP_URL || "http://localhost:3000/";

const CinemaList = () => {
  const dispatch = useDispatch();
  const [modalType, setModalType] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [searchText, setSearchText] = useState("");
  const messageText = useSelector(selectSuccessMessage);
  const errorText = useSelector(selectFailedMessage);
  const cinemas = useSelector(selectCinemas) || [];
  const isLoading = useSelector(selectIsLoading);
  useEffect(() => {
    dispatch(fetchCinemas());
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


  const handleAddClick = () => {
    setModalType("add");
    setSelectedCinema(null);
    dispatch(showBeginEditModal());
  };

  const handleEditClick = (cinema) => {
    setModalType("edit");
    setSelectedCinema(cinema);
    dispatch(showBeginEditModal());
  };

  const handleDeleteClick = (cinema) => {
    dispatch(deleteCinema(cinema.id));
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: "5%",
    },
    {
      title: "Tên rạp",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => record.name.toLowerCase().includes(value),
      width: "25%",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
      width: "40%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      width: "20%",
    },
    {
      title: "Danh sách phòng",
      dataIndex: "id",
      key: "id",
      width: "10%",
      render: (_, cinema) => (
        <a href={`${BASE_URL}room?cinemaId=${cinema.id}`} target="_blank">
          Xem danh sách phòng
        </a>
      ),
    },
    {
      title: "Sửa",
      key: "edit",
      width: "5%",
      render: (_, cinema) => (
        <Button onClick={() => handleEditClick(cinema)}>Sửa</Button>
      ),
    },
    {
      title: "Xóa",
      key: "delete",
      width: "5%",
      render: (_, cinema) => (
        <Button danger onClick={() => handleDeleteClick(cinema)}>
          Xóa
        </Button>
      ),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <PageLayout>
      <div>
        <h2 className="text-xl font-bold mb-4">Danh sách rạp chiếu phim</h2>
        <div className="mb-4">
          <Input.Search
            placeholder="Tìm theo tên rạp"
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
            style={{ width: 300, marginRight: 16 }}
            allowClear
          />
          <Button type="primary" onClick={handleAddClick}>
            Thêm rạp mới
          </Button>
        </div>

        <Table bordered columns={columns} dataSource={cinemas} rowKey="id" />
        <AddEditCinema type={modalType} cinema={selectedCinema} />
      </div>
    </PageLayout>
  );
};

export default CinemaList;
