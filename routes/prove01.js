// import file system modul
const fs = require('fs');

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
        res.write('<li>User1</li>');  
        res.write('<li>User2</li>');  
        res.write('<li>User3</li>');   
        res.write('</ul>');    
        res.write('</body></html>');
        return res.end();
    }

    if(url === "/create-user" && method === "POST"){

        const users = [];
        const dataChunks = [];
    
        req.on("data", (chunk)=>{
            dataChunks.push(chunk);
        });
    
        req.on('end', ()=>{
            const parsedChunks = Buffer.concat(dataChunks).toString();
            const user = parsedChunks.split('=')[1];
            console.log(user);    
        });

        return req.on("end", ()=>{                      // return this listener so that the function does not get read beyond this code block
            const parsedChunks = Buffer.concat(dataChunks).toString();
            const user = parsedChunks.split('=')[1];
            console.log(user);  
            users.push(user);
            console.log(users);  

            fs.writeFile("users.txt", users, (err)=>{
                res.statusCode = 302;                       // Redirect the page to the location specified in res.setHeader 
                res.setHeader = ("Location", "/");          // "/" is the same location as the app.
                res.end();                           // As above, exit function to avoid code below from running    
            });   // Used fs module to create/open a text file and write the data onto it

        });
    }

};

module.exports = requestHandler;