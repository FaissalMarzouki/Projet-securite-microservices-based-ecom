package org.marzouki.orderservice.entities;

import jakarta.persistence.*;
import lombok.*;
import org.marzouki.orderservice.model.Customer;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@NoArgsConstructor @AllArgsConstructor @Getter @Setter @Builder
public class Bill {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCommande;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus statut;
    
    @Column(nullable = false)
    private String clientId;
    
    @Column(nullable = false)
    private double montantTotal;
    
    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductItem> productItems = new ArrayList<>();
    
    @Transient 
    private Customer customer;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;
    
    @Column(nullable = false)
    private LocalDateTime dateModification;
    
    @PrePersist
    protected void onCreate() {
        dateCommande = LocalDateTime.now();
        dateCreation = LocalDateTime.now();
        dateModification = LocalDateTime.now();
        if (statut == null) {
            statut = OrderStatus.PENDING;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }
    
    public enum OrderStatus {
        PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
    }
}
