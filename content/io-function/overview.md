The IO function gives simple way to export and import data in multiple formats. This function comes with two modules:

 * CSV through SuperCSV,
 * JasperReports.

# Quick start

To use the IO function, enable it in your application by adding the maven dependency corresponding to the expected
module:

	<dependency>
	    <groupId>org.seedstack.functions.io</groupId>
	    <artifactId>seed-io-function-???</artifactId>
	</dependency>

...where ??? is jasper or supercsv.

# Writing CSV files
To export a POJO `CustomerBean` in a CSV file, import the seed-io-function-supercsv module. Then to export the following POJO.

	public class CustomerBean {
	
	    private String firstName;
	    
	    private String lastName;
	    
		private int age
	    ...
	}

Add a `customerbean.csv.properties` file in `META-INF/templates` directory.

`customerbean.csv.properties` content:

	columns=firstName,lastName,age

	firstName.name=First name
	lastName.name=Last name
	age.name=Age
	age.type=int


Then inject a renderer as described below.


	@Render("customerbean")
	private Renderer renderer;
	
	private List<CustomerBean> customers;
	
	public void exportCustomers(OuputStream os) {
	    renderer.render(os, customers);
	}

Or programmatically set the renderer name.

	@Inject
	private Renderers renderers;

	public void exportCustomers(OuputStream os, String name) {
		Renderer renderer = renderers.getRendererFor(name);
	    renderer.render(os, customers);
	}

# Reading CSV files
To import a POJO, the configuration is the same as export configuration. Then inject a `Parser` with the `@Parse` anntation as below.

	@Parse("customerbean")
	private Parser<CustomerBean> parser;
	
	private List<CustomerBean> customers;
	
	public void importCustomers(InputStream is) {
	    customers = parser.parse(is, CustomerBean.class);
	} 

Or use `Parsers` to programmatically set the parser name.
  
	@Inject
	private Parsers parsers;

	public void importCustomers(InputStream is, String name) {
		Parser parser = parsers.getParserFor(name);
	    renderer.render(os, customers);
		customers = parser.parse(is, CustomerBean.class);
	}

# Writing PDF files
To use jasper, add the seed-io-function-jasper module and put a JRXML file in `META-INF/templates` directory.
For instance with a `pdftemplate.jrxml`:

	@Render("pdftemplate")
	Renderer renderer;
	
	List<CustomerBean> customers;
	
	public void exportCustomers(OuputStream os) {
	    renderer.render(os, customers, "application/pdf", parameters);
	}

You can pass any Jasper parameter (like `SUBREPORT_DIR`) using the fourth parameter which is a `Map<String, Object>`.

*NB: The Jasper module does not provide parser*


