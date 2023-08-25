package com.poly.beeshoes.infrastructure.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.poly.beeshoes.infrastructure.common.PageableRequest;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Getter
@Setter
public class AccountRequest extends PageableRequest {
    @NotNull(message = "Username không được để trống!")
    private String username;
    @NotNull(message = "Mã định danh không được để trống!")
    private String cccd;
    @NotNull(message = "Tên không được để trống!")
    private String name;
    @NotNull(message = "Email không được để trống!")
    private String email;
    @NotNull(message = "SDT không được để trống!")
    private String phoneNumber;
    private MultipartFile avatar;
    @NotNull(message = "Ngày sinh không được để trống!")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date birthday;
    @NotNull(message = "Giới tính không được để trống!")
    private String gender;
    private String password;

    private AddressRequest address;

    //    filter
    private Boolean deleted;
    private String roleName;
}
