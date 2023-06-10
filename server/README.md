# My Profile Server

Server for myprofile.

## Description

A basic server for myprofile project.

### Installing

* execute the npm install in the server directory

```
npm install 
```

### Executing program

* execute npm start to execute the server
```
npm start 
```

### Accessing API

* Login Authentication [POST]
* {
"email" : "larrymark2003@gmail.com",
"password" : "mark1234"
}
```
http://localhost:3001/auth/login
```

* Get The Users Data [GET]
```
http://localhost:3001/users/:id
```
* Register The User [POST]
* {
	"firstName": "Larry Mark",
	"lastName" : "Somocor",
	"email": "larrymark2003@gmail.com",
	"password" : "mark1234"
}
```
http://localhost:3001/auth/register 
```




## Authors

Contributors names and contact info

Larry Mark B. Somocor

## Version History

* 0.1
    * Initial Release

