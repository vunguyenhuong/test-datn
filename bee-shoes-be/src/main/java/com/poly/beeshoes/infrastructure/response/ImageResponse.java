package com.poly.beeshoes.infrastructure.response;

import com.poly.beeshoes.entity.Images;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Images.class})
public interface ImageResponse {
    Long getId();

    String getName();
}
