package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Sole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISoleRepository extends JpaRepository<Sole, Long> {
    Boolean existsByNameIgnoreCase(String name);
}
