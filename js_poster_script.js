//NODE JS
const fs = require("fs") // importing fs module - to see folders in a directory
const path = require("path") // importing path module

function sayHi(folderPaths){

    folderPaths.forEach(folderPath => {
        const results = fs.readdirSync(folderPath)
        const folders = results.filter(res => fs.lstatSync(path.resolve(folderPath, res)).isDirectory()) //RETURNS ALL THE FOLDERS ONLY, NO FILES
        const innerFolderPaths = folders.map(folder => path.resolve(folderPath, folder))

        if(innerFolderPaths.length === 0){
            return
        }

        console.log(innerFolderPaths)
        sayHi(innerFolderPaths)
    })    
}

const folderPaths = [path.resolve(__dirname, "CARCAS_models_noah")]
sayHi(folderPaths)