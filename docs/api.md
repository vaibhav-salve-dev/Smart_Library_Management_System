# API Documentation

## Base URL: ` http://localhost:3000/ `

## Authentication

1) ``` auth/register ```
   - It requires use information.You can check through postman by adding req.body as given in following exmaple
   - ex:<br> 
    {
    "name":"Suresh Patil",
    "email":"suresh@gmail.com",
    "password":"Suresh@123",
    "role":"member"
    } 

    - response:
       - for Success:
        {
    "success": true,
    "message": "User created successfully",
    "user": {
        "name": "Suresh Patil",
        "email": "suresh@gmail.com",
        "password": "$2b$10$6pVoNlavZ6xZoPt30Z8BJezmY5GX1Tkwxn2t1OKFx0xvAPsIt7GL.",
        "role": "member",
        "_id": "6a151a77b6f17a28e98d38f9",
        "createdAt": "2026-05-26T03:58:47.575Z",
        "updatedAt": "2026-05-26T03:58:47.575Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cmVzaEBnbWFpbC5jb20iLCJyb2xlIjoibWVtYmVyIiwiaWF0IjoxNzc5NzY3OTI3LCJleHAiOjE3Nzk4NTQzMjd9.8U9U5BmyxasvcZli4_KnM0fxURWZCmLRRCx7IsUB8k0"
}
       - for error/failure:
          - duplicate user:
            {
    "message": "User already registered",
    "error": "Conflict",
    "statusCode": 409
}



2) ``` auth/login ```
3) ``` auth/users ```