import React, { useState } from "react";
import { useZxing } from "react-zxing";
import { Button, message } from "antd";
import axios from "axios";
import { scanTicket } from "../api/ticketApi";

const QRScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [loadingApprove, setLoadingApprove] = useState(false);

  const { ref } = useZxing({
    paused: !scanning,
    onDecodeResult(result) {
      try {
        const parsed = JSON.parse(result.getText());
        setScannedData(parsed);
      } catch {
        setScannedData({ raw: result.getText() });
      }
      setScanning(false);
    },
  });

  const handleRescan = () => {
    setScannedData(null);
    setScanning(true);
  };

  const handleApprove = async () => {
    if (!scannedData) {
      message.error("Không có dữ liệu vé hợp lệ để duyệt.");
      return;
    }
    setLoadingApprove(true);
    try {
      await scanTicket(scannedData);
      message.success("Vé đã được duyệt thành công!");
      setScannedData((prev) => ({ ...prev, status: true }));
    } catch (error) {
      console.error(error);
      message.error("Vé bị lỗi. Vui lòng thử lại.");
    } finally {
      setLoadingApprove(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl text-center font-bold">📷 Quét mã QR</h2>

      {scanning && (
        <div className="border-4 border-gray-300 rounded-xl overflow-hidden w-[400px] h-[400px] mx-auto">
          <video ref={ref} className="w-full h-full object-cover" />
        </div>
      )}

      {!scanning && (
        <div className="space-y-4">
          <Button type="primary" onClick={handleRescan}>
            🔄 Quét lại
          </Button>

          {scannedData && (
            <div className="bg-gray-100 p-4 rounded shadow">
              <h3 className="font-semibold mb-2">✅ Dữ liệu đã quét:</h3>
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(scannedData, null, 2)}
              </pre>

              <Button
                type="primary"
                className="mt-4"
                loading={loadingApprove}
                onClick={handleApprove}
                disabled={loadingApprove || scannedData.status === true}
              >
                ✅ {scannedData.status === true ? "Đã duyệt" : "Duyệt vé"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
