package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IBrandRepository extends JpaRepository<Brand, Long> {
    Boolean existsByNameIgnoreCase(String name);
}
