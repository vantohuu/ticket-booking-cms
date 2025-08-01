import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Radio, DatePicker, Table, message } from "antd";
import { Column } from "@ant-design/charts";
import { fetchReport, clearReport } from "./actions";
import { selectReport, selectIsLoading } from "./selectors";
import PageLayout from "../../layouts/PageLayout";
import Loading from "../../components/Loading";

const { RangePicker } = DatePicker;

const ReportPage = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectReport);
  const loading = useSelector(selectIsLoading);

  const [reportType, setReportType] = useState("cinema");

  const onChangeReportType = (e) => {
    setReportType(e.target.value);
    dispatch(clearReport());
  };

  const [range, setRange] = useState([]);

  const handleFetch = () => {
    if (range.length !== 2) {
      message.warning("Vui lòng chọn khoảng thời gian.");
      return;
    }

    dispatch(
      fetchReport({
        reportType,
        fromDate: range[0].format("YYYY-MM-DD"),
        toDate: range[1].format("YYYY-MM-DD"),
      })
    );
  };

  const columnsMap = {
    cinema: [
      { title: "Tên rạp", dataIndex: "cinemaName", key: "cinemaName" },
      { title: "Số vé đã bán", dataIndex: "totalTicketsSold", key: "totalTicketsSold" },
      { title: "Doanh thu", dataIndex: "totalRevenue", key: "totalRevenue" },
    ],
    movie: [
      { title: "Tên phim", dataIndex: "movieTitle", key: "movieTitle" },
      { title: "Số vé đã bán", dataIndex: "totalTicketsSold", key: "totalTicketsSold" },
      { title: "Doanh thu", dataIndex: "totalRevenue", key: "totalRevenue" },
    ],
    daily: [
      { title: "Ngày", dataIndex: "date", key: "date" },
      { title: "Số vé đã bán", dataIndex: "totalTicketsSold", key: "totalTicketsSold" },
      { title: "Doanh thu", dataIndex: "totalRevenue", key: "totalRevenue" },
    ],
    monthly: [
      { title: "Tháng", dataIndex: "period", key: "period" },
      { title: "Năm", dataIndex: "year", key: "year" },
      { title: "Số vé đã bán", dataIndex: "totalTicketsSold", key: "totalTicketsSold" },
      { title: "Doanh thu", dataIndex: "totalRevenue", key: "totalRevenue" },
    ],
    quarterly: [
      { title: "Quý", dataIndex: "period", key: "period" },
      { title: "Năm", dataIndex: "year", key: "year" },
      { title: "Số vé đã bán", dataIndex: "totalTicketsSold", key: "totalTicketsSold" },
      { title: "Doanh thu", dataIndex: "totalRevenue", key: "totalRevenue" },
    ],
    yearly: [
      { title: "Năm", dataIndex: "year", key: "year" },
      { title: "Số vé đã bán", dataIndex: "totalTicketsSold", key: "totalTicketsSold" },
      { title: "Doanh thu", dataIndex: "totalRevenue", key: "totalRevenue" },
    ],
  };

  // Tính tổng
  const total = useMemo(() => {
    return reportData.reduce(
      (acc, item) => {
        acc.totalTicketsSold += item.totalTicketsSold || 0;
        acc.totalRevenue += item.totalRevenue || 0;
        return acc;
      },
      { totalTicketsSold: 0, totalRevenue: 0 }
    );
  }, [reportData]);

  // Dữ liệu cho biểu đồ cột
  const chartData = useMemo(() => {
    return reportData.map((item) => {
      const name =
        item.cinemaName || item.movieTitle || item.date || item.period || item.year || "Khác";
      return {
        name,
        DoanhThu: item.totalRevenue,
      };
    });
  }, [reportData]);

  return (
    <PageLayout>
      <div >
        <h2 className="text-2xl font-semibold mb-4">Thống kê doanh thu</h2>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Radio.Group value={reportType} onChange={onChangeReportType}>
            <Radio value="cinema">Theo rạp</Radio>
            <Radio value="movie">Theo phim</Radio>
            <Radio value="daily">Theo ngày</Radio>
            <Radio value="monthly">Theo tháng</Radio>
            <Radio value="quarterly">Theo quý</Radio>
            <Radio value="yearly">Theo năm</Radio>
          </Radio.Group>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <RangePicker
            value={range}
            onChange={(value) => setRange(value)}
            format="YYYY-MM-DD"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleFetch}
          >
            Thống kê
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <Table
              dataSource={reportData}
              columns={columnsMap[reportType]}
              rowKey={(record, index) =>
                record?.cinemaId || record?.movieId || record?.date || record?.period || index
              }
              pagination={{ pageSize: 5 }}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <strong>Tổng cộng</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <strong>{total.totalTicketsSold.toLocaleString()}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <strong>{total.totalRevenue.toLocaleString()} đ</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />

            <div className="mt-10">
              <h3 className="text-xl font-medium mb-4">Biểu đồ doanh thu</h3>
              <Column
                data={chartData}
                xField="name"
                yField="DoanhThu"
                xAxis={{ label: { autoHide: true, autoRotate: false } }}
                yAxis={{ label: { formatter: (v) => `${parseInt(v).toLocaleString()} đ` } }}
                height={300}
              />
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ReportPage;
