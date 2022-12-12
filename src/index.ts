import express from 'express'
import path from 'path';
import { municipios } from './helper';

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`)
})

app.get('/', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname+'/pages/welcome.html'))
})

app.get('/pueblos', (req,res)=>{
    res.status(200).send(municipios)
})