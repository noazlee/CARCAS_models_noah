import os
import datalad.api as dl
import js2py as jp

# Define the GitHub repository URL
github_repo_url = 'github://noazlee/CARCAS_models_noah'

def search_for_posters(root_directory):
    posters_found = False

    # Iterate over each item in the root directory
    for item in os.listdir(root_directory):
        item_path = os.path.join(root_directory, item)

        if os.path.isdir(item_path):  # Check if the item is a directory
            search_for_posters(item_path)  # Recursively call the function for subdirectories
        else:
            # Check if the item is a poster file (.webp)
            if item.lower().endswith('.webp'):
                posters_found = True
                print(f"Poster found: {item_path}")

    # Print success message if no posters were found in the directory
    if not posters_found:
        print(f"No posters found in directory: {root_directory}")
        addPoster(root_directory)

def addPoster(directory):
    # Call the JavaScript function to generate the poster
    generate_poster_js = '''
    async function generatePoster(glbFilePath, outputFilePath) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Load a webpage with ModelViewer
        await page.goto('file:///path/to/your/model-viewer.html'); // REPLACE WITH URL OF THE MODEL VIEWERS

        // Wait for ModelViewer to load
        await page.waitForSelector('model-viewer');

        // Set the GLB source to the provided file path
        await page.evaluate((glbFilePath) => {
            const modelViewer = document.querySelector('model-viewer');
            modelViewer.src = glbFilePath;
        }, glbFilePath);

        // Wait for ModelViewer to render the GLB
        await page.waitForFunction(() => {
            const modelViewer = document.querySelector('model-viewer');
            return modelViewer.readyState === 'complete';
        });

        // Capture a screenshot of the ModelViewer
        await page.screenshot({ path: outputFilePath });

        await browser.close();
    }

    // Call the generatePoster function with the GLB file path and the output file path
    generatePoster('path/to/your/model.glb', 'path/to/output/poster.webp');
    '''
    jp.eval_js(generate_poster_js)

def main():
    # Define the target directory to fetch the dataset
    target_directory = '/Users/noahlee/Documents/CARCAS_models_noah/CARCAS_models_noah'  # Set to the current directory

    # Manually clone the datalad data before doing this so you make sure the data is as updated as possible.

    # Traverse through the fetched dataset to search for posters
    search_for_posters(target_directory)

    

main()