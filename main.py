from fastapi import FastAPI
from fastapi.responses import JSONResponse
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

# Get a list of all the ingredients

@app.get("/ingredients")
def read_ingredents():
    session = Session(engine)

    stmt = select(IngredientModel)

    ingredient_list = []

    for ingredient_model in session.scalars(stmt):
        ingredient_list.append(IngredientDto.from_model(ingredient_model))
        
    session.commit()
    return JSONResponse(content=ingredient_list)


# Create a new ingredient
@app.post("/ingredient/")
def add_ingredient(ingredient:IngredientDto):
    session = Session(engine)
    print(ingredient)
    # First thing is to check if this item is listed in the DB
    stmt = session.scalars(select(IngredientModel).where(IngredientModel.name.in_([ingredient.name]))).one_or_none()

    if(stmt is not None):
        return JSONResponse(status_code=400, content="Ingredient already on data base")
    
    ingredient_model = IngredientModel(id=str(uuid4()), name=ingredient.name, quantity=ingredient.quantity)

    session.add(ingredient_model)
    session.commit()
    
    return JSONResponse(status_code=200, content="Ingredient created")