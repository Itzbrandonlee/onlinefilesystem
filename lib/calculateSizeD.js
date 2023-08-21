const { execSync } = require('child_process');

const calculateSizeD = itemFullStaticPath => {
    //gets file size info
    const itemFullStaticPathCleaned = itemFullStaticPath.replace(/\//g, '\ ');
    const commandOutput = execSync(`du -sh "${itemFullStaticPathCleaned}"`).toString();

    //remove all spaces tabs etc
    let filesize = commandOutput.replace(/\s/g, '\ ');

    //split file size
    filesize = filesize.split('\ ');

    //human size is first item in array
    filesize = filesize[0];

    //convert to K or M bytes
    const filesizeUnit = filesize.replace(/\d|\./g, ''); //separate out M or K
    const filesizeNumber = parseFloat(filesize.replace(/[a-z]/i, '')); //separate out number

    const units = "BKMGT";
    const filesizeBytes = filesizeNumber * Math.pow(1000, units.indexOf(filesizeUnit));


    return [filesize, filesizeBytes];

};

module.exports = calculateSizeD;