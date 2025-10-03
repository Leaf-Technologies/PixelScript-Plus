# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# (Optional) If you want to explicitly copy only specific files:
# COPY PixelScript.py LICENSE logo.png /app/

# Install dependencies if requirements.txt exists
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; fi

# Set the default command to run your app using PixelScript.py
CMD ["python", "PixelScript.py"]
