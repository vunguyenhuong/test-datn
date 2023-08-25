import {
  Alert,
  Breadcrumb,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  message,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaHome, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import GHNInfo from "~/components/GhnInfo";
import Loading from "~/components/Loading/Loading";
import QrCode from "~/components/QrCode";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";

function AddStaff() {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataAddress, setDataAddress] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleImageSelect = (event) => {
    try {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    } catch (e) {
      setPreviewUrl("");
    }
  };

  const handleQrSuccess = (value) => {
    const withoutName = value.substring(14, value.length);
    const splits = withoutName.split("|");
    const birthday = splits[1];
    if (value.substring(0, 12).length === 12) {
      message.success(`Đã tìm thấy ${splits[0].toString()}!`);
      setValue("gender", splits[2]);
      setValue("username", value.substring(0, 12));
      setValue("name", splits[0]);
      setValue(
        "birthday",
        `${birthday.substring(4)}-${birthday.substring(
          2,
          4
        )}-${birthday.substring(0, 2)}`
      );
      setValue("specificAddress", splits[3]);
    }
  };

  const genderCheck = watch("gender");
  const handleChangeGender = (value) => {
    setValue("gender", value);
  };

  const handleAddStaff = (data) => {
    if (dataAddress == null) {
      message.error("Vui lòng chọn địa chỉ!");
    } else {
      console.log(data);
      // swal("Xác nhân thêm nhân viên?", {
      //   icon: "warning",
      //   buttons: ["Không", "Đồng ý!"],
      // }).then(async (action) => {
      //   if (action) {
      //     setLoading(true);

      //     const dataRequest = {
      //       username: data.username,
      //       name: data.name,
      //       email: data.email,

      //       gender: data.gender,
      //       birthday: data.birthday,
      //       addressList: [
      //         {
      //           name: data.name,
      //           phoneNumber: data.phoneNumber,
      //           specificAddress: data.specificAddress,
      //           ward: dataAddress.ward,
      //           district: dataAddress.district,
      //           province: dataAddress.province,
      //         },
      //       ],
      //     };
      //     request
      //       .post("/staff", dataRequest)
      //       .then((response) => {
      //         if (response.status === 200) {
      //           swal("Good Job!", "Thêm thành công!", "success");
      //           setLoading(false);
      //           navigate("/admin/staff");
      //         }
      //       })
      //       .catch((e) => {
      //         console.log(e);
      //         setLoading(false);
      //       });
      //   }
      // });
    }
  };

  if (loading) {
    return (
      <BaseUI>
        <Loading />
      </BaseUI>
    );
  }

  return (
    <BaseUI>
      <div className="d-flex">
        <div className="flex-grow-1">
          <Breadcrumb
            className="mb-2"
            items={[
              { href: "/", title: <FaHome /> },
              { href: "/admin/staff", title: "Danh sách nhân viên" },
              { title: "Thêm nhân viên" },
            ]}
          />
        </div>
        <div className="">
          <QrCode title={"Quét CCCD"} onQrSuccess={handleQrSuccess} />
        </div>
      </div>
      <Form onFinish={handleAddStaff} layout="vertical">
        <Row gutter={24}>
          <Col span={8}>
            <h6>Thông tin nhân viên</h6>
            <Divider />
            {previewUrl !== null ? (
              <div className="text-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: "162px", height: "162px" }}
                  className="mt-2 shadow-lg bg-body-tertiary rounded-circle object-fit-contain"
                />
                <Button className="position-absolute border-0" onClick={() => setPreviewUrl(null)}>
                  <FaTrash className="text-danger"/>
                </Button>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center">
                <div
                  className="position-relative rounded-circle
                            border border-warning mt-2 d-flex align-items-center 
                            justify-content-center"
                  style={{ width: "162px", height: "162px" }}
                >
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="position-absolute opacity-0 py-5"
                  />
                  <div className="text-center text-secondary">
                    <i className="fas fa-plus"></i> <br />
                    <span>Chọn ảnh đại diện</span>
                  </div>
                </div>
              </div>
            )}
            <Form.Item
              label={"Username"}
              name={"username"}
              rules={[
                { required: true, message: "Username không được để trống!" },
              ]}
            >
              <Input placeholder="Nhập username..." />
            </Form.Item>
            <Form.Item
              label={"Tên nhân viên"}
              name={"name"}
              rules={[{ required: true, message: "Tên không được để trống!" }]}
            >
              <Input placeholder="Nhập tên nhân viên..." />
            </Form.Item>
            <Form.Item
              label={"Giới tính"}
              name={"gender"}
              rules={[
                { required: true, message: "Giới tính không được để trống!" },
              ]}
            >
              <Radio.Group>
                <Radio value={"Nam"}>Nam</Radio>
                <Radio value={"Nữ"}>Nữ</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={16}>
            <h6>Thông tin chi tiết</h6>
            <Divider />
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  label={"Ngày sinh"}
                  name={"birthday"}
                  rules={[
                    {
                      required: true,
                      message: "Ngày sinh không được để trống!",
                    },
                  ]}
                >
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={"Email"}
                  name={"email"}
                  rules={[
                    { required: true, message: "Email không được để trống!" },
                  ]}
                >
                  <Input placeholder="Nhập email ..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={"Số điện thoại"}
                  name={"phoneNumber"}
                  rules={[
                    {
                      required: true,
                      message: "Số điện thoại không được để trống!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại ..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={"Địa chỉ cụ thể"}
                  name={"specificAddress"}
                  rules={[
                    {
                      required: true,
                      message: "Địa chỉ cụ thể không được để trống!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại ..." />
                </Form.Item>
              </Col>
              <GHNInfo dataAddress={setDataAddress} />
            </Row>
            <Form.Item className="mt-3 float-end">
              <Button type="primary" htmlType="submit">
                <i className="fas fa-plus me-2"></i> Thêm nhân viên
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </BaseUI>
  );
}

export default AddStaff;
