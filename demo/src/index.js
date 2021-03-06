const express = require('express')
const PNG = require("pngjs").PNG
const ffi = require('ffi-napi');
const bodyParser = require('body-parser');

const app = express()
const port = 8080

//Serve public folder
app.use(express.static('public'));

//Decode octet-stream to req.body
app.use(bodyParser.raw({
    inflate: true,
    limit: '80mb',
    type: 'application/octet-stream'
}));

//Define the library API (see r2ddoc.h)
//http://jakegoulding.com/rust-ffi-omnibus/string_return/
const libr2ddoc = ffi.Library('lib/libr2ddoc.so', {
    "lib2ddoc_data_to_json": ['char *', ['char *', 'int']],
    "lib2ddoc_image_to_json": ['char *', ['char *', 'int', 'int', 'int']],
    "lib2ddoc_free_json": ['void', ['char *']]
});


app.post('/decode', (req, res) => {
    console.log(`[${req.ip}] Start processing...`);

    const base64 = req.body.toString().replace(/^data:image\/png;base64,/, "");
    const png = PNG.sync.read(new Buffer.from(base64, 'base64'));

    const jsonPtr = libr2ddoc.lib2ddoc_image_to_json(png.data, png.width, png.height, 600);
    const json = jsonPtr.readCString();
    
    libr2ddoc.lib2ddoc_free_json(jsonPtr);

    res.send(json);
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})