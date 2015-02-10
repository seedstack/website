The following code shows how to create a simple "Hello World" REST resource.

    @Path("/hello")
    public class HelloResource {

        @GET
        @Produces("text/plain")
        @Path("/{param}")
        public String sayHi(@PathParam("param") String msg) {
            return "Hello "+msg;
        }

    }

The result in your browser will look like:

![hello]({seed-doc}/views/rest/img/hello.png)











