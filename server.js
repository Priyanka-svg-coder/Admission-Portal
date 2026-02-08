import {createServer} from 'http'
import path from 'path'
import { fileURLToPath } from 'url'
import { readFile } from 'fs/promises'
import { writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;;


const server = createServer(async(req, res) => {
    console.log(req.method, req.url)

    if(req.url === '/favicon.ico') {
        res.end()
        return;
    }

    if(req.method === 'GET' ) {
        if(req.url === '/') {
            const filepath = path.join(__dirname, "public", "index.html");
            const html = await readFile(filepath);

            res.writeHead(200, {"content-type" : "text/html"});
            res.end(html);
            return;
        }

        else if(req.url === '/admission') {
             const filepath = path.join(__dirname, "public", "admission.html");
             const html = await readFile(filepath);
             
             res.writeHead(200, {"content-type" : "text/html"});
             res.end(html);
             return;
        }

        else if(req.url.endsWith(".css")) {
            const filePath = path.join(__dirname, "public", req.url);
            const css = await readFile(filePath);

            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(css);
            return;
        }

        res.writeHead(404)
        res.end("Page not found")
    }

    if(req.method === 'POST' && req.url === '/apply') {
        let body = ""

        req.on("data", (chunk) => {
            body += chunk.toString();
        })

        req.on("end", async() => {
            const data = new  URLSearchParams(body);

            const admission = {
                name: data.get("name"),
                email: data.get("email"),
                phone: data.get("phone"),
                course: data.get("course")
            };

            const filePath = path.join(__dirname, "data", "admission.json");

            const existingdata = JSON.parse(await readFile(filePath));   //
            existingdata.push(admission);

            await writeFile(filePath, JSON.stringify(existingdata, null, 2));

            res.writeHead(200, {"content-type" : "text/html"})
            res.end(`
            <link rel="stylesheet" href="/style.css">
            <h2>Application Submitted Successfully </h2>
            <p>Thank you, ${admission.name}</p>
            <a href="/">Go back to Home</a>`)
            
        })
        return;
    }
})

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})