package org.marzouki.orderservice.repository;

import org.marzouki.orderservice.entities.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByClientId(String clientId);
    
    @Query("SELECT b FROM Bill b WHERE b.statut = :status")
    List<Bill> findByStatut(@Param("status") Bill.OrderStatus status);
}
