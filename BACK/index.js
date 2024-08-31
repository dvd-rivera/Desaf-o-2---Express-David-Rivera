const express = require('express')
const fs = require('fs')
const app = express()
const cors = require('cors')
app.listen(3000, console.log('server on'))
app.use(express.json())

// Permite usar los cors y poder llamar API desde otro ruta y/o servidor
app.use(cors())

// Función para resumir la lectura
function readJson(fileName) {
    try {
        const data = fs.readFileSync(fileName, 'utf8')
        return JSON.parse(data)
    } catch (err) {
        console.error('Error al leer el archivo:', err)
        return null
    }
}

// Leer el archivo JSON
const songs = readJson('songs.json')

// Función para simplificar la escritura -- recibe el nombre del archivo y el contenido
function writeJson(fileName, fileContent) {
    const content = JSON.stringify(fileContent, null, 4) // Formatear JSON con 2 espacios
    fs.writeFileSync(fileName, content)
}

//Recibe los datos correspondientes a una canción y la agrega al repertorio.
app.post('/canciones', (req, res) => {
    const newSong = req.body
    const newSongsList = songs
    newSongsList.push(newSong)
    writeJson('songs.json', newSongsList)
    res.send('Cancion agregada con éxito!')
})

// Devuelve un JSON con las canciones registradas en el repertorio
app.get('/canciones', (req, res) => {
    res.json(songs)
})

// Recibe los datos de una canción que se desea editar y la actualiza manipulando el JSON local.
app.put('/canciones/:id', (req, res) => {
    const { id } = req.params
    const newSong = req.body
    const newSongsList = songs
    const index = newSongsList.findIndex((s) => s.id == id)
    newSongsList[index] = newSong
    writeJson('songs.json', newSongsList)
    res.send('Canción modificada con éxito')
})

// Recibe por queryString el id de una canción y la elimina del repertorio.
app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params
    console.log(id)
    const newSongsList = songs
    const index = newSongsList.findIndex((s) => s.id == id)
    newSongsList.splice(index, 1)
    writeJson('songs.json', newSongsList)
    res.send('Canción eliminada con éxito')
})
