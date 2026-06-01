from fastapi import FastAPI
from pydantic import BaseModel
from recipe import RecipeDto
from ingredient import IngredientDto

from sqlalchemy.orm import Session
from sqlalchemy import select, create_engine


from BBDD import IngredientModel, RecipeModel 

from uuid import uuid4, UUID


engine = create_engine("sqlite:///test.db", echo=True)




app = FastAPI()


class Item(BaseModel):
    name: str
    price: float
    is_offer: bool | None = None


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}



@app.get("/test")
def read_recipe():
    return {"uuid" : uuid4()}



# Methods related with ingredients

@app.get("/ingredients")
def read_ingredents():
    session = Session(engine)

    stmt = select(IngredientModel)

    ingredientList = []

    for ingredientModel in session.scalars(stmt):
        ingredientList.append(IngredientDto(ingredientModel))
        
    return ingredientList
