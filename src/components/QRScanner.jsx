"use client"

import { useState } from "react"
import { useZxing } from "react-zxing"
import { Button, message, Card, Row, Col, Tag, Divider } from "antd"
import { scanTicket } from "../api/ticketApi"
import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  HomeOutlined,
} from "@ant-design/icons"

const QRScanner = () => {
  const [scannedData, setScannedData] = useState(null)
  const [scanning, setScanning] = useState(true)
  const [loadingApprove, setLoadingApprove] = useState(false)
  const [ticketInfo, setTicketInfo] = useState(null)

  const { ref } = useZxing({
    paused: !scanning,
    onDecodeResult(result) {
      try {
        const parsed = JSON.parse(result.getText())
        setScannedData(parsed)
      } catch {
        setScannedData({ qrCode: result.getText() })
      }
      setScanning(false)
    },
  })

  const handleRescan = () => {
    setScannedData(null)
    setScanning(true)
    setTicketInfo(null)
  }

  const handleApprove = async () => {
    if (!scannedData) {
      message.error("Không có dữ liệu vé hợp lệ để duyệt.")
      return
    }
    setLoadingApprove(true)
    try {
      const response = await scanTicket(scannedData)
      const result = response?.data?.result

      if (result?.success) {
        message.success(result?.message || "Vé đã được duyệt thành công!")
        setScannedData((prev) => ({ ...prev, status: true }))
        setTicketInfo(result)
      } else {
        message.error(result?.message || "Không thể duyệt vé.")
        if (result?.ticket) {
          setTicketInfo(result)
        }
      }
    } catch (error) {
      console.error(error)
      message.error(error?.response?.data?.message || "Vé bị lỗi. Vui lòng thử lại.")
    } finally {
      setLoadingApprove(false)
    }
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A"
    const date = new Date(dateTimeString)
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSeatTypeInfo = (seatType) => {
    const types = {
      STANDARD: { label: "Ghế Thường", color: "default" },
      VIP: { label: "Ghế VIP", color: "gold" },
      COUPLE: { label: "Ghế Đôi", color: "magenta" },
    }
    return types[seatType] || { label: "Ghế Thường", color: "default" }
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl text-center font-bold">Quét mã QR vé</h2>

      {scanning && (
        <div className="border-4 border-gray-300 rounded-xl overflow-hidden w-[400px] h-[400px] mx-auto">
          <video ref={ref} className="w-full h-full object-cover" />
        </div>
      )}

      {console.log("ticketInfo", ticketInfo)}

      {!scanning && (
        <div className="space-y-4">
          <Button type="primary" onClick={handleRescan}>
            Quét lại
          </Button>

          {scannedData && !ticketInfo && (
            <div className="bg-gray-100 p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Dữ liệu đã quét:</h3>
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(scannedData, null, 2)}</pre>

              <Button
                type="primary"
                className="mt-4"
                loading={loadingApprove}
                onClick={handleApprove}
                disabled={loadingApprove || scannedData.status === true}
              >
                {scannedData.status === true ? "Đã duyệt" : "Duyệt vé"}
              </Button>
            </div>
          )}

          {ticketInfo && ticketInfo.ticket && (
            <Card
              className="shadow-lg"
              title={
                <div className="flex items-center gap-2">
                  {ticketInfo.success ? (
                    <>
                      <CheckCircleOutlined className="text-green-500 text-xl" />
                      <span className="text-green-600 font-bold">VÉ HỢP LỆ - HƯỚNG DẪN KHÁCH HÀNG</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleOutlined className="text-red-500 text-xl" />
                      <span className="text-red-600 font-bold">{ticketInfo.message?.toUpperCase()}</span>
                    </>
                  )}
                </div>
              }
              bordered={false}
            >
              <Row gutter={[16, 16]}>
                {/* Movie Information */}
                <Col span={24}>
                  <Card
                    type="inner"
                    title={
                      <span>
                        <VideoCameraOutlined /> Thông tin phim
                      </span>
                    }
                  >
                    <p className="text-xl font-bold mb-2">{ticketInfo.ticket.showtime?.movie?.title || "N/A"}</p>
                    <p className="text-gray-600">{ticketInfo.ticket.showtime?.movie?.description || ""}</p>
                    {ticketInfo.ticket.showtime?.movie?.duration && (
                      <p className="mt-2">
                        <strong>Thời lượng:</strong> {ticketInfo.ticket.showtime.movie.duration} phút
                      </p>
                    )}
                  </Card>
                </Col>

                {/* Location Information */}
                <Col xs={24} md={12}>
                  <Card
                    type="inner"
                    title={
                      <span>
                        <HomeOutlined /> Rạp & Phòng chiếu
                      </span>
                    }
                  >
                    <p className="mb-2">
                      <EnvironmentOutlined className="mr-2" />
                      <strong>Rạp:</strong> {ticketInfo.ticket.showtime?.cinemaName || "N/A"}
                    </p>
                    <p>
                      <strong>Phòng:</strong>{" "}
                      {ticketInfo.ticket.showtime?.roomName || ticketInfo.ticket.showtime?.room?.name || "N/A"}
                    </p>
                  </Card>
                </Col>

                {/* Time Information */}
                <Col xs={24} md={12}>
                  <Card
                    type="inner"
                    title={
                      <span>
                        <ClockCircleOutlined /> Thời gian chiếu
                      </span>
                    }
                  >
                    <p className="mb-2">
                      <CalendarOutlined className="mr-2" />
                      <strong>Bắt đầu:</strong> {formatDateTime(ticketInfo.ticket.showtime?.startTime)}
                    </p>
                    <p>
                      <strong>Kết thúc:</strong> {formatDateTime(ticketInfo.ticket.showtime?.endTime)}
                    </p>
                  </Card>
                </Col>

                {/* Seat Information - Emphasized */}
                <Col span={24}>
                  <Card
                    type="inner"
                    className="bg-blue-50 border-2 border-blue-400"
                    title={
                      <span className="text-blue-700 text-lg">
                        <EnvironmentOutlined className="text-2xl" /> CHỖ NGỒI
                      </span>
                    }
                  >
                    <div className="text-center">
                      <p className="text-4xl font-bold text-blue-600 mb-2">
                        {ticketInfo.ticket.seatName || ticketInfo.ticket.seat?.name || "N/A"}
                      </p>
                      <Tag
                        color={getSeatTypeInfo(ticketInfo.ticket.seat?.seatType).color}
                        className="text-lg px-4 py-1"
                      >
                        {getSeatTypeInfo(ticketInfo.ticket.seat?.seatType).label}
                      </Tag>
                      <p className="text-gray-600 mt-3 text-base">
                        Vui lòng hướng dẫn khách hàng đến{" "}
                        <strong>Phòng {ticketInfo.ticket.showtime?.roomName || "N/A"}</strong>, ghế số{" "}
                        <strong>{ticketInfo.ticket.seatName || "N/A"}</strong>
                      </p>
                    </div>
                  </Card>
                </Col>

                {/* Ticket Details */}
                <Col span={24}>
                  <Divider>Chi tiết vé</Divider>
                  <Row gutter={[16, 8]}>
                    <Col xs={12} md={6}>
                      <p>
                        <strong>Mã vé:</strong>
                      </p>
                      <p className="text-blue-600">#{ticketInfo.ticket.id}</p>
                    </Col>
                    <Col xs={12} md={6}>
                      <p>
                        <strong>Giá vé:</strong>
                      </p>
                      <p className="text-green-600 font-bold">{ticketInfo.ticket.price?.toLocaleString()} VNĐ</p>
                    </Col>
                    <Col xs={12} md={6}>
                      <p>
                        <strong>Trạng thái:</strong>
                      </p>
                      <Tag color={ticketInfo.ticket.isScanned ? "green" : "blue"}>
                        {ticketInfo.ticket.isScanned ? "Đã quét" : "Chưa quét"}
                      </Tag>
                    </Col>
                    <Col xs={12} md={6}>
                      <p>
                        <strong>Thời gian quét:</strong>
                      </p>
                      <p>{formatDateTime(ticketInfo.ticket.scannedAt || ticketInfo.scannedAt)}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* Action Button */}
              <div className="mt-6 text-center">
                {!ticketInfo.success && (
                  <Button
                    type="primary"
                    size="large"
                    loading={loadingApprove}
                    onClick={handleApprove}
                    disabled={loadingApprove}
                  >
                    Thử duyệt lại
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default QRScanner
