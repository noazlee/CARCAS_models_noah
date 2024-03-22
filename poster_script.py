import os
import datalad.api as dl

# Define the GitHub repository URL
github_repo_url = 'github://noazlee/CARCAS_models_noah'

def fetch_carcas_data(target_directory):
    # Ensure the dataset is present
    dl.install(github_repo_url, recursive=True, path=target_directory)

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

def main():
    # Define the target directory to fetch the dataset
    target_directory = '.'  # Set to the current directory

    # Fetch CARCAS data from the Datalad dataset
    fetch_carcas_data(target_directory)

    # Traverse through the fetched dataset to search for posters
    search_for_posters(target_directory)

main()