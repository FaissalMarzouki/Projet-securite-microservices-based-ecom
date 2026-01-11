package org.marzouki.productservice.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor @AllArgsConstructor @Getter @Setter @Builder @ToString
public class Product {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false)
    private double price;
    
    @Column(nullable = false)
    private int quantity;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;
    
    @Column(nullable = false)
    private LocalDateTime dateModification;
    
    @jakarta.persistence.PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        dateModification = LocalDateTime.now();
    }
    
    @jakarta.persistence.PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }
}
