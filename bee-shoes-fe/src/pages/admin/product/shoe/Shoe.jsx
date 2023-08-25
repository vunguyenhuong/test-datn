import { Carousel, Empty } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SelectFilter from "~/components/Admin/Product/SelectFilter";
import Pagination from "~/components/Pagination";
import BaseUI from "~/layouts/admin/BaseUI";
import FormatCurrency from "~/utils/FormatCurrency";
import * as request from "~/utils/httpRequest";

function Shoe() {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [listCate, setListCate] = useState([]);
  const [listBrand, setListBrand] = useState([]);

  const [listProductDetail, setListProductDetail] = useState([]);

  const [selectedCate, setSelectedCate] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(3);
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  useEffect(() => {
    request
      .get("/category")
      .then((response) => {
        setListCate(response);
      })
      .catch((error) => {
        console.log(error);
      });
    request
      .get("/brand")
      .then((response) => {
        setListBrand(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    request
      .get("/shoe", {
        params: {
          name: searchValue,
          page: currentPage,
          size: pageSize,
          category: selectedCate,
          brand: selectedBrand
        },
      })
      .then((response) => {
        setProductList(response.content);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [
    currentPage,
    selectedCate,
    selectedBrand,
    pageSize,
    searchValue
  ]);

  const handleChangePageSize = (e) => {
    setPageSize(e.target.value);
  };
  const handleChangeSearchValue = (e) => {
    setSearchValue(e.target.value);
  };
  const changeCategory = (value) => {
    setSelectedCate(value);
  };
  const changeBrand = (value) => {
    setSelectedBrand(value);
  };
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    setCurrentPage(pageNumber);
  };

  const handleShowDetailProduct = async (id) => {
    setListProductDetail(await request.get(`/shoe-detail/findByShoe/${id}`));
  };

  return (
    <BaseUI>
      <h6 className="fw-bold">Danh sách sản phẩm</h6>
      <div className="">
        <div className="d-flex align-items-center">
          <div className="p-2 flex-grow-1">
            <label className="mb-1">Nhập tên sản phẩm: </label>
            <input
              className="form-control form-control-sm me-2"
              name="ten"
              type="search"
              defaultValue={""}
              placeholder="Tìm kiếm sản phẩm theo tên ..."
              onChange={(event) => handleChangeSearchValue(event)}
            />
          </div>
          <div className="p-2">
            <label className="mb-1">Số bản ghi: </label>
            <select
              className="form-select form-select-sm"
              onChange={(event) => handleChangePageSize(event)}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="p-2">
            <label className="mb-1">ㅤ</label>
            <div className="">
              <Link
                type="button"
                className="btn btn-warning btn-sm"
                to={"/admin/product/add"}
              >
                <i className="fas fa-plus-circle"></i> Thêm sản phẩm
              </Link>
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-center">
          <SelectFilter
            items={listCate}
            label={"Danh mục"}
            handleChange={changeCategory}
          />
          <SelectFilter
            items={listBrand}
            label={"Thương hiệu"}
            handleChange={changeBrand}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-sm">
            <thead className="">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Danh mục</th>
                <th scope="col">Thương hiệu</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {totalPages === 0 ? (
                <tr className="text-center fw-semibold">
                  <td colSpan={8}>
                    <Empty />
                  </td>
                </tr>
              ) : (
                productList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{item.shoe.name}</td>
                    <td>{item.quantity === null ? 0 : item.quantity}</td>
                    <td>{item.shoe.category.name}</td>
                    <td>{item.shoe.brand.name}</td>
                    <td>
                      <span
                        class={`fw-semibold ${
                          item.deleted === true ? "text-danger" : "__bee-text"
                        }`}
                      >
                        {item.deleted === true ? "Ngùng bán" : "Đang bán"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#imagesModal"
                        onClick={() => handleShowDetailProduct(item.shoe.id)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <Link
                        to={`/admin/product/${item.shoe.id}`}
                        className="btn btn-sm text-warning"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handleChange={handlePageChange}
        />
      </div>

      <div
        className="modal fade"
        id="imagesModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="exampleModalLabel">
                Tất cả phiên bản
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead className="bg-danger">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Ảnh</th>
                      <th scope="col">Tên</th>
                      <th scope="col">Số lượng</th>
                      <th scope="col">Đơn giá</th>
                      <th scope="col">Danh mục</th>
                      <th scope="col">Thương hiệu</th>
                      <th scope="col">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listProductDetail.length === 0 ? (
                      <tr className="text-center fw-semibold">
                        <td colSpan={8}>
                          <Empty />
                        </td>
                      </tr>
                    ) : (
                      listProductDetail.map((item, index) => (
                        <tr key={item.shoeDetail.id} className="align-middle">
                          <td>{index+1}</td>
                          <td>
                            <Carousel
                              autoplay
                              autoplaySpeed={1500}
                              dots={false}
                              arrows={false}
                              style={{ width: "150px", height: "150px" }}
                            >
                              {item.imagesList.map((image, index) => (
                                <div key={index}>
                                  <img src={image.name} alt="images" style={{ width: "150px", height: "150px" }} className="object-fit-cover"/>
                                </div>
                              ))}
                            </Carousel>
                          </td>
                          <td>
                            {item.shoeDetail.shoe.name} [
                            {item.shoeDetail.color.name} - {" "}
                            {item.shoeDetail.size.name} - {" "} {item.shoeDetail.sole.name}]
                          </td>
                          <td>{item.shoeDetail.quantity}</td>
                          <td>
                            <FormatCurrency value={item.shoeDetail.price} />
                          </td>
                          <td>{item.shoeDetail.shoe.category.name}</td>
                          <td>{item.shoeDetail.shoe.brand.name}</td>
                          <td>
                            <span
                              class={`fw-semibold ${
                                item.shoeDetail.deleted === true
                                  ? "text-danger"
                                  : "__bee-text"
                              }`}
                            >
                              {item.shoeDetail.deleted === true
                                ? "Ngùng bán"
                                : "Đang bán"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseUI>
  );
}

export default Shoe;
