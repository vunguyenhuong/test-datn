import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import QrReader from "react-qr-scanner";

function QrCode({ title, onQrSuccess }) {
  const [delay, setDelay] = useState(1000);
  const [result, setResult] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsCameraOn(true);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsCameraOn(false);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsCameraOn(false);
    setIsModalOpen(false);
  };

  const handleScan = (data) => {
    setResult(data);
  };

  const handleError = (err) => {
    console.error(err);
  };

  const previewStyle = {
    height: "100%",
    width: "100%",
    transform: "scaleX(-1)",
  };

  const processResult = () => {
    if (result) {
      console.log("Kết quả:", result.text);
      onQrSuccess(result.text);
    }
  };

  useEffect(() => {
    processResult();
  }, [result]);

  return (
    <>
      <Button type="primary" onClick={showModal}>
        <i className="fa-solid fa-qrcode me-1"></i> {title}
      </Button>
      <Modal
        title="QR Code Webcam"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={400}
      >
        {isCameraOn && (
          <QrReader
            delay={delay}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
          />
        )}
      </Modal>
    </>
  );
}

export default QrCode;
