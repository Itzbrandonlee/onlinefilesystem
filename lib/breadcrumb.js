const path = require('path');
const buildBreadcrumb = pathname => {
    const pathChunks = pathname.split('/').filter(element => element !== '');
    let breadcrumb = `<li class="breadcrumb-item"><a href="/">Home</a></li>`;
    let link = '/';
    pathChunks.forEach((item, index) => {
        link = path.join(link, item);
        if(index !== pathChunks.length - 1){
            breadcrumb +=  `<li class="breadcrumb-item"><a href="${link}">${item}</a></li>`;
        }else {
            breadcrumb += `<li class="breadcrumb-item active" aria-cureent="page">${item}</li>`;
        }

  
    });
    console.log(breadcrumb);
    console.log(link);
    return breadcrumb;
};

module.exports = buildBreadcrumb;