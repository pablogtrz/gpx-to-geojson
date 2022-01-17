const { DOMParser } = require("xmldom")
const fs = require("fs")
const { gpx } = require("@mapbox/togeojson")
const config = require("./config")
const INPUT_FOLDER = "./input"
const OUTPUT_FOLDER = "./output"

if (!fs.existsSync(INPUT_FOLDER)) fs.mkdirSync(INPUT_FOLDER)
if (!fs.existsSync(OUTPUT_FOLDER)) fs.mkdirSync(OUTPUT_FOLDER)

const inputFiles = fs.readdirSync(INPUT_FOLDER, "utf-8")
inputFiles.forEach(parseGpx)

function parseGpx(fileName) {
    const inputFilePath = `${INPUT_FOLDER}/${fileName}`
    const outputFilePath = `${OUTPUT_FOLDER}/${fileName}`.replace('.gpx', '.json')

    const fileParsedFromDom = readFile(inputFilePath)
    const geoJsonFile = gpx(fileParsedFromDom)
    
    geoJsonFile.features = geoJsonFile.features.map(
        (feature) => {
            if (feature.properties?.attributeType === undefined) feature.properties.attributeType = '0'
            return feature
        }
    )

    if (config.removeWaypoints) {
        geoJsonFile.features = geoJsonFile.features.filter(
            (feature) => feature.geometry.type !== "Point"
        )
    }
    geoJsonFile.properties = {}
    if (config.creator) geoJsonFile.properties.creator = config.creator
    if (config.summary) geoJsonFile.properties.summary = config.summary

    const outputText = JSON.stringify([geoJsonFile], null, 4)
    writeFile(outputFilePath, outputText)
}

function readFile(filePath) {
    return new DOMParser().parseFromString(
        fs.readFileSync(filePath, "utf-8")
    )
}

function writeFile(filePath, text) {
    fs.writeFile(filePath, text, (err) => {
        if (err) throw new Error(err)
    })
}