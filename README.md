# Whatsapp-node client for Biteship
> _v0.1_  
Alvian Zachry Faturrahman

![image](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![image](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![image](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)
![image](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)

----

## About 📝

🔗 [whatsapp-web.js](https://wwebjs.dev/)  
A WhatsApp client library for NodeJS that connects through the WhatsApp Web browser app.

The project is a service that will send and receive whatsapp chat requests from a registered whatsapp account. The library uses `puppeteer` to run since whatsapp doesn't let any direct API calls aside from it's registered whatsapp for business APIs.  

This is a simple project to create a whatsapp web client using express and socket.io, with mongoose as an ODM (Object Document Model) to store session data since Whatsapp already stores the chats in its own internal database.

----
## Installation 🛠️

#### Clone the repository
 `git clone git@bitbucket.org:biteship/biteship-whatsapp-node.git`

#### Run npm install
 `npm i`

#### Modify `whatsapp-web.js` package on `node_modules`

Please find and change `INTRO_IMG_SELECTOR` variable on `node_modules/whatsapp-web.js/src/Client.js` for it to work to:

 `const INTRO_IMG_SELECTOR = '[data-icon=\'search\']';`

## API Documentation 📑

The API will be available on `${BASE_URL}/v1/:endpoint` route. List of available routes are:  

### Authorization
  
### `GET` - `/v1/authorization`

used to retrieve authorization status of the whatsapp client. If the client has not been logged in before it will return a `code` string that needs to be converted into a QR Code in the front end.

**Response object:**
``` 
{
    "success": Boolean,
    "qr_code": String,
    "auth": Boolean,
    "error": Object | String
} 
```

**Response example:**
``` 
{
    "success": true,
    "code": "2jsadh7h7h@,asdhuo3na1238489797649@1i,234811237=1"
    "auth": false,
    "error": null
}
```

### Chat

### `POST` - `/v1/chat/send`

used to send and retrieve chats from a whatsapp client.

**Request body:**
```
{
    "number": String,
    "message": String
}
```

**Response object:**
``` 
{
    "success": Boolean,
    "status": String,
    "message": String,
    "number": String,
    "error": Object | String
}
```

**Response example:**
```
{
    "success": true,
    "message": "test send from API",
    "number": "621378202071",
    "status": "Message Sent"
}
```