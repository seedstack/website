CSV template is define with a `*.csv.properties` file.
This properties gives you options to change general configuration, define format or provide custom validation.

The available options are:

 <table class="table table-bordered">
 <thead>
 <tr>
 <th>Key</th>
 <th>Default</th>
 <th>Description</th>
 </tr>
 </thead>
 <tbody>
     <tr>
	     <td>charsetName</td>
	     <td>UTF-8</td>
	     <td>Option to change the charset name.</td>
     </tr>
     <tr>
	     <td>quote</td>
	     <td>"</td>
	     <td>The quote character is used when a cell contains special characters, such as the delimiter char, a quote char, or spans multiple lines.</td>
     </tr>
     <tr>
	     <td>separator</td>
	     <td>;</td>
	     <td>The delimiter character separates each cell in a row.</td>
     </tr>
     <tr>
	     <td>endOfLine</td>
	     <td>\n</td>
	     <td>The end of line symbols to use when writing.</td>
     </tr>
     <tr>
	     <td>showHeader</td>
	     <td>true</td>
	     <td>If true, show the column headers.</td>
     </tr>
     <tr>
	     <td>columns</td>
	     <td>N/A</td>
	     <td><b>Mandatory</b>. List of the model fields to render.</td>
     </tr>
     <tr>
	     <td>xxxx.name</td>
	     <td>N/A</td>
	     <td>Header name to write. If the name property is not present the header will be the field name</td>
     </tr>
     <tr>
	     <td>xxxx.type</td>
	     <td>String</td>
	     <td>Available types are "date", "boolean", "int","double", "long", "bigdecimal".</td>
     </tr>
     <tr>
	     <td>xxxx.format</td>
	     <td>N/A</td>
	     <td>Used to format date, boolean and number (ex: <code>birthdate.format=dd/MM/yyyy</code>). For the boolean type you can specify how to write true or false values by two comma separated values: <code>married.format=Yes,No</code>.</td>
     </tr>
     <tr>
	     <td>xxxx.notNull</td>
	     <td>false</td>
	     <td>Is used to define if the field is optional or not.</td>
     </tr>
     <tr>
	     <td>xxxx.unique</td>
	     <td>false</td>
	     <td>Is used to define the field must be unique.</td>
     </tr>

 </tbody>
 </table>

For instance:
	
	# General configuration
	quote="
	separator=;
	endOfLine=\n
	charsetName=UTF-8

	columns=customerNo, firstName, lastName, birthDate, mailingAddress, married, numberOfKids, favouriteQuote, email, loyaltyPoints
	
	# customerNo (must be unique)
	customerNo.name=ID
	customerNo.nullable=false
	customerNo.unique=true
	
	# firstName
	firstName.name=First name
	firstName.nullable=false
	
	# lastName
	lastName.name=Last name
	lastName.nullable=false
	
	# birthDate
	birthDate.name=Birth date
	birthDate.nullable=false
	birthDate.type=date
	birthDate.format=dd/MM/yyyy
	
	# mailingAddress
	mailingAddress.name=Mailling address
	mailingAddress.nullable=false
	
	# married
	married.name=Married
	married.nullable=true
	birthDate.type=boolean
	birthDate.format=Yes,No
	
	# numberOfKids
	numberOfKids.name=Number of kids
	numberOfKids.nullable=true
	
	# favouriteQuote
	favouriteQuote.name=Favorite quote
	favouriteQuote.nullable=false
	
	# email
	email.name=Email
	email.nullable=false
	
	# loyaltyPoints
	loyaltyPoints.name=Loyalty points
	loyaltyPoints.nullable=false