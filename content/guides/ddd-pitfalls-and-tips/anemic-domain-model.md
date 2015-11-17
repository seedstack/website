---
title: "Anemic Domain Model"
guide: "DDD pitfalls and tips"
author: "SeedStack"
menu:
    DDDPitfallsAndTipsGuide:
        weight: 20
---

An Anemic Domain Model is something that can be found a lot of projects and, astonishingly, is often viewed as a good 
practice. But as you may already have deduced from its name, it doesn't sound like something desirable and certainly not 
in DDD-oriented software.

And indeed it isn't. An Anemic Domain Model is the result of having all, or almost all, the behavior of the Domain in
separate classes (often called Services) that are directly changing the internal state of entities through setters. In
that case the entities are merely a data model (often projected from a relational model through an ORM) with no
behavior at all. To recognize if your software suffers from the Anemic Domain Model anti-pattern, consider the following
questions:

* Do all the classes of your model have mostly public getters and setters and no, or almost no business logic ?
* Do the classes that use your model contain the business logic of the system ?

If you answered "No" to both questions, no worry, your project doesn't seem to suffer this problem. If you answered "Yes"
to both questions, read-on, we will analyze the situation. As you may have guessed, there is no other valid answer 
combination.

# Disadvantages of an Anemic Domain Model

The main disadvantage of an Anemic Domain Model is that it costs you the same as a Rich Domain Model to build and you
get little to no benefit in return:

* The encapsulation OOP principle, which is very important to create and maintain complex systems is violated. You allow
any code to change your model internal state without any sanity check and as such cannot ensure that the model is in a
correct and valid state.
* The model is a lot less expressive since all behavior has been stripped out of it.
* The model is completely untestable because we cannot ensure that the model doesn't get invalid at some point.  
* Business logic is wholly implemented in a procedural-style separate layer, which mixes domain logic and application
logic.
 
The greatest irony comes when you still use an Object/Relational mapping, with its often heavy associated cost, and finally 
end up with procedures altering data holders. Put bluntly, this is simply bad design.

# Bad example

Consider a `Customer` class which only has public getters and setters for a few attributes. Then consider the following 
example service that is client of an Anemic Domain Model:
 
    public class CustomerServiceImpl implements CustomerService {
        @Inject
        private Repository<Customer> customerRepository;
    
        @Inject
        private Factory<Customer> customerFactory;
    
        @Transactional
        public void saveCustomer(
                String id,
                String firstName,
                String lastName,
                String street,
                String city,
                String postalCode,
                String String phone,
                String email) {
            Customer customer = customerRepository.load(id);
    
            if (customer == null) {
                customer = customerFactory.create(customerId);
                customerRepository.persist(customer);
            }
    
            customer.setFirstName(firstName);
            customer.setLastName(lastName);
            customer.setStreet(street);
            customer.setCity(city);
            customer.setPostCode(postalCode);
            customer.setPhone(phone);
            if (email != null) {
                customer.setEmail(email);
            }
    
            customerRepository.save(customer);
        }
    
    }
  
This service operation can be used in dozen of different business circumstances, like changing its address, updating
its phone number, or even creating a new customer. This may seem awesome at first sight but this method can work in 
various invalid ways and the model cannot prevent it. It also has a number of additional problems:

* No business intention is revealed by the `saveCustomer()` interface.
* The `Customer` domain object is just a data holder, not an object.
* Even if the service operation contains additional validation logic and checks, it cannot be guaranteed that there 
is no other badly implemented service which will potentially corrupt the model.
 
# Refactoring to goodness

The first thing we could do is to create intention-revealing operations on the `Customer` class itself, that draw their
names from the {{< term "Ubiquitous Language" >}}, and implement business behavior in them:

    public class Customer {
        
        public void changePersonalName(String firstName, String lastName) { ... }
        public void relocateTo(PostalAddress newPostalAddress) { ... }
        public void changeTelephone(Telephone newTelephone) { ... }
        public void disconnectTelephone() { ... }
        public void changeEmail(EmailAddress newEmailAddress) { ... }
        
    }

We can immediately see that the business intentions are clearly apparent here and that additional behavior linked to 
these intentions can now be easily implemented *and enforced* in the `Customer` class itself. This logic is testable
and those tests will ensure that `Customer` objects will behave correctly. Furthermore, we can now ensure that no `Customer` 
object can be used invalidly by its clients.

This is perhaps not the best design for a `Customer` but as it reveals its intentions and capabilities, this design can
then be improved upon, instead of being kept implicit and dependent of its callers. Note that in our quest of 
expressiveness, we also introduced some Value Objects like `Telephone`, `PostalAddress` or `EmailAddress` which will 
contain additional encapsulated business logic about them.
 
The service will also be refactored to reflect explicit business intentions:

    public class CustomerServiceImpl implements CustomerService {
        @Inject
        private Repository<Customer> customerRepository;
    
        @Transactional
        public void changeCustomerName(
                        String customerId, 
                        String newFirstName, 
                        String newLastName) {
            
            Customer customer = customerRepository.load(customerId);
            
            if (customer == null) {
                throw new IllegalStateException("Customer doesn't exist");
            }
            
            customer.changePersonalName(newFirstName, newLastName);
        }
        
    }
    
Now this method can only be used in a well-defined business case that everyone can understand by reading the code. The
terms coming from the Ubiquitous Language are now clearly apparent and as they are shared across the
team (including business experts), there is little to no possible misunderstanding about what this really does.

{{% callout info %}}
The result is a software design that not only is fully functional and correct, but also directly relates to and reflect 
business knowledge.
{{% /callout %}}


    