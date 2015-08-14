---
title: "Unit testing"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedTest"
tags:
    - "test"
    - "maven"
    - "example"
    - "junit"
menu:
    SeedTest:
        weight: 20
---

This support is mainly a bundle of some of the most famous unit test tools and libraries (JUnit, Mockito, AssertJ, etc.)
Remember: good unit tests **run quickly and do not depend on any resources (database , mom or ws connection, ...)**

# Maven dependency

Add the following dependency in your pom.xml

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-unittest-support</artifactId>
        <scope>test</scope>
    </dependency>

# Test example

This example is **not** a tutorial of how to create tests.
You can use all the framework libraries included in Seed unit test support (refer to the support pom.xml).

    public class CustomerServiceImplUnitTest {
    
        private CustomerService underTest;
    
        private CustomerRepository mockRepository =  mock(CustomerRepository.class);
    
        @Before
        public void setUp() throws Exception {
            underTest  = new CustomerServiceImpl();
            Whitebox.setInternalState(underTest, "customerRepository", mockRepository);
    
        }
    
        @Test
        public void testCreateOrUpdateCustomer_customer_without_id() throws Exception {
            Customer c = new Customer();
            c.setFirstName("firstname");
            c.setLastName("lastname");
    
            //change the behavior of mock repository
            when(mockRepository.save(c)).thenAnswer(new Answer<Customer>() {
                @Override
                public Customer answer(InvocationOnMock invocationOnMock) throws Throwable {
                    Customer customer = (Customer) invocationOnMock.getArguments()[0];
                    customer.setEntityId(new CustomerId("test@mail.com"));
                    return customer;
                }
            });
    
    
            final Customer result = underTest.createOrUpdateCustomer(c);
    
            Assertions.assertThat(result.getFirstName()).isEqualTo("firstname");
            Assertions.assertThat(result.getEntityId()).isNotNull();
    
           //check if persit method  is never called
           verify(mockRepository, times(0)).persist(any(Customer.class));
           //check if persit method  is call only one time
           verify(mockRepository, times(1)).save(any(Customer.class));
        }
    }




