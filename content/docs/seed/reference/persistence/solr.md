---
title: "Solr"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedPersistence"
menu:
    SeedPersistence:
        weight: 50
---

The support integrates **[Solr Java API (SolrJ)](https://cwiki.apache.org/confluence/display/solr/Using+SolrJ)** which allows to interact with a **Solr server**.
To understand how **Solr** works and if it suits your requirements, please check the [website](http://lucene.apache.org/solr/).

# Usage

In order to communicate with a  **Solr server**, just define the appropriate configuration and inject the client (`org.apache.solr.client.solrj.SolrServer` class) accordingly . 

>Four kinds of client implementations are available: `HTTP` (HTTP Solr server), `LBHTTP` (LoadBalanced Http Server), `CLOUD` (CloudSolr server) and `EMBEDDED` (Embedded instance just for tests)

# Configuration

Declare your list of clients (props file) in order to have them managed by SEED:

```
[org.seedstack.seed]
persistence.solr.clients= **myClient1**, **myClient2**, ...
```

Add properties to your Solr client by specifying a section as follows:

```
[org.seedstack.seed.persistence.solr.client.**myClient1**]
property.serverType=EMBEDDED
property.httpLBservers=
property.collection=test1
property.deleteOnExit=true

[org.seedstack.seed.persistence.solr.client.**myClient2**]

property.serverType=HTTP
property.serverHome=http://myClient2Host:8983/solr
property.httpLBservers=
property.collection=
property.deleteOnExit=

```


# Example

Configuration example for an embedded Solr server.

```
[org.seedstack.seed]
persistence.solr.clients= **client1**
[org.seedstack.seed.persistence.solr.client.client1]
property.serverType=EMBEDDED
property.httpLBservers=
property.collection=test1
property.deleteOnExit=true

```
>Seed store all solr embedded resources in a `persistence-solr` folder located in the configured application storage. Please refer to the storage configuration documentation for more information [here](#!/dev-guide/operations/application-storage "storage configuration").

All `org.apache.solr.client.solrj.SolrServer` interactions have to be realized inside a transaction. Refer to the Transaction support [documentation](#!/seed-doc/transaction) for more detail. Below is an example using the annotation-based transaction demarcation (notice the `client1` client name in @SolrClient annotation)

```


@RunWith(SeedITRunner.class)
public class SolrEmbeddedIT {

	@Inject
	SolrServer solrServer;

	@Test
	@Transactional
	@SolrClient("client1")
	public void index_and_join_search_two_different_embedded_collection() throws SolrServerException, IOException {
		addDocumentUnit1();

		QueryResponse rsp = readDoc();

		SolrDocumentList docsrch = rsp.getResults();

		Assertions.assertThat(docsrch).isNotNull();

		deleteStorage1();

	}


	private QueryResponse readDoc() throws SolrServerException {
		SolrQuery query = new SolrQuery();

		query.setQuery("*:*");

		QueryResponse rsp = solrServer.query(query);
		return rsp;
	}


	private void deleteStorage1() throws SolrServerException, IOException {
		solrServer.deleteByQuery("*:*");
	}



	private void addDocumentUnit1() throws SolrServerException, IOException {
		Assertions.assertThat(solrServer).isNotNull();

		Personne personne1 = new Personne();
		personne1.setId("1");
		personne1.setFirstname("Gerard");
		personne1.setLastname("Menvussa");

		Personne personne2 = new Personne();
		personne2.setId("2");
		personne2.setFirstname("Sarah");
		personne2.setLastname("FRAICHI");
		
		Collection<Personne> personnes = new ArrayList<Personne>();
		personnes.add(personne1);
		personnes.add(personne2);

		solrServer.addBeans(personnes);

	}
}

```
