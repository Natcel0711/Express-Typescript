import express, { Request, Response, NextFunction, response } from 'express'
import { municipios } from './helper';

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`)
})

app.get('/', (req, res)=>{
    res.status(200).send(
        `<div><h1>Welcome</h1></div><div><a href="/yellow">Click me</a></div>`
    )
})

app.get('/yellow', (req,res)=>{
    res.status(200).send(municipios)
})