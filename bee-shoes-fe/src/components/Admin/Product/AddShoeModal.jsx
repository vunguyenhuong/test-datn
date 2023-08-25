import React, { useEffect, useState } from "react";
import SelectField from "./SelectField";
import * as request from "~/utils/httpRequest";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { message } from "antd";

function AddShoeModal({ onAddSuccess }) {
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [productName, setProductName] = useState(null);
  useEffect(() => {
    loadBrand();
    loadCategory();
  }, []);

  const loadCategory = async () => {
    await request
      .get("/category")
      .then((response) => {
        setCategory(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadBrand = async () => {
    await request
      .get("/brand")
      .then((response) => {
        setBrand(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOnchangeCate = (value) => {
    request
      .get(`/category/${value}`)
      .then((response) => {
        setSelectedCategory(response);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleOnchangeBrand = (value) => {
    request
      .get(`/brand/${value}`)
      .then((response) => {
        setSelectedBrand(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleChangeProductName = (event) => {
    setProductName(event.target.value);
  };

  const handleCreateShoe = (e) => {
    if (
      productName === "" ||
      productName === null ||
      selectedCategory === null ||
      selectedBrand === null
    ) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
    } else {
      const data = {
        name: productName,
        category: selectedCategory,
        brand: selectedBrand,
      };
      swal("Xác nhân thêm mới giày?", {
        icon: "warning",
        buttons: ["Không", "Đồng ý!"],
      }).then((action) => {
        if (action) {
          request
            .post("/shoe", data)
            .then((response) => {
              console.log(response);
              if (response.status === 201) {
                toast.success("Thêm thành công!");
                onAddSuccess();
              }
            })
            .catch((e) => {
              if (e.response.status === 409)
                toast.error(`${e.response.data.name} đã tồn tại!`);
            });
        }
      });
    }
  };
  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        data-bs-toggle="collapse"
        data-bs-target="#collapseExample"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        <i className="fas fa-plus-circle"></i>
      </button>

      <div class="collapse mt-2 w-100" id="collapseExample">
        <div class="card card-body">
          <h6>Thêm giày</h6>
          <div className="row">
            <div className="col-xl-4">
              <label className="form-label">Tên giày</label>
              <input
                type="text"
                className="form-control mb-3 form-control-sm"
                placeholder="Nhập tên giày ..."
                onChange={(event) => handleChangeProductName(event)}
              />
            </div>
            <div className="col-xl-4">
              <SelectField
                label={"Danh mục"}
                name={"category"}
                options={category}
                url={"/category"}
                onAddSuccess={loadCategory}
                onChange={handleOnchangeCate}
              />
            </div>
            <div className="col-xl-4">
              <SelectField
                label={"Thương hiệu"}
                name={"brand"}
                url={"/brand"}
                options={brand}
                onAddSuccess={loadBrand}
                onChange={handleOnchangeBrand}
              />
            </div>
          </div>

          <div className="">
            <button
              type="button"
              class="btn btn-warning"
              onClick={(event) => handleCreateShoe(event)}
            >
              Thêm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddShoeModal;
