package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISizeRepository extends JpaRepository<Size, Long> {
    Boolean existsByNameIgnoreCase(String name);
}
