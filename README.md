# LoginUsingLdapAuthentication
This code demonstrates how to login to a system using LDAP Authentication service
To login to any system that uses LDAP server for storing the records of a person.

1. You should know the LDAP URL of the server.
2. You should know whether it uses LDAPS(Secure) or LDAP for connecting to that particular server.
3. I have used here express-session to store session of a particular successful login till that person logs out.
4. You have to create a client in your code which will inturn connect to server for binding and authentication.
5. You need to pass options for searching a record in LDAP server.
6. After searching a successful record it will return with the DN.
7. Then for authentication you can bind the DN with the password provided by the user.
