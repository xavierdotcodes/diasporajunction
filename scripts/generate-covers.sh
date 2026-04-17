#!/bin/bash

# Folder containing hero videos
VIDEO_DIR="./static/videos"
# Folder to save cover images
COVER_DIR="$VIDEO_DIR/covers"

# Make sure the covers folder exists
mkdir -p "$COVER_DIR"

# Loop through all mp4 files in VIDEO_DIR
shopt -s nullglob  # prevents error if no files match
for video in "$VIDEO_DIR"/*.mp4; do
    filename=$(basename "$video" .mp4)
    output="$COVER_DIR/${filename}-cover.jpg"

    # Skip if cover already exists
    if [ -f "$output" ]; then
        echo "Cover already exists: $output"
        continue
    fi

    # Extract first frame at 1 second
    ffmpeg -i "$video" -ss 00:00:01 -vframes 1 "$output"
    echo "Generated cover for $video → $output"
done
