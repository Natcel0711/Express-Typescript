import { chromium, Page } from "playwright";
import axios from 'axios';

export let municipios: Array<string> = [
  "Adjuntas",
  "Aguada",
  "Aguadilla",
  "Aguas Buenas",
  "Aibonito",
  "Arecibo",
  "Arroyo",
  "Añasco",
  "Barceloneta",
  "Barranquitas",
  "Bayamón",
  "Cabo Rojo",
  "Caguas",
  "Camuy",
  "Canóvanas",
  "Carolina",
  "Cataño",
  "Cayey",
  "Ceiba",
  "Ciales",
  "Cidra",
  "Coamo",
  "Comerío",
  "Corozal",
  "Culebra",
  "Dorado",
  "Fajardo",
  "Florida",
  "Guayama",
  "Guayanilla",
  "Guaynabo",
  "Gurabo",
  "Guánica",
  "Hatillo",
  "Hormigueros",
  "Humacao",
  "Isabela",
  "Jayuya",
  "Juana Díaz",
  "Juncos",
  "Lajas",
  "Lares",
  "Las Marías",
  "Las Piedras",
  "Loiza",
  "Luquillo",
  "Manatí",
  "Maricao",
  "Maunabo",
  "Mayagüez",
  "Moca",
  "Morovis",
  "Naguabo",
  "Naranjito",
  "Orocovis",
  "Patillas",
  "Peñuelas",
  "Ponce",
  "Quebradillas",
  "Rincón",
  "Rio Grande",
  "Sabana Grande",
  "Salinas",
  "San Germán",
  "San Juan",
  "San Lorenzo",
  "San Sebastián",
  "Santa Isabel",
  "Toa Alta",
  "Toa Baja",
  "Trujillo Alto",
  "Utuado",
  "Vega Alta",
  "Vega Baja",
  "Vieques",
  "Villalba",
  "Yabucoa",
  "Yauco",
];
interface Pueblo {
    Name: string;
    Localizacion: string;
    Topografia: string;
    Ilustres: string;
    Renombre: string;
    Gentilicio: string;
    Patrono: string;
    Parroquia: string;
    Elevacion: string;
    Poblacion: string;
    Densidad: string;
    DireccionPostal: string;
    Telefono: string;
    Fax: string;
  }
  interface ImageURL{
    Municipio:string;
    URL:string;
  }
export const convertAcreToSquareFeet = async (cuerdas: string) => {
  let x: number = +cuerdas;
  return 0.97 * x * 43560;
};
export const convertAcreToSquareYards = async (cuerdas: string) => {
  let x: number = +cuerdas;
  return 0.97 * x * 4840;
};
export const convertAcreToSquareMiles = async (cuerdas: string) => {
  let x: number = +cuerdas;
  return (0.97 * x) / 640;
};
export const convertAcreToHectares = async (cuerdas: string) => {
  let x: number = +cuerdas;
  return 0.97 * x * 0.404686;
};
export const statsPueblo = async (pueblo:string):Promise<Pueblo> => {
    var fs = require('fs');
    const data = await fs.promises.readFile('stats.json', 'utf8');
    const pueblos: Pueblo[] = JSON.parse(data);
    for (const stat of pueblos) {
        if (stat.Name === pueblo) {
          // If a match is found, return the object.
          return stat;
        }
      }
    
      // If no match was found, return null.
      return null;
}
export const flagPueblo = async (pueblo:string):Promise<ImageURL> => {
  var fs = require('fs');
  const data = await fs.promises.readFile('flags.json', 'utf8');
  const flags: ImageURL[] = JSON.parse(data);
  for (const flag of flags) {
      if (flag.Municipio.toLowerCase() === pueblo) {
        // If a match is found, return the object.
        return flag;
      }
    }
  
    // If no match was found, return null.
    return null;
}
export const BuscarStatsDePueblo = async (pueblo: string) => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    console.log("getting info...");
    await page.goto(
      "https://pr.gov/Directorios/pages/directoriodemunicipios.aspx"
    );
    let listPueblos = [];
    //foreach
    for (let index = 0; index < municipios.length; index++) {
      const texts = await findAnchorTag(page, municipios[index]);
      const Pueblo:Pueblo = {
        Name: municipios[index],
        Localizacion: texts[0],
        Topografia: texts[1],
        Ilustres: texts[2],
        Renombre: texts[3],
        Gentilicio: texts[4],
        Patrono: texts[5],
        Parroquia: texts[6],
        Elevacion: texts[7],
        Poblacion: texts[8],
        Densidad: texts[9],
        DireccionPostal: texts[10],
        Telefono: texts[11],
        Fax: texts[12],
      };
      listPueblos.push(Pueblo);
      await page.goBack()
    }
    var fs = require('fs');
    fs.writeFile('stats.json', JSON.stringify(listPueblos), err => {
        if (err) {
          throw err
        }
        console.log('JSON data is saved.')
      })
    await browser.close();
  } catch (e) {
    console.log("error:", e);
  }
};

async function findAnchorTag(page: Page, str: string): Promise<string[]> {
  try {
    console.log(page.url())
    const anchors = await page.$$("a");
    for (const anchor of anchors) {
      const text = await anchor.innerText();
      if (text === str) {
        // Click the anchor tag and wait for the navigation to complete.
        console.log("Found it");
        // Get the href attribute of the anchor tag.
        const href = await anchor.getAttribute("href");

        // Navigate to the URL specified by the href attribute.
        await page.goto("https://pr.gov" + href);

        // Get the page content and log it to the console.
        const elements = await page.$$(".TextPeq");
        const texts = await Promise.all(elements.map((e) => e.innerText()));
        // Return from the function to stop searching for anchor tags.
        return texts;
      }
    }
    console.log(" No anchor found: ", str)
    // If no anchor tag was found, log a message to the console.
    return [];
  } catch (e) {
    console.log("Error: ", e);
  }
}

export async function getFirstImageUrl(query: string): Promise<string> {
  // Set up the URL for the Google search API
  const searchUrl = 'https://www.googleapis.com/customsearch/v1';
  // Replace YOUR_API_KEY with your own API key, which you can obtain from the Google API Console (https://console.developers.google.com/)
  const apiKey = 'PLACEHOLDER';
  // Replace YOUR_SEARCH_ENGINE_ID with your own search engine ID, which you can find in the Google Custom Search Engine control panel (https://cse.google.com/cse/all)
  const searchEngineId = 'PLACEHOLDER';
  // Set the search query
  const params = {
    q: query,
    searchType: 'image',
    num: 1,
    key: apiKey,
    cx: searchEngineId
  };
  // Make the request to the Google search API
  const response = await axios.get(searchUrl, { params });
  // Extract the first image result URL from the response
  const firstImageUrl = response.data.items[0].link;
  // Return the first image result URL
  return firstImageUrl;
}


