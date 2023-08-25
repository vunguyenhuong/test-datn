package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Color;
import com.poly.beeshoes.infrastructure.response.ColorResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IColorRepository extends JpaRepository<Color, Long> {
    Boolean existsByNameIgnoreCase(String name);
//    Page<ColorResponse> findAllByNameContaining(String name);
}
