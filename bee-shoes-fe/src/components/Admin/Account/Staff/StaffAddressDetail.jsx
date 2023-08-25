import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import GHNInfo from "~/components/GhnInfo";
import Loading from "~/components/Loading/Loading";
import * as request from "~/utils/httpRequest";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Modal, message } from "antd";
import AddressStaffDetail from "./AddressStaffDetail";

function StaffAddressDetail({ idStaff }) {
  const [listAddress, setListAddress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadListAddress();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [idStaff]);

  const loadListAddress = async () => {
    try {
      const response = await request.get(`/address/${idStaff}`);
      setListAddress(response);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {listAddress.map((item, key) => (
        <div className="" key={key}>
          <AddressStaffDetail address={item} addressIndex={key} onSuccess={loadListAddress}/>
        </div>
      ))}
    </>
  );
}

export default StaffAddressDetail;
