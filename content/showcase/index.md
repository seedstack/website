---
title: "Showcase"
type: "home"
zones:
    - "Showcase"
sections:
    - "ShowcaseDomain"
menu:
    ShowcaseDomain:
        weight: 10
---

# Ecommerce domain 

The ecommerce domain model contains three use cases described
above. This domain is use for sample purpose and will be reused in our
other samples.

## Sign in

When a user want to sign in, he will fill in the required
information. This create a **customer** who has to be
**activated** to match the **customer specification**.

![sign in class diagram](./puml/showcase/activation.uml)

## Add product

Create a product and add it to a category.

![add product class diagram](./puml/showcase/product.uml)

## Buy products

When a **customer** purchases products, it create an **order**
containing all the **order items**. An order item is composed of a
**product** and the quantity requested. The customer doing the order
will have to satisfies the customer specification.

![buy product class diagram](./puml/showcase/order.uml)
