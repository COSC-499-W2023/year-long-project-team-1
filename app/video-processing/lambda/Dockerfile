FROM public.ecr.aws/lambda/python:3.12
# Install the function's dependencies
# Copy file requirements.txt from your project folder and install
# the requirements in the app directory.

COPY requirements.txt  .
RUN  pip install -r requirements.txt

COPY ffmpeg /usr/bin/ffmpeg

# Copy helper functions
COPY video_processor.py video_processor.py

# Copy handler function (from the local app directory)
COPY  lambda.py  .

# Overwrite the command by providing a different command directly in the template.
CMD ["lambda.lambda_handler"]
