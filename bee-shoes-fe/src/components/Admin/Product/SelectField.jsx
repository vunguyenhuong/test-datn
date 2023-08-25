import React from "react";
import { useForm } from "react-hook-form";
import * as request from "~/utils/httpRequest";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useState } from "react";
import { message } from "antd";

function SelectField({
  label,
  options,
  name,
  url,
  onAddSuccess,
  onChange,
  selected,
}) {
  const [option, setOption] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();
  const handleOnChange = (event) => {
    const selectedValue = event.target.value;
    if (onChange) {
      onChange(selectedValue);
    }
  };

  useEffect(() => {
    loadData()
  }, [url]);

  const loadData = () => {
    request.get(url).then((response) => {
      setOption(response);
    });
  }

  const onSubmit = (data) => {
    request
      .post(url, data)
      .then((response) => {
        if (response.status === 201) {
          message.success("Thêm thành công!");
          loadData()
        }
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status === 409)
          message.error(`Thuộc tính ${e.response.data.name} đã tồn tại!`);
      });
  };
  return (
    <>
      <label className="form-label">{label}</label>
      <div className="input-group input-group-sm">
        <select
          className="form-select form-select"
          name={name}
          onChange={handleOnChange}
        >
          <option defaultValue={""} value={null}>
            -- Chọn {label} --
          </option>
          {option.map((option) => (
            <option
              key={option.id}
              value={option.id}
              selected={option.id === selected}
            >
              {option.name}
            </option>
          ))}
        </select>
        <button
          className="btn btn-outline-warning "
          type="button"
          data-bs-toggle="modal"
          data-bs-target={`#${name}Modal`}
        >
          <i className="fas fa-plus-circle"></i>
        </button>
      </div>

      <div
        className="modal fade"
        id={`${name}Modal`}
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Thêm {label}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form id={`${name}Form`} onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label">Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("name", { required: true })}
                  />
                  <small id="helpId" className="form-text text-muted">
                    {errors.name && "Tên không được để trống!"}
                  </small>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                form={`${name}Form`}
                data-bs-dismiss={isValid && "modal"}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SelectField;
