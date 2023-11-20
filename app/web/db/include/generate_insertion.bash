#!/usr/bin/env bash

set -e

display_usage() {
    echo "Usage:"
    echo -e "\t-h\t\tDisplay help."
    echo -e "\t-f\t\tFile path to the source csv file (Required). The headers must match column names."
    echo -e "\t-t\t\tName of table to insert (Required)."
}

while getopts "hf:t:" opt; do
    case "$opt" in
        h)
            display_usage
            exit 0
            ;;
        f)
            FILENAME="${OPTARG}"
            ;;
        t)
            TABLE="${OPTARG}"
            ;;
        *)
            display_usage
            exit 1
            ;;
    esac
done

generate_sql() {
    # Set up 
    local temp_dir="$(mktemp -d)"

    cp "$FILENAME" $temp_dir/tmp.csv

    cd $temp_dir

    # Trim ending comma(s)
    sed -i 's/\s*,*\s*$//g' tmp.csv

    # Extract columns
    local columns=$(head -n 1 tmp.csv | tr -d "\r\n")

    local statement="INSERT INTO \"${TABLE}\" ($columns) VALUES"

    local values=()

    while read l; do
        value=$(echo $l | sed "s/,/','/g" | tr -d "\r\n")
        value="('$value'),"
        values+=($value)
    done < <(tail -n +2 tmp.csv)


    statement="$(echo "$statement ${values[@]}" | sed 's/,$/;/')"
    echo "$statement"

    # Clean up
    rm -rf $temp_dir
}

generate_sql "$@"