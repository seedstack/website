---
title: "Data obfuscation"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedSecurity"
tags:
    - "security"
    - "data"
    - "example"
menu:
    SeedSecurity:
        weight: 70
---

The goal of `DataObfuscationHandler` is to obfuscate a specific type of data (eg. name, salary, PAN). For instance, it 
could take a name, eg. "Doe" and return an anonymised name "D.". This would be implemented as follow:

    /*
     * This {@code DataObfuscationHandler} takes a {@code String}, eg. "Doe" and
     * obfuscate it into "D.".
     */
    public static class NameObfuscator implements DataObfuscationHandler<String> {

		@Override
		public String obfuscate(String data) {
			String result = "";
			if (data != null && data.length() > 0) {
				result = data.charAt(0) + ".";
                result = result.toUpperCase();
			}
			return result;
		}
		
	}

Here is the interface of the `DataObfuscationHandler`:

    public interface DataObfuscationHandler<T> {
    
       /**
        * this methods will contains the logic to obfuscate your data given as input.
        * <p>
        * For instance an obfuscation rule on name "Dupont" could be "D."
        * <p>
        * 
        * @param data the actual input to obfuscate.
        * @return the data obfuscated.
        */
       T obfuscate(T data);
       
    }
