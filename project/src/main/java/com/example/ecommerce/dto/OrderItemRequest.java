package com.example.ecommerce.dto;

import lombok.Data;

@Data

public class OrderItemRequest {
    private Long productId;
    private int quantity;

    public Long getProductId() {
        return productId;
    }

    public int getQuantity() {
        return quantity;
    }
}
