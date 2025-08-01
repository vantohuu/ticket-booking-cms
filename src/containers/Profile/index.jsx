import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Descriptions, Spin } from "antd";
import dayjs from "dayjs";
import PageLayout from "../../layouts/PageLayout";
import { fetchProfile } from "./actions";
import { selectProfile, selectIsLoading } from "./selectors";
import Loading from "../../components/Loading";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const userData = useSelector(selectProfile);
  const loading = useSelector(selectIsLoading);

  console.log("User Data:", userData);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (loading) {
    return (
     <Loading/>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto mt-10">
        <Card title="Thông tin cá nhân" bordered={false} className="shadow rounded">
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Tên đăng nhập">{userData?.username || null}</Descriptions.Item>
            <Descriptions.Item label="Họ">{userData?.firstName || null}</Descriptions.Item>
            <Descriptions.Item label="Tên">{userData?.lastName || null}</Descriptions.Item>
            <Descriptions.Item label="Email">{userData?.email || null}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{userData?.phone || null}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {userData?.gender === true ? "Nam" : "Nữ"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {userData?.dateOfBirth ? dayjs(userData.dateOfBirth).format("DD/MM/YYYY") : "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{userData?.address || null}</Descriptions.Item>
            <Descriptions.Item label="CMND/CCCD">{userData?.idCard || null}</Descriptions.Item>
            {/* Nếu có status thì hiển thị ở đây */}
            <Descriptions.Item label="Trạng thái">
              {userData?.status ? "Hoạt động" : "Khóa"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
