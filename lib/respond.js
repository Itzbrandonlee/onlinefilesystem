const url = require('url');
const path = require('path');
const fs = require('fs');
const staticBasePath = path.join(__dirname, '..','static');

//import module functions in lib folder 
const buildBreadcrumb = require('./breadcrumb.js');
const buildMainContent = require('./mainContent.js');
const getMimeType = require('./getMimeType.js');



const respond = (request, response) => {
    let pathname = url.parse(request.url, true).pathname;

    if(pathname === '/favicon.ico'){
        return false;
    }

    pathname = decodeURIComponent(pathname); //built in function to decode uri pathnames

    const fullStaticPath = path.join(staticBasePath, pathname);

    if(!fs.existsSync(fullStaticPath)){
        console.log(`${fullStaticPath} does not exist`);
        response.write('404: File not found');
        response.end();
        return false;
    }


    let stats; 
    //displays file information 
    try{
        stats = fs.lstatSync(fullStaticPath);
    }catch(err){
        console.log(`lstatSync Error: ${err}`);
    }

    if(stats.isDirectory()){
        let data = fs.readFileSync(path.join(staticBasePath, 'project_files/index.html'), 'utf-8');

        console.log(pathname);
        let pathElements = pathname.split('/').reverse();
        pathElements = pathElements.filter(element => element !== '');
        const folderName = pathElements[0];
        console.log(folderName);
        console.log(pathElements);
        

        const breadcrumb = buildBreadcrumb(pathname);
        
        //build table rows 
        const mainContent = buildMainContent(fullStaticPath, pathname);


        //fill html template with data
        data = data.replace('page_title', folderName);
        data = data.replace('pathname', breadcrumb);
        data = data.replace('mainContent', mainContent);


        response.statusCode = 200;
        response.write(data);
        return response.end();
    }

    if(!stats.isFile()){
        response.statusCode = 401;
        response.write('401: Access Denied!');
        return response.end();
    }

    let fileDetails = {};
    fileDetails.extname = path.extname(fullStaticPath);
    
    getMimeType(fileDetails.extname)
    .then(mime => {
        let head = {};
        let options = {};
        let statusCode = 200;

        head['Content-Type'] = mime;
        //one option to loading files (readFile)
        // fs.promises.readFile(fullStaticPath, 'utf-8')
        // .then((data)=>{
        //         response.writeHead(statusCode, head);
        //         response.write(data);
        //         return response.end();
        //     })
        // .catch(error =>{
        //     console.log(error);
        //     response.statusCOde = 404;
        //     response.write('404: File reading error!');
        //     return response.end();
        // });
        
        //another way to read files that are faster using Streaming
        const fileStream = fs.createReadStream(fullStaticPath, options);
        response.writeHead(statusCode, head);
        fileStream.pipe(response);
        fileStream.on('close', () => {
            return response.end();
        });
        fileStream.on('error', error => {
            console.log(error.code);
            response.statusCode = 404;
            response.write('404: FileStream error!');
            return response.end();
        });

    })
    .catch(err => {
        response.statusCode = 500;
        response.write('500: Internal Server Error');
        return response.end();
    })
}

module.exports = respond;