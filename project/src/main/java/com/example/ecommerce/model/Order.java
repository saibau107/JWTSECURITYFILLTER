package com.example.ecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_order")
public class Order {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne
    private User user;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<OrderItem> items;
    
    private Double totalAmount;
    private String status;
}