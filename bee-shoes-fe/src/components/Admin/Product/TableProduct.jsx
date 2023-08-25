import { Empty, message } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import swal from "sweetalert";
import FormatCurrency from "~/utils/FormatCurrency";
import ImageModal from "./ImageModal";
import { all } from "axios";

function TableProduct({ props, handleChange }) {
  const [groupByColor, setGroupByColor] = useState([]);

  const handleImageSelect = (colorName, index, files) => {
    const updatedItems = [...groupByColor[colorName]];
    for (let i = 0; i < updatedItems.length; i++) {
      updatedItems[i] = { ...updatedItems[i], images: files };
    }
    setGroupByColor({
      ...groupByColor,
      [colorName]: updatedItems,
    });
    handleChange(
      Object.values({
        ...groupByColor,
        [colorName]: [...updatedItems],
      }).flat()
    );
  };

  const handleChangeQuantity = (event, colorName, index) => {
    const value = parseInt(event.target.value);
    if (value < 1) {
      message.error("Số lượng phải >= 1!");
    } else {
      const updatedItems = [...groupByColor[colorName]];
      updatedItems[index] = { ...updatedItems[index], quantity: value };
      setGroupByColor({
        ...groupByColor,
        [colorName]: updatedItems,
      });
      handleChange(
        Object.values({
          ...groupByColor,
          [colorName]: [...updatedItems],
        }).flat()
      );
    }
  };
  const handleChangePrice = (event, colorName, index) => {
    const value = parseInt(event.target.value);
    if (value < 1) {
      message.error("Số lượng phải >= 1!");
    } else {
      const updatedItems = [...groupByColor[colorName]];
      updatedItems[index] = { ...updatedItems[index], price: value };
      setGroupByColor({
        ...groupByColor,
        [colorName]: updatedItems,
      });
      handleChange(
        Object.values({
          ...groupByColor,
          [colorName]: [...updatedItems],
        }).flat()
      );
    }
  };
  const deleteProductDetail = (colorName, index) => {
    swal({
      title: "Xác nhận xóa?",
      text: "Không thể khôi phục hành động này!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        console.log(
          groupByColor[colorName][index].size.name +
            " - " +
            groupByColor[colorName][index].color.name
        );
        const items = groupByColor[colorName];
        items.splice(index, 1);

        // Cập nhật lại groupByColor sau khi xóa
        setGroupByColor({
          ...groupByColor,
          [colorName]: [...items],
        });

        const allItems = Object.values({
          ...groupByColor,
          [colorName]: [...items],
        }).flat();
        handleChange(allItems);
        toast.success("Xóa thành công!");
      }
    });
  };

  useEffect(() => {
    const groupedProducts = {};
    props.forEach((option) => {
      const colorName = option.color.name;

      if (!groupedProducts[colorName]) {
        groupedProducts[colorName] = [];
      }

      groupedProducts[colorName].push(option);
      console.log(groupedProducts);
    });
    setGroupByColor(groupedProducts);
  }, [props]);

  return (
    <div className="card mt-2 border-0">
      <div className="card-header border-0 bg-secondary-subtle">
        <span className="fw-semibold">Danh sách các sản phẩm cùng loại</span>
      </div>

      <div className="table-responsive">
        <table className="table table-sm text-nowrap">
          <thead className="bg-warning">
            <tr>
              <th>#</th>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Danh mục</th>
              <th>Thương hiệu</th>
              <th>Loại đế</th>
              <th></th>
              <th>Ảnh</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupByColor).map(([key, items], index) => (
              <React.Fragment key={index}>
                <tr>
                  <td
                    colSpan="9"
                    className="bg-secondary-subtle text-center fw-bold"
                  >
                    Các sản phẩm màu{" "}
                    <span className="text-lowercase">{key}</span>
                  </td>
                </tr>

                {items.map((option, idx) => (
                  <tr key={idx}>
                    <>
                    {option.shoe && option.shoe !== undefined && option.shoe !== null ? (
                      <>
                      <td>{idx + 1}</td>
                      <td>
                        {option.shoe === undefined || option.shoe === null
                          ? "Vui lòng chọn sản phẩm"
                          : option.shoe.name}{" "}
                        [{option.color.name} - {option.size.name}]
                      </td>
                      <td width="100px">
                        <input
                          type="text"
                          className="form-control form-control-sm input-small"
                          name=""
                          defaultValue={option.quantity}
                          onChange={(event) =>
                            handleChangeQuantity(event, key, idx)
                          }
                        />
                      </td>
                      <td width="100px">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name=""
                          defaultValue={option.price}
                          onChange={(event) =>
                            handleChangePrice(event, key, idx)
                          }
                        />
                      </td>
                      <td>{option.shoe.category.name}</td>
                      <td>{option.shoe.brand.name}</td>
                      <td>{option.sole == null ? "" : option.sole.name}</td>
                      <td>
                        <button
                          className="btn btn-sm"
                          onClick={() => deleteProductDetail(key, idx)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                      {idx === 0 ? (
                        <>
                          <td className="align-middle" rowSpan={items.length}>
                            <ImageModal
                              sttModal={index}
                              colorName={key}
                              handleChange={handleImageSelect}
                            />
                          </td>
                        </>
                      ) : (
                        ""
                      )}
                      </>
                    ) : ""}
                    </>
                  </tr>
                ))}
                                <tr>
                  <td colSpan={9} className="text-center">
                    {items[index] &&
                    items[index].images !== undefined &&
                    items[index].images.length !== 0 ? (
                      items[index].images.map((image, stt) => (
                        <img
                          src={image}
                          width={100}
                          height={100}
                          alt=""
                          key={stt}
                          className="me-2 object-fit-cover"
                        />
                      ))
                    ) : (
                      <Empty description={"Không có ảnh"}/>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableProduct;
