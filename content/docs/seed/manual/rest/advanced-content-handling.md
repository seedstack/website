---
title: "Advanced content handling"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedRest"
tags:
    - "jax-rs"
    - "serialization"
    - "streaming"
menu:
    SeedRest:
        weight: 50
---

# Working with streams

## Send a stream

To send bytes (i.e images) JAX-RS can return special stream :

     @GET
     @Produces("text/plain")
     public StreamingOutput  hello() {
         return new StreamingOutput() {
             @Override
             public void write(OutputStream output) throws IOException, WebApplicationException {
                 output.write("Hello World".getBytes());
             }
        };
     }

## Receive a stream

To read a data stream (file, image or bytes) JAX-RS can inject a Reader or an InputStream :

    @Path("/files")
    public class FileResource {

        @POST
        @Path("/upload")
        @Consumes("application/pdf")
        public void doSomething(InputStream is) {
            readFileWithInputStream(is);
        }

        @POST
        @Path("/upload-image")
        public void doSomethingWithReader(@FormDataParam("file") Reader reader) {
            readFileWithReader(reader);
        }

    }

# Message body writers and readers

This section will focus on **how to serialize and deserialize a custom format**. By Default JAX-RS can work with xml and json format. 
If your project requests a custom format, see the following steps :

- Create a class which implements MessageBodyWriter or/and MessageBodyReader with the custom format in generic.
- Add `@Provider`, `@Produces` or/and `@consumes`.
- Implement methods.

More documentation is available in package [javax.ws.rs.ext](https://jersey.java.net/apidocs/1.17/jersey/javax/ws/rs/ext/package-summary.html).
