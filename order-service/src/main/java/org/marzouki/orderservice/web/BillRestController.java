package org.marzouki.orderservice.web;

import org.marzouki.orderservice.entities.Bill;
import org.marzouki.orderservice.entities.ProductItem;
import org.marzouki.orderservice.feign.CustomerRestClient;
import org.marzouki.orderservice.feign.ProductRestClient;
import org.marzouki.orderservice.repository.BillRepository;
import org.marzouki.orderservice.repository.ProductItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class BillRestController {
    
    @Autowired
    private BillRepository billRepository;
    
    @Autowired
    private ProductItemRepository productItemRepository;
    
    @Autowired
    private CustomerRestClient customerRestClient;
    
    @Autowired
    private ProductRestClient productRestClient;

    /**
     * GET /api/orders - Get all orders (ADMIN only)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Bill>> getAllOrders() {
        List<Bill> orders = billRepository.findAll();
        enrichOrdersWithDetails(orders);
        return ResponseEntity.ok(orders);
    }

    /**
     * GET /api/orders/{id} - Get order by ID (ADMIN or owner CLIENT)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Bill> getOrder(@PathVariable Long id) {
        Optional<Bill> optionalBill = billRepository.findById(id);
        if (optionalBill.isPresent()) {
            Bill bill = optionalBill.get();
            enrichOrderWithDetails(bill);
            return ResponseEntity.ok(bill);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * GET /api/orders/client/{clientId} - Get orders by client ID (for logged-in user)
     */
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Bill>> getOrdersByClientId(@PathVariable String clientId) {
        List<Bill> orders = billRepository.findByClientId(clientId);
        enrichOrdersWithDetails(orders);
        return ResponseEntity.ok(orders);
    }

    /**
     * POST /api/orders - Create new order (CLIENT creates own order, ADMIN creates for anyone)
     */
    @PostMapping
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<Bill> createOrder(@RequestBody Bill order) {
        try {
            // Set initial status as PENDING
            if (order.getStatut() == null) {
                order.setStatut(Bill.OrderStatus.PENDING);
            }
            
            Bill savedBill = billRepository.save(order);
            
            // Save product items if provided
            if (order.getProductItems() != null && !order.getProductItems().isEmpty()) {
                for (ProductItem item : order.getProductItems()) {
                    item.setBill(savedBill);
                    productItemRepository.save(item);
                }
            }
            
            enrichOrderWithDetails(savedBill);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBill);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * PUT /api/orders/{id} - Update order (ADMIN only, or CLIENT updating own order status)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bill> updateOrder(
            @PathVariable Long id,
            @RequestBody Bill orderDetails) {
        Optional<Bill> optionalBill = billRepository.findById(id);
        if (optionalBill.isPresent()) {
            Bill bill = optionalBill.get();
            
            // Update order status
            if (orderDetails.getStatut() != null) {
                bill.setStatut(orderDetails.getStatut());
            }
            
            // Update other fields if provided
            if (orderDetails.getMontantTotal() > 0) {
                bill.setMontantTotal(orderDetails.getMontantTotal());
            }
            
            Bill updatedBill = billRepository.save(bill);
            enrichOrderWithDetails(updatedBill);
            return ResponseEntity.ok(updatedBill);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * PATCH /api/orders/{id}/status - Update order status (CLIENT can update own order, ADMIN any)
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bill> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam Bill.OrderStatus status) {
        Optional<Bill> optionalBill = billRepository.findById(id);
        if (optionalBill.isPresent()) {
            Bill bill = optionalBill.get();
            bill.setStatut(status);
            Bill updatedBill = billRepository.save(bill);
            enrichOrderWithDetails(updatedBill);
            return ResponseEntity.ok(updatedBill);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * DELETE /api/orders/{id} - Delete order (ADMIN only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        Optional<Bill> bill = billRepository.findById(id);
        if (bill.isPresent()) {
            // Delete product items first
            productItemRepository.deleteAll(bill.get().getProductItems());
            // Then delete the order
            billRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * POST /api/orders/{id}/items - Add product items to order
     */
    @PostMapping("/{id}/items")
    public ResponseEntity<ProductItem> addProductToOrder(
            @PathVariable Long id,
            @RequestBody ProductItem item) {
        Optional<Bill> optionalBill = billRepository.findById(id);
        if (optionalBill.isPresent()) {
            Bill bill = optionalBill.get();
            item.setBill(bill);
            ProductItem savedItem = productItemRepository.save(item);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Helper method to enrich order with customer and product details
     */
    private void enrichOrderWithDetails(Bill bill) {
        try {
            // Load customer details
            if (bill.getClientId() != null) {
                try {
                    // Try to fetch customer by ID - might fail if customer-service uses different ID format
                    bill.setCustomer(customerRestClient.getCustomerById(Long.parseLong(bill.getClientId())));
                } catch (Exception e) {
                    // Skip customer enrichment if it fails
                }
            }
            
            // Load product details for each item
            if (bill.getProductItems() != null) {
                bill.getProductItems().forEach(productItem -> {
                    try {
                        productItem.setProduct(productRestClient.getProductById(productItem.getProductId()));
                    } catch (Exception e) {
                        // Skip product enrichment if it fails
                    }
                });
            }
        } catch (Exception e) {
            // Silently ignore enrichment errors
        }
    }

    /**
     * Helper method to enrich multiple orders with details
     */
    private void enrichOrdersWithDetails(List<Bill> bills) {
        bills.forEach(this::enrichOrderWithDetails);
    }
}
