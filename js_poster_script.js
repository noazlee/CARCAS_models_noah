const fs = require('fs');
const path = require('path');

function searchForPosters(rootDirectory) {
    // Read the contents of the root directory
    fs.readdir(rootDirectory, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${rootDirectory}`, err);
            return;
        }

        // Iterate over each item in the directory
        files.forEach(file => {
            const itemPath = path.join(rootDirectory, file);

            // Check if the item is a directory
            fs.stat(itemPath, (err, stats) => {
                if (err) {
                    console.error(`Error checking item: ${itemPath}`, err);
                    return;
                }

                if (stats.isDirectory()) {
                    // Recursively search subdirectories
                    searchForPosters(itemPath);
                } else {
                    // Check if the item is a GLB file
                    if (file.toLowerCase().endsWith('.glb')) {
                        const webpFile = path.join(rootDirectory, `${path.parse(file).name}.webp`);
                        // Check if a corresponding WEBP file exists
                        fs.access(webpFile, fs.constants.F_OK, (err) => {
                            if (err) {
                                console.log(`No poster found for GLB file: ${file}`);
                            } else {
                                console.log(`Poster found for GLB file: ${file}`);
                            }
                        });
                    }
                }
            });
        });
    });
}

// Define the target directory to start the search
const targetDirectory = '/path/to/your/root/directory';
searchForPosters(targetDirectory);