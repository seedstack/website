---
title: "Custom parsers"
type: "addon"
zones:
    - "Addons"
sections:
    - "AddonsFunctions"
addons:
    - "Import/Export"
menu:
    AddonsFunctionsIO:
        weight: 40
---

If available parsers doesn't fit your needs, IO function provide a SPI (Service Provider Interface) for custom parsers.
There is three kind of parser available: parser with static template, dynamic template or without template.

# Parser with static template
Parsers with static template initialize template with files from `META-INF/templates` directory. For instance, `
JasperTemplate` is initialized with a `.jrxml` file.

Create a new one, require to extend three classes: `AbstractBaseTemplate`, `AbstractBaseStaticTemplateLoader` and
`AbstractTemplateParser`.

- Template have all information on the file to parse.
- Parser is able to transform an `InputStream` with the template into a model.
- Template loader initialize template with corresponding resource from `META-INF/template` directory

# Parser with dynamic template

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
			// Returns the name of the associated renderer if exists, null otherwise
			return "MyTemplateRenderer";
		}

		@Override
		public String templateParser() {
			// Returns the name of the associated parser
			return "MyTemplateParser";
		}

	}

# Parser without template

Extends `AbstractBaseParser` and annotate it with `Named`.


	@Named("custom")
	public class CustomParser<PARSED_OBJECT> extends AbstractBaseParser<PARSED_OBJECT> {

		public CustomParser() {
		}

		@Override
		public List<PARSED_OBJECT> parse(InputStream inputStream, Class<PARSED_OBJECT> clazz) {
            List<PARSED_OBJECT> beans = new ArrayList<PARSED_OBJECT>();
			return beans;
		}

	}

Then call it as usual:

	@Parse("custom")
	Parser parser;