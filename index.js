const { DOMParser } = require("xmldom")
const fs = require("fs")
const { gpx } = require("@mapbox/togeojson")
const inputFolder = "./input"
const outputFolder = "./output"

const REMOVE_WAYPOINTS = true
const PROPS_CREATOR = "José Carlos Gutiérrez"
const PROPS_SUMMARY = "Altimetría"

const inputFiles = fs.readdirSync(inputFolder, "utf-8")

inputFiles.forEach(parseGpx)
function parseGpx(fileName) {
    const inputFilePath = `${inputFolder}/${fileName}`
    const outputFilePath = `${outputFolder}/${fileName}`.replace('.gpx', '.json')

    const fileParsedFromDom = readFile(inputFilePath)
    const geoJsonFile = gpx(fileParsedFromDom)

    if (REMOVE_WAYPOINTS) {
        geoJsonFile.features = geoJsonFile.features.filter(
            (feature) => feature.geometry.type !== "Point"
        )
    }
    geoJsonFile.properties = {}
    if (PROPS_CREATOR) geoJsonFile.properties.creator = PROPS_CREATOR
    if (PROPS_SUMMARY) geoJsonFile.properties.summary = PROPS_SUMMARY

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