// import http modul
const http = require('http');

// import file system modul
const fs = require('fs');

// users array
const users = [];


const requestHandler = (req, res)=>{

    const url = req.url;
    const method = req.method;
    res.setHeader('Content-Type', 'text.html');

    if(url==='/'){
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><h1>Enter Username!</h1>');
        res.write('<form method="POST" action="/create-user"><input type="text" name="username" /><button type="submit">send</button></form></body>');
        res.write('</html>');
        return res.end(); 
    }

    if(url === "/users"){
        res.write('<html>');
        res.write('<head><title>Users Page</title></head>');
        res.write('<body><ul>');

        for(let user in users){

            res.write('<li>'+user+'</li>');  

        }

        res.write('</ul>');    
        res.write('</body></html>');
        return res.end();
    }

    if(url === "/create-user" && method === "POST"){

        const dataChunks = [];
    
        req.on("data", (chunk)=>{
            dataChunks.push(chunk);
        });

        return req.on("end", ()=>{                      // return this listener so that the function does not get read beyond this code block
            const parsedChunks = Buffer.concat(dataChunks).toString();
            const user = parsedChunks.split('=')[1];
            console.log(user);  
            users.push(user);
            console.log(users);  

            fs.writeFile("users.txt", user, (error)=>{
                res.statusCode = 302;                       // Redirect the page to the location specified in res.setHeader 
                res.setHeader = ("Location", "/users");          
                res.end();                           // As above, exit function to avoid code below from running    
            });   // Used fs module to create/open a text file and write the data onto it

        });
    }

};

// create server
const server = http.createServer(requestHandler);

// create a local server request listener port 3000.
server.listen(3000);