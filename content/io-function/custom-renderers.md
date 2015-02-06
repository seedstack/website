If available renderers doesn't fit your needs, IO function provide a SPI (Service Provider Interface) for custom renderers. There is three kind of renderer available: renderer with static template, dynamic template or without template.

# Renderer with static template
Renderers with static template initialize template with files from `META-INF/templates` directory. For instance, `JasperTemplate` is initialized with a `.jrxml` file.

Create a new one, require to extend three classes: `AbstractBaseTemplate`, `AbstractBaseStaticTemplateLoader` and `AbstractTemplateRenderer`. 

- Template have all informations on the file to render. 
- Renderer is able to transform a model with the template in an outputstream.
- Template loader initialize template with corresponding resource from `META-INF/template` directory

# Renderer with dynamic template

For dynamic template directly implement `TemplateLoader` interface instead of `AbstractBaseStaticTemplateLoader`.

	public class MyDynamicTemplateLoader implements TemplateLoader<MyTemplate> {

		@Override
		public MyTemplate load(String name) throws Exception {
			// Gets your template from anywhere
			return myTemplate
		}

		@Override
		Set<String> names() {
			// Returns all the templates you know
			return names;
		}
	
		@Override
		boolean contains(String name) {
			// Checks if you know this template
			return bool;
		}

		@Override
		public String templateRenderer() {
			// Returns the name of the associated renderer
			return "MyTemplateRenderer";
		}

	}

# Renderer without template

Extends `AbstractBaseRenderer` and annotate it with `Named`.


	@Named("custom")
	public class CustomRenderer extends AbstractBaseRenderer {
	
		
		public CustomRenderer() {
		}
	
		@Override
		public void render(OutputStream outputStream, Object model) {
			render(outputStream, model, null, null);
		}
	
		@Override
		public void render(OutputStream outputStream, Object model, String mimeType, Map<String, Object> parameters) {
			try {
				outputStream.write("Hello World!".getBytes());
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
		}
	
	}

Then call it as usual:

	@Renderer("custom")
	Renderer renderer;