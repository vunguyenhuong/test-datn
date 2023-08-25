/* eslint-disable eqeqeq */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import AddShoeModal from "~/components/Admin/Product/AddShoeModal";
import AttributeModal from "~/components/Admin/Product/AttributeModal";
import SelectField from "~/components/Admin/Product/SelectField";
import TableProduct from "~/components/Admin/Product/TableProduct";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";

function AddProduct() {
  const navigate = useNavigate();

  const [sole, setSole] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);

  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedSole, setSelectedSole] = useState(null);

  const [product, setProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [productDetail, setProductDetail] = useState([]);

  useEffect(() => {
    loadSole();
    loadSize();
    loadColor();
    loadShoe();
  }, []);

  useEffect(() => {
    const options = [];
    selectedColor.forEach((colorItem) => {
      selectedSize.forEach((sizeItem) => {
        const option = {
          code: "",
          shoe: selectedProduct,
          color: colorItem,
          size: sizeItem,
          sole: selectedSole,
          price: 100000,
          quantity: 10,
          deleted: false,
          weight: 2000,
          images: []
        };
        options.push(option);
      });
    });
    setProductDetail(options);
  }, [selectedColor, selectedSize, selectedSole, selectedProduct]);
  const loadShoe = async () => {
    await request
      .get("/shoe/v1")
      .then((response) => {
        setProduct(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadSole = async () => {
    await request
      .get("/sole")
      .then((response) => {
        setSole(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadSize = async () => {
    await request
      .get("/size")
      .then((response) => {
        setSize(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadColor = async () => {
    await request
      .get("/color")
      .then((response) => {
        setColor(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteSize = (item) => {
    setSelectedSize((prevSize) => prevSize.filter((option) => option !== item));
    console.log(selectedSize);
  };
  const handleDeleteColor = (item) => {
    setSelectedColor((prevColor) =>
      prevColor.filter((option) => option !== item)
    );
    console.log(selectedColor);
  };

  const handleOnchangeSole = (value) => {
    request
      .get(`/sole/${value}`)
      .then((response) => {
        setSelectedSole(response);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangeProduct = (e) => {
    const value = e.target.value;
    const selectedOption = product.find((item) => item.name === value);
    console.log(selectedOption);
    setSelectedProduct(selectedOption);
  };

  const handleChangeProductDetail = (items) => {
    console.log("--- đã nhảy sang add shoe ---")
    setProductDetail(items);
    console.log(items)
  }

  const uploadImages = async (dataShoeDetail, images) => {
    for (let index = 0; index < images.length; index++) {
      const data = {
        name: images[index],
        shoeDetail: dataShoeDetail,
      };
      await request.post("/images", data).then((response) => {
        console.log(response);
      });
    }
  };

  const handleCreateShoeDetail = () => {
    if (selectedSole === null) {
      toast.error("Vui lòng nhập đủ thông tin!");
    } else {
      swal("Xác nhân thêm sản phẩm?", {
        icon: "warning",
        buttons: ["Không", "Đồng ý!"],
      }).then((action) => {
        if (action) {
          productDetail.forEach((value) => {
            console.log(value);
            value.code = "BS" + new Date().getTime().toString();
            request
              .post("/shoe-detail", value)
              .then((response) => {
                uploadImages(response.data, value.images);
              })
              .catch((error) => {
                console.log(error);
              });
          });
          swal("Good Job!", "Thêm thành công!", "success");
          navigate("/admin/product");
        }
      });
    }
  };

  return (
    <BaseUI>
      <div className="">
        <nav className="breadcrumb fw-semibold">
          <Link
            className="breadcrumb-item __bee-text text-decoration-none"
            to={"/admin/product"}
          >
            Danh sách sản phẩm
          </Link>
          <span className="breadcrumb-item">Thêm sản phẩm</span>
        </nav>
        <div className="input-group">
          <input
            type="text"
            list="products"
            className="form-control"
            placeholder="Nhập tên sản phẩm...."
            onKeyUp={handleChangeProduct}
          />
          <datalist id="products">
            {product.map((item) => (
              <option key={item.id} value={item.name} />
            ))}
          </datalist>
          <AddShoeModal onAddSuccess={loadShoe} />
        </div>
        <div className="card mt-2 border-0">
          <div className="card-header border-0 bg-secondary-subtle">
            <span className="fw-semibold">Thuộc tính</span>
          </div>
          {selectedProduct != null || selectedProduct != undefined ? (
            <div className="card-body row">
              <div className="col-xl-12 mb-3">
                <SelectField
                  label={"Đế giày"}
                  name={"sole"}
                  url={"/sole"}
                  options={sole}
                  onAddSuccess={loadSole}
                  onChange={handleOnchangeSole}
                />
              </div>
              <div className="col-xl-4">Size:</div>
              <div className="col-xl-8">
                {selectedSize.map((item) => (
                  <button className="btn btn-warning position-relative ms-3 mb-3">
                    {item.name}
                    <button
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill btn btn-danger"
                      onClick={() => handleDeleteSize(item)}
                    >
                      <i className="fa-sharp fa-solid fa-xmark text-white"></i>
                    </button>
                  </button>
                ))}
                <AttributeModal
                  nameModal="size"
                  options={size}
                  selectedOptions={selectedSize}
                  setSelectedOptions={setSelectedSize}
                  url={"/size"}
                  onAddSuccess={loadSize}
                />
              </div>
              <div className="col-xl-4">Color:</div>
              <div className="col-xl-8">
                {selectedColor.map((item) => (
                  <button className="btn btn-warning position-relative ms-3 mb-3">
                    {item.name}
                    <button
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill btn btn-danger"
                      onClick={() => handleDeleteColor(item)}
                    >
                      <i className="fa-sharp fa-solid fa-xmark text-white"></i>
                    </button>
                  </button>
                ))}
                <AttributeModal
                  nameModal="color"
                  options={color}
                  selectedOptions={selectedColor}
                  setSelectedOptions={setSelectedColor}
                  url={"/color"}
                  onAddSuccess={loadColor}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <TableProduct
          props={productDetail}
          handleChange={handleChangeProductDetail}
        />
        {selectedProduct === null || selectedProduct === undefined || selectedSize.length === 0 || selectedColor.length === 0 ? (
          ""
        ) : (
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-warning"
              onClick={handleCreateShoeDetail}
            >
              Tạo sản phẩm
            </button>
          </div>
        )}
      </div>
    </BaseUI>
  );
}

export default AddProduct;
