package com.fashionify.backend.controller.admin;

import com.fashionify.backend.entity.Order;
import com.fashionify.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/get")
    public ResponseEntity<?> getAllOrdersForAdmin() {
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(Map.of("success", true, "data", orders));
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> getOrderDetailsForAdmin(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent()) {
            return ResponseEntity.ok(Map.of("success", true, "data", order.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setOrderStatus(statusMap.get("orderStatus"));
            order.setOrderUpdateDate(LocalDateTime.now());
            orderRepository.save(order);
            return ResponseEntity.ok(Map.of("success", true, "message", "Order status is updated successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
