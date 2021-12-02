import csv
import json


# Function to convert a CSV to JSON
# Takes the file paths as arguments
def csv_to_json_key(csvFilePath, jsonFilePath):
    # create a dictionary
    data = {}

    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)

        # Convert each row into a dictionary
        # and add it to data
        for rows in csvReader:
            # Assuming a column named 'No' to
            # be the primary key
            key = rows['clue_id']
            data[key] = rows

    # Open a json writer, and use the json.dumps()
    # function to dump data
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))


def csv_to_json(csvFilePath, jsonFilePath):
    jsonArray = []

    # read csv file
    with open(csvFilePath, encoding='utf-8') as csvf:
        # load csv file data using csv library's dictionary reader
        csvReader = csv.DictReader(csvf)

        # convert each csv row into python dict
        for row in csvReader:
            # add this python dict to json array
            jsonArray.append(row)

    # convert python jsonArray to JSON String and write to file
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonString = json.dumps(jsonArray, indent=4)
        jsonf.write(jsonString)


def main():

    failures = ['layer_shifting', 'stringing', 'warping', 'under-extrusion', 'blobs']

    for f in failures:
        csv_to_json('./failure_data_csv/' + f + '_case_clue_csv/case-Table 1.csv', './static/json/' + f + '_case.json')
        csv_to_json('./failure_data_csv/' + f + '_case_clue_csv/clue-Table 1.csv', './static/json/' + f + '_clue.json')


if __name__ == "__main__":
    main()