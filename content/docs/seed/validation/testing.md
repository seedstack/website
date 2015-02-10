In order to use validation while testing, just add the following Maven dependencies to your project:

    <!-- JAVAX EL -->
    <dependency>
        <groupId>javax.el</groupId>
        <artifactId>javax.el-api</artifactId>
        <version>2.2.4</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>com.inetpsa.fnd.seed</groupId>
        <artifactId>seed-integrationtest-support</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>de.odysseus.juel</groupId>
      <artifactId>juel-impl</artifactId>
      <version>2.2.6</version>
      <scope>test</scope>
    </dependency>

