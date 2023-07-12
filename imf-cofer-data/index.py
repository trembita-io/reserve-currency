import csv
import json
from copy import deepcopy
from datetime import datetime

with open('imf-cofer-data/COFER_06-13-2023 14-37-14-34_timeSeries.csv', newline='') as csvfile:
    jsonResult = { 'createdAt': str( datetime.utcnow() ), 'data': [] }
    meteDataToRemove = ['\ufeff\"Country Name\"', 'Country Code', 'Attribute']

    reader = csv.DictReader(csvfile)
    for row in reader:
        if row['Country Code'] == '001':
            for remove in meteDataToRemove:
                del row[remove]
            
            clearedRow = deepcopy(row);
            for attr, value in row.items():
                if attr == '' or value == '':
                    del clearedRow[attr]

            jsonResult['data'].append(clearedRow)

    # # Serializing json
    json_object = json.dumps(jsonResult, indent=4)

    # Writing to sample.json
    with open("imf-cofer-data/imf-cofer-data.json", "w") as outfile:
        outfile.write(json_object)