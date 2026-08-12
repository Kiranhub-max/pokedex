from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI(title="Pokemon Explorer API")

# CORS - allows our React frontend (on a different origin) to call this API.
# allow_origins=["*"] is fine for a classroom demo. In production you'd
# restrict this to your actual Vercel URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon"


@app.get("/")
def read_root():
    return {"message": "Pokemon Explorer API is running"}


@app.get("/pokemon/{name}")
def get_pokemon(name: str):
    response = requests.get(f"{POKEAPI_BASE_URL}/{name.lower()}")

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Pokemon not found")

    data = response.json()

    return {
        "name": data["name"],
        "image": data["sprites"]["front_default"],
        "type": data["types"][0]["type"]["name"],
        "height": data["height"] / 10,  # decimeters -> meters
        "weight": data["weight"] / 10,  # hectograms -> kilograms
    }
