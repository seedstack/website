---
title: "Step 3 - The application"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedTutorial"
tags:
    - onboarding
menu:
    GettingStartedTutorial:
        weight: 40
---

The application layer is located in the `org.myorg.myapp.application` package. It is responsible for
driving the application workflow, executing the use cases of the system.<!--more--> 

We will define an application service, responsible for completing the checkout of an order by a seller:

    @Service
    public interface CheckoutService {
        void checkout(Order order) throws CheckoutException;
    }

A checkout exception is needed:

    public class CheckoutException extends Exception {
        public CheckoutException(String message) {
            super(message);
        }
    }

Its implementation will fake a lookup of the currently authenticated seller and use it to complete the checkout, updating
its bonus in the process:

    class CheckoutServiceImpl implements CheckoutService {
        @Inject
        @Morphia
        Repository<Seller, Long> sellerRepository;
        @Inject
        @Morphia
        Repository<Order, Long> orderRepository;
        @Inject
        BonusService bonusService;

        @Override
        public void checkout(Order order) throws CheckoutException {
            Optional<Seller> authenticatedSeller = getAuthenticatedSeller();
            if (authenticatedSeller.isPresent()) {
                // Do the checkout
                order.checkout();
                orderRepository.save(order);

                // Update seller info
                Seller seller = authenticatedSeller.get();
                bonusService.updateSellerBonus(seller, order);
                sellerRepository.save(seller);
            } else {
                throw new CheckoutException("No user authenticated or current user is not a seller");
            }
        }

        public Optional<Seller> getAuthenticatedSeller() {
            return Optional.of(sellerRepository.load(1L));
        }
    }

This implementation uses JSR-330 injection:

* Two default Morphia repositories are injected, one for the seller and one for the order. Default repositories are automatically
created by the business framework without additional coding. They support basic CRUD operations and can be injected with
the `Repository` generic interface.
* The domain service `BonusService` is injected.

It is time now to add some mock data to our system, avoiding the need for us to code all nuts and bolts. We will do so
with a `LifecycleListener`, located in the `org.myorg.myapp.infrastructure` package, which will be
executed after the startup and before the shutdown of the application:

    public class MockLifecycleListener implements LifecycleListener {
        @Inject
        @Morphia
        private Repository<Order, Long> orderRepository;
        @Inject
        @Morphia
        private Repository<Product, Long> productRepository;
        @Inject
        @Morphia
        private Repository<Seller, Long> sellerRepository;
        @Inject
        private OrderingService orderingService;

        @Override
        public void started() {
            clearData();

            // Sellers
            sellerRepository.persist(new Seller(1, new Date()));

            // Products
            productRepository.persist(new Product(1, "Product 1", 350));
            productRepository.persist(new Product(2, "Product 2", 420));
            productRepository.persist(new Product(3, "Product 3", 320));
            productRepository.persist(new Product(4, "Product 4", 100));
            productRepository.persist(new Product(5, "Product 5", 76));

            // Customer 1 orders
            orderRepository.persist(buildOrder(1, 1, 2));
            orderRepository.persist(buildOrder(2, 1, 5));
            orderRepository.persist(buildOrder(3, 1, 3));

            // Customer 2 orders
            orderRepository.persist(buildOrder(4, 2, 8));
        }

        @Override
        public void stopping() {
            clearData();
        }

        private Order buildOrder(long id, long customerId, int itemCount) {
            Order order = new Order(id, customerId);

            Random random = new Random();
            long productCount = productRepository.count();
            for (int i = 0; i < itemCount; i++) {
                Product product = productRepository.load((Math.abs(random.nextLong()) % productCount) + 1);
                orderingService.addProductToOrder(order, product, random.nextInt(5) + 1);
            }

            order.checkout();

            return order;
        }

        private void clearData() {
            orderRepository.clear();
            productRepository.clear();
            sellerRepository.clear();
        }
    }

This `LifecycleListener` will add one seller, several products and orders to clean database collections.
