package org.marzouki.orderservice.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.marzouki.orderservice.model.Product;

@Entity
@Table(name = "order_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String productId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Bill bill;
    
    @Column(nullable = false)
    private int quantity;
    
    @Column(nullable = false)
    private double unitPrice;
    
    @Column(nullable = false)
    private double totalPrice;
    
    @Transient
    private Product product;
    
    @PrePersist
    @PreUpdate
    protected void calculateTotal() {
        totalPrice = quantity * unitPrice;
    }
}
