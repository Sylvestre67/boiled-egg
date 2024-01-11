from contextlib import asynccontextmanager
import json
import pandas
from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List
from typing_extensions import TypedDict

ctx = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    ctx["molecules"] = pandas.read_csv('./data/molecules.csv')
    ctx["bbb"] = pandas.read_csv('./data/bbb.csv')
    ctx["hia"] = pandas.read_csv('./data/hia.csv')
    yield
    ctx.clear()


app = FastAPI(lifespan=lifespan, title="BOILED-Egg",
              description="API for the BBB/HIA permeability prediction visualization.", version="0.1.0")


class Molecule(BaseModel):
    TPSA: float
    WLOGP: float
    molecule: str
    canonical_smiles: str


class Universe(BaseModel):
    TPSA: float
    WLOGP: float


class UniversesDict(TypedDict):
    bbb: List[Universe]
    hia: List[Universe]


@app.get("/_status")
def get_status():
    return "ok"


@app.get("/molecules", response_class=JSONResponse)
def get_molecules() -> List[Molecule]:
    """
    Retrieves a list of molecules with predicted value for TPSA and WLOGP, Canonical SMILES and name.

    Returns:
        A list of molecules TPSA/WLOGP/SMILES/NAME value object.
    """
    df_json = ctx["molecules"].to_json(orient="records")
    return Response(content=df_json, media_type="application/json")


@app.get("/universes", response_class=JSONResponse)
def get_universe() -> UniversesDict:
    """
    Retrieves a list of TPSA and WLOGP value defining the space
    with highest probability to permeate to the brain (BBB) or
    being absorbed by the gastrointestinal tract (HIA).

    The data is grouped under 'bbb' and 'hia' keys.

    Returns:
        A dictionary with keys 'bbb' and 'hia', each containing a list of TPSA/WLOGP value objects.
    """
    universes = {"bbb": ctx["bbb"].to_dict(orient="records"), "hia": ctx["hia"].to_dict(orient="records")}
    return Response(content=json.dumps(universes), media_type="application/json")
