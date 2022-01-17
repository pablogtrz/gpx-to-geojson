# GPX to GeoJson parser

Parser to convert GPX file into a valid GeoJson for Leaflet HeighGraph plugin.

## Usage

1. Install dependencies with `npm install` or `yarn`
2. Move .gpx files into /input folder. They will be parsed and moved into /ouput folder with same file name.
3. Run script using `npm run parse` or `yarn parse`

## Config file

You MUST create a `config.js` file into root folder with following structure:

```js
module.exports = {
    creator: 'John Doe',
    summary: 'Elevation',
    removeWaypoints: true,
}
```