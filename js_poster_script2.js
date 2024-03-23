//IMPORTS
const puppeteer = require('puppeteer')
const fs = require("fs")
const path = require("path")

let fetch

const folderList = []

async function generatePosterForModel(modelPath) {

    if (!fetch) {
        fetch = (await import('node-fetch')).default; // Dynamically import fetch
    }

    const modelName = path.basename(modelPath, '.glb') // Assuming the extension is always .glb
    const imageUrl = `https://3dviewer.sites.carleton.edu/images/${encodeURIComponent(modelName)}`

    console.log(`Downloading image from: ${imageUrl}`)

    // Download the image
    const response = await fetch(imageUrl)
    if (!response.ok) {
        throw new Error(`Failed to fetch ${imageUrl}: ${response.statusText}`)
    }
    const imageBuffer = await response.buffer()

    // Determine the poster path and write the file
    const posterPath = modelPath.replace(/\.[^/.]+$/, "") + "-poster.webp"
    fs.writeFileSync(posterPath, imageBuffer)

    console.log(`Poster saved to ${posterPath}`)
}

async function showPath(folderPaths) {
    for (const folderPath of folderPaths) {
        const results = fs.readdirSync(folderPath)
        const folders = results.filter(res => fs.lstatSync(path.resolve(folderPath, res)).isDirectory())
        const innerFolderPaths = folders.map(folder => path.resolve(folderPath, folder))

        if (innerFolderPaths.length > 0) {
            await showPath(innerFolderPaths) // Await the recursive call
        }

        folderList.push(...innerFolderPaths)
    }
}

async function processFolders(folderPaths) {
    await showPath(folderPaths) //RECURSIVELY COLLECTS ALL DIRECTORIES IN FOLDERPATHS

    for (const folderPath of folderList) {
        const results = fs.readdirSync(folderPath)
        const glbFiles = results.filter(file => file.endsWith('.glb')) //RETURNS ONLY GLB FILES IN THE FOLDERS
        const finalFiles = glbFiles.filter(file => !file.includes("updated"))
        for (const glbFile of glbFiles) {
            const fullGlbPath = path.join(folderPath, glbFile);
            if (await haveNoPoster(folderPath)) {
                await generatePosterForModel(fullGlbPath) //GENERATE A POSTER WITH THIS GLB PATH
            }
        }
    }
}

async function haveNoPoster(folderPath) {
    const results = fs.readdirSync(folderPath);
    const webpFiles = results.filter(file => file.endsWith('.webp'))
    return webpFiles.length === 0;
}

(async () => {
    const folderPaths = [path.resolve(__dirname, "CARCAS_models_noah")]
    await processFolders(folderPaths) // PROCESSES EACH FOLDER AND GENERATES POSTERS
})()
