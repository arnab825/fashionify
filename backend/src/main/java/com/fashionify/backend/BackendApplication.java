package com.fashionify.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	org.springframework.boot.CommandLineRunner initData(
			com.fashionify.backend.repository.UserRepository userRepository,
			com.fashionify.backend.repository.ProductRepository productRepository,
			com.fashionify.backend.repository.FeatureRepository featureRepository) {
		return args -> {
			userRepository.findByUserName("arnab20003").ifPresent(user -> {
				user.setRole("admin");
				userRepository.save(user);
			});

			if (featureRepository.count() == 0) {
				featureRepository.save(com.fashionify.backend.entity.Feature.builder()
						.image("https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop").build());
				featureRepository.save(com.fashionify.backend.entity.Feature.builder()
						.image("https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop").build());
				featureRepository.save(com.fashionify.backend.entity.Feature.builder()
						.image("https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop").build());
			}

			if (productRepository.count() == 0) {
				try {
					org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
					String url = "https://fakestoreapi.com/products?limit=8";
					java.util.List<java.util.Map<String, Object>> response = restTemplate.getForObject(url, java.util.List.class);
					if (response != null) {
						for (java.util.Map<String, Object> item : response) {
							com.fashionify.backend.entity.Product product = com.fashionify.backend.entity.Product.builder()
									.title((String) item.get("title"))
									.description((String) item.get("description"))
									.price(((Number) item.get("price")).doubleValue())
									.salePrice(null)
									.category((String) item.get("category"))
									.brand("Generic")
									.image((String) item.get("image"))
									.totalStock(100)
									.averageReview(4.5)
									.build();
							productRepository.save(product);
						}
					}
				} catch (Exception e) {
					System.out.println("Failed to fetch mock products: " + e.getMessage());
				}
			}
		};
	}
}
