package com.fashionify.backend.controller.shop;

import com.fashionify.backend.entity.Cart;
import com.fashionify.backend.entity.Order;
import com.fashionify.backend.entity.User;
import com.fashionify.backend.repository.CartRepository;
import com.fashionify.backend.repository.OrderRepository;
import com.fashionify.backend.repository.UserRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/shop/order")
public class ShopOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody Order orderDetails) {
        Optional<User> userOpt = userRepository.findById(orderDetails.getUser().getId());
        if (userOpt.isEmpty()) {
             return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }

        Order order = new Order();
        order.setUser(userOpt.get());
        order.setCartId(orderDetails.getCartId());
        order.setOrderStatus("pending");
        order.setPaymentMethod(orderDetails.getPaymentMethod());
        order.setPaymentStatus("pending");
        order.setTotalAmount(orderDetails.getTotalAmount());
        order.setOrderDate(LocalDateTime.now());
        order.setOrderUpdateDate(LocalDateTime.now());
        order.setAddressInfo(orderDetails.getAddressInfo());
        
        // Save order items
        if (orderDetails.getOrderItems() != null) {
            orderDetails.getOrderItems().forEach(order::addOrderItem);
        }
        
        Order savedOrder = orderRepository.save(order);
        
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            
            // Amount in paise (multiply by 100)
            int amountInPaise = (int) (orderDetails.getTotalAmount() * 100);
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + savedOrder.getId());

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String rzpOrderId = razorpayOrder.get("id");
            
            // Update order with razorpay tracking id
            savedOrder.setPaymentId(rzpOrderId);
            orderRepository.save(savedOrder);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "razorpayOrderId", rzpOrderId,
                    "amount", amountInPaise,
                    "currency", "INR",
                    "orderId", savedOrder.getId()
            ));
        } catch (RazorpayException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Error initializing Razorpay order: " + e.getMessage()));
        }
    }

    @PostMapping("/capture")
    public ResponseEntity<?> capturePayment(@RequestBody Map<String, String> payload) {
        String razorpayPaymentId = payload.get("razorpayPaymentId");
        String razorpayOrderId = payload.get("razorpayOrderId");
        String razorpaySignature = payload.get("razorpaySignature");
        Long orderId = Long.parseLong(payload.get("orderId"));

        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            // Verify Signature
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            boolean isValidSignature = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (isValidSignature) {
                Order order = orderOpt.get();
                order.setPaymentStatus("paid");
                order.setOrderStatus("confirmed");
                order.setPaymentId(razorpayPaymentId);
                order.setPayerId(razorpayOrderId);
                
                orderRepository.save(order);

                // Delete Cart
                Optional<Cart> cartOpt = cartRepository.findByUserId(order.getUser().getId());
                cartOpt.ifPresent(cart -> {
                    cart.getItems().clear();
                    cartRepository.save(cart);
                });

                return ResponseEntity.ok(Map.of("success", true, "message", "Order confirmed successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid Razorpay signature"));
            }
        } catch (RazorpayException e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Error verifying payment"));
        }
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<?> getAllOrdersByUser(@PathVariable Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return ResponseEntity.ok(Map.of("success", true, "data", orders));
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent()) {
            return ResponseEntity.ok(Map.of("success", true, "data", order.get()));
        }
        return ResponseEntity.notFound().build();
    }
}
