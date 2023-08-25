import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import StaffAddressDetail from "~/components/Admin/Account/Staff/StaffAddressDetail";
import StaffInfoDetail from "~/components/Admin/Account/Staff/StaffInfoDetail";
import GHNInfo from "~/components/GhnInfo";
import Loading from "~/components/Loading/Loading";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";

function StaffDetail() {
  const { id } = useParams();
  return (
    <>
      <BaseUI>
        <nav className="breadcrumb fw-semibold">
          <Link
            className="breadcrumb-item __bee-text text-decoration-none"
            to={"/admin/staff"}
          >
            Danh sách nhân viên
          </Link>
          <span className="breadcrumb-item">Chi tiết nhân viên</span>
        </nav>

        <div className="">
          <div className="row">
            <div className="col-xl-4 border-end border-3">
              <h6 className="border-bottom border-3 pb-2">
                Thông tin nhân viên
              </h6>
              <StaffInfoDetail idStaff={id}/>
            </div>

            <div className="col-xl-8">
              <h6 className="border-bottom border-3 pb-2">Thông tin địa chỉ</h6>
              <StaffAddressDetail idStaff={id}/>
            </div>
          </div>
          
        </div>
      </BaseUI>
    </>
  );
}

export default StaffDetail;
