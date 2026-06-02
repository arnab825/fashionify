package com.fashionify.backend.controller.shop;

import com.fashionify.backend.entity.Cart;
import com.fashionify.backend.entity.CartItem;
import com.fashionify.backend.entity.Product;
import com.fashionify.backend.entity.User;
import com.fashionify.backend.repository.CartRepository;
import com.fashionify.backend.repository.ProductRepository;
import com.fashionify.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/shop/cart")
public class ShopCartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, String> payload) {
        Long userId = Long.parseLong(payload.get("userId"));
        Long productId = Long.parseLong(payload.get("productId"));
        int quantity = Integer.parseInt(payload.get("quantity"));

        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Product> productOpt = productRepository.findById(productId);

        if (userOpt.isEmpty() || productOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User or Product not found"));
        }

        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(userOpt.get());
            return newCart;
        });

        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem newItem = CartItem.builder()
                    .product(productOpt.get())
                    .quantity(quantity)
                    .build();
            cart.addItem(newItem);
        }

        Cart savedCart = cartRepository.save(cart);
        return ResponseEntity.ok(Map.of("success", true, "data", savedCart));
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (cartOpt.isPresent()) {
            return ResponseEntity.ok(Map.of("success", true, "data", cartOpt.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update-cart")
    public ResponseEntity<?> updateCartItemQuantity(@RequestBody Map<String, String> payload) {
        Long userId = Long.parseLong(payload.get("userId"));
        Long productId = Long.parseLong(payload.get("productId"));
        int quantity = Integer.parseInt(payload.get("quantity"));

        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            Optional<CartItem> itemOpt = cart.getItems().stream()
                    .filter(item -> item.getProduct().getId().equals(productId))
                    .findFirst();

            if (itemOpt.isPresent()) {
                if (quantity <= 0) {
                    cart.removeItem(itemOpt.get());
                } else {
                    itemOpt.get().setQuantity(quantity);
                }
                Cart savedCart = cartRepository.save(cart);
                return ResponseEntity.ok(Map.of("success", true, "data", savedCart));
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Long userId, @PathVariable Long productId) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            Optional<CartItem> itemOpt = cart.getItems().stream()
                    .filter(item -> item.getProduct().getId().equals(productId))
                    .findFirst();

            if (itemOpt.isPresent()) {
                cart.removeItem(itemOpt.get());
                Cart savedCart = cartRepository.save(cart);
                return ResponseEntity.ok(Map.of("success", true, "data", savedCart));
            }
        }
        return ResponseEntity.notFound().build();
    }
}
