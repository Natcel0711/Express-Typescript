import express from "express";
import path from "path";
import {
  municipios,
  convertAcreToSquareFeet,
  convertAcreToSquareMiles,
  convertAcreToSquareYards,
  convertAcreToHectares,
  BuscarStatsDePueblo,
  statsPueblo,
} from "./helper";

const app = express();
const PORT = 8080;

app.use(express.urlencoded());
app.use(express.json())

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname + "/pages/welcome.html"));
});

app.get("/pueblos", (req, res) => {
  res.status(200).end(
    JSON.stringify({municipios:municipios})
    );
});

app.get("/Cuerdas", (req, res) => {
  res.status(200).sendFile(path.join(__dirname + "/pages/cuerdas.html"));
});

app.post("/cuerdas/convert", async (req, res) => {
  console.log(req.body);
  let result;
  if (req.body.units == "square-feet") {
    result = await convertAcreToSquareFeet(req.body.cuerdas);
  } else if (req.body.units == "square-yards") {
    result = await convertAcreToSquareYards(req.body.cuerdas);
  } else if (req.body.units == "square-miles") {
    result = await convertAcreToSquareMiles(req.body.cuerdas);
  } else if (req.body.units == "hectares") {
    result = await convertAcreToHectares(req.body.cuerdas);
  }
  res.status(200).end(
    JSON.stringify({
    result: result,
  }));
});

app.get("/pueblo", async (req , res) => {
    try{
        const pueblo = req.body.pueblo
    if(!pueblo)
        res.status(400).end(JSON.stringify({
            error: "Se require un pueblo"
        }))
        const result = await statsPueblo(pueblo)
        return res.status(200).end(JSON.stringify({
            pueblo: result
        }))
    }
    catch(e){
        res.status(404).end(JSON.stringify(
            {
                error:e
            }
        ))
    }
})
