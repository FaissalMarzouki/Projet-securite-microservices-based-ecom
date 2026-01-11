package org.marzouki.orderservice;

import org.marzouki.orderservice.entities.Bill;
import org.marzouki.orderservice.entities.ProductItem;
import org.marzouki.orderservice.feign.CustomerRestClient;
import org.marzouki.orderservice.feign.ProductRestClient;
import org.marzouki.orderservice.model.Customer;
import org.marzouki.orderservice.model.Product;
import org.marzouki.orderservice.repository.BillRepository;
import org.marzouki.orderservice.repository.ProductItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@SpringBootApplication
@EnableFeignClients
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class OrderServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrderServiceApplication.class, args);
	}
	
	@Bean
	CommandLineRunner commandLineRunner(BillRepository billRepository,
										ProductItemRepository productItemRepository,
										CustomerRestClient customerRestClient,
										ProductRestClient productRestClient){

		return args -> {
			try {
				Collection<Customer> customers = customerRestClient.getAllCustomers().getContent();
				Collection<Product> products = productRestClient.getAllProducts().getContent();

				customers.forEach(customer -> {
					Bill order = Bill.builder()
							.clientId(String.valueOf(customer.getId()))
							.statut(Bill.OrderStatus.PENDING)
							.build();
					Bill savedOrder = billRepository.save(order);
					
					products.forEach(product -> {
						int quantity = 1 + new Random().nextInt(10);
						ProductItem productItem = ProductItem.builder()
								.bill(savedOrder)
								.productId(product.getId())
								.quantity(quantity)
								.unitPrice(product.getPrice())
								.totalPrice(quantity * product.getPrice())
								.build();
						productItemRepository.save(productItem);
					});
				});
				System.out.println("✓ Order Service: Initial orders loaded successfully");
			} catch (Exception e) {
				System.out.println("⚠ Order Service: Warning - Could not load initial data from services: " + e.getMessage());
			}
		};
	}

}
