import { Modal, List } from "antd";
import { useSelector } from "react-redux";

const ShowtimesModal = ({ visible, onClose }) => {
  const showtimes = useSelector((state) => state.movie.showtimes);
  console.log("ShowtimesModal showtimes", showtimes);

  // Format ngày dd/MM/yyyy HH:mm
  const formatDateTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now >= start && now <= end) return "Đang chiếu";
    if (now < start) return "Sắp chiếu";
    return "Đã chiếu";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Đang chiếu":
        return "bg-red-500";
      case "Sắp chiếu":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Modal
      title="Lịch chiếu"
      open={visible} // AntD v5 dùng open thay vì visible
      onCancel={onClose}
      footer={null}
    >
      {showtimes.length === 0 ? (
        <p>Không có lịch chiếu.</p>
      ) : (
        <List
          dataSource={showtimes}
          renderItem={(item) => {
            const status = getStatus(item.startTime, item.endTime);
            return (
              <List.Item>
                <div className="bg-white rounded-xl p-4 shadow-md w-full">
                  {/* Badge trạng thái */}
                  <span
                    className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${getStatusClass(
                      status
                    )}`}
                  >
                    {status}
                  </span>

                  <div className="mt-3 space-y-1 text-sm">
                    <p>
                      <strong>Rạp:</strong> {item.cinemaName}
                    </p>
                    <p>
                      <strong>Phòng:</strong> {item.roomName}
                    </p>
                    <p>
                      <strong>Thời gian bắt đầu:</strong>{" "}
                      {formatDateTime(item.startTime)}
                    </p>
                    <p>
                      <strong>Thời gian kết thúc:</strong>{" "}
                      {formatDateTime(item.endTime)}
                    </p>
                    <p>
                      <strong>Giá vé:</strong> {item.ticketPrice} VND
                    </p>
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      )}
    </Modal>
  );
};

export default ShowtimesModal;
