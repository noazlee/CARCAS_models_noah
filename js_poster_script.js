//NODE JS
const puppeteer = require('puppeteer');
const fs = require("fs") // importing fs module - to see folders in a directory
const path = require("path") // importing path module

const folderList = []

async function generatePosterForModel(modelPath) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Assuming you have a local HTML file that contains the <model-viewer> element
    // You would need to dynamically set the src attribute of <model-viewer> to point to the modelPath
    const localHtmlPath = path.join(__dirname, "model-viewer-page.html") //CHANGE THIS
    await page.goto(localHtmlPath)

    // Set the model path dynamically
    await page.evaluate((modelPath) => {
        const modelViewer = document.querySelector('model-viewer')
        modelViewer.src = modelPath
    }, modelPath)

    await page.waitForSelector('model-viewer')
    await new Promise(resolve => setTimeout(resolve, 5000)) // Wait for model to load, adjust time as needed

    const modelViewerElement = await page.$('model-viewer')
    const imageBuffer = await modelViewerElement.screenshot({ type: 'webp' })

    // Save the screenshot to a file next to the model file
    const posterPath = modelPath.replace(/\.[^/.]+$/, "") + "-poster.webp"
    fs.writeFileSync(posterPath, imageBuffer)

    console.log(`Poster saved to ${posterPath}`)

    await browser.close()
}

function showPath(folderPaths){

    folderPaths.forEach(folderPath => {
        const results = fs.readdirSync(folderPath) // returns everything in the directory
        const folders = results.filter(res => fs.lstatSync(path.resolve(folderPath, res)).isDirectory()) //RETURNS ALL THE FOLDERS ONLY, NO FILES
        const innerFolderPaths = folders.map(folder => path.resolve(folderPath, folder))

        if(innerFolderPaths.length === 0){
            return
        }

        // console.log(innerFolderPaths)

        innerFolderPaths.forEach(innerFolder => folderList.push(innerFolder))

        showPath(innerFolderPaths)
    })    
}

const folderPaths = [path.resolve(__dirname, "CARCAS_models_noah")]
showPath(folderPaths)
// console.log(folderList)

for(var i=0; i<folderList.length; i++){
    folderPath = folderList[i]
    const results = fs.readdirSync(folderPath)

    const glbFiles = results.filter(file => file.endsWith('.glb'))
    const mtlFiles = results.filter(file => file.endsWith('.mtl'))

    if(glbFiles.length>0){
        console.log(folderPath)
        console.log(glbFiles)
        const glbFilePath = path.resolve(folderPath, glbFiles[0])
        if(haveNoPoster(folderPath)){
            addPlaceholderPoster(folderPath, glbFilePath)
        }
    }
    // if(mtlFiles.length>0){
    //     console.log(folderPath)
    //     console.log(mtlFiles)
    //     if(haveNoPoster(folderPath)){
    //         addPlaceholderPoster(folderPath,mtlFiles[0])
    //     }
    // }
}

function addPlaceholderPoster(folderPath, glbFilePath){
    const posterFilePath = path.join(folderPath, 'placeholder-poster.webp')
    const posterContent = generatePosterForModel(glbFilePath)
    fs.writeFileSync(posterFilePath, posterContent) //replace '' with actual poster content
    console.log("added a new poster at {posterFilePath}")
}

function haveNoPoster(folderPath){
    const results = fs.readdirSync(folderPath)
    const webpFiles = results.filter(file => file.endsWith('.webp'))
    if(webpFiles.length==0){
        console.log("No Poster!")
        return true
    }
    return false
}

//THIS IS NOT WORKING BECAUSE ALL THE FUNCTIONS NEED TO BE ASYNCHRONOUS, MAKING A NEW FILE.