---
title: "Transactional support"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedSpring"
tags:
    - "spring"
    - "transaction"
    - "test"
menu:
    SeedSpring:
        weight: 20
---

You can specify a Spring-based transaction handler in your SEED transaction demarcation by adding the
`@SpringTransactionManager` annotation besides the `@Transactional` one.

# Spring transaction manager definition

You can define any valid Spring transaction manager in any Spring context known by SEED Spring support. Example:
		
	<bean id="transactionManager" class="org.springframework.orm.hibernate3.HibernateTransactionManager">
		<property name="sessionFactory" ref="sessionFactory" />
	</bean>

The value of the `@SpringTransactionManager` annotation is used to choose the right transaction manager. Its default
value is `transactionManager`. Example of use in an integration test:

	@RunWith(SeedITRunner.class)
	public class SpringTransactionHandlerIT {
	
		@Inject
		@Named("customerDao")
		CustomerDao customerDao;
	
		@Test
		@Transactional
		@SpringTransactionManager("myTransactionManager")
		public void testTransactional() {
			Assertions.assertThat(customerDao).isNotNull();
			Customer customer = new Customer("john", "doe", "john.doe@gmail.com",
					null);
			customerDao.save(customer);
			customerDao.delete(customer);
			Assertions.assertThat(customer).isNotNull();
		}

	}
