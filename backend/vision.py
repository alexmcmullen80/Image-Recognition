import os
import json
import boto3
from google.cloud import vision
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

# initialize the Google Vision client
client = vision.ImageAnnotatorClient()


image_dir = "public/images/"
output_metadata = "public/image_metadata.json"
image_metadata = []

try:
    # ensure the image directory exists
    if not os.path.exists(image_dir):
        raise FileNotFoundError(f"Image directory '{image_dir}' not found.")

    # list images in the directory
    image_files = [f for f in os.listdir(image_dir) if f.endswith((".jpg", ".png", ".jpeg"))]
    if not image_files:
        raise FileNotFoundError(f"No valid image files found in directory '{image_dir}'.")

    # set up AWS S3 client
    s3_client = boto3.client('s3')
    s3_bucket_name = 'my-image-metadata-bucket'  
    s3_image_folder = 'images/'  

    # process each image file in the directory
    for image_file in image_files:
        image_path = os.path.join(image_dir, image_file)

        # load the image
        with open(image_path, "rb") as image:
            content = image.read()

        # use Google Vision to apply labels to images
        response = client.label_detection(image=vision.Image(content=content))
        labels = [label.description for label in response.label_annotations]

        # append the metadata for this image
        image_metadata.append({
            "file_name": image_file,
            "tags": labels
        })

        # upload the image to S3
        s3_object_name = f"{s3_image_folder}{image_file}"  
        with open(image_path, 'rb') as image_data:
            s3_client.upload_fileobj(image_data, s3_bucket_name, s3_object_name)
        print(f"Uploaded {image_file} to S3 bucket {s3_bucket_name} as {s3_object_name}")

    # save the metadata to a JSON file locally
    os.makedirs(os.path.dirname(output_metadata), exist_ok=True)
    with open(output_metadata, "w") as outfile:
        json.dump(image_metadata, outfile, indent=4)

    print(f"Metadata saved to {output_metadata}")

    # upload the metadata JSON file to S3 bucket
    s3_metadata_object_name = 'image_metadata.json' 
    with open(output_metadata, 'rb') as data:
        s3_client.upload_fileobj(data, s3_bucket_name, s3_metadata_object_name)
    print(f"Metadata uploaded to S3 bucket {s3_bucket_name} as {s3_metadata_object_name}")

except FileNotFoundError as e:
    print(f"Error: {e}")
except NoCredentialsError:
    print("Error: No AWS credentials found. Please configure your credentials.")
except PartialCredentialsError:
    print("Error: Incomplete AWS credentials configuration.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
