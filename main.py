from typing import List

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from pydantic import BaseModel
from recipe import RecipeDto
from ingredient import IngredientDto

from sqlalchemy.orm import Session
from sqlalchemy import delete, select, create_engine, update


from BBDD import IngredientModel, RecipeModel 

from uuid import uuid4, UUID


engine = create_engine("sqlite:///test.db", echo=True)




app = FastAPI()


class Item(BaseModel):
    name: str
    price: float
    is_offer: bool | None = None



@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}




# Methods related with ingredients

# Get a list of all the ingredients
@app.get("/ingredient")
def get_ingredents():
    session = Session(engine)

    stmt = select(IngredientModel)

    ingredient_list = []

    for ingredient_model in session.scalars(stmt):
        ingredient_list.append(IngredientDto.from_model(ingredient_model))

    return JSONResponse(content=jsonable_encoder(ingredient_list))

@app.get("/ingredient/{ingredient_uuid}")
def get_ingredient(ingredient_uuid):
    session = Session(engine)

    stmt = session.scalars(select(IngredientModel).where(IngredientModel.uuid == ingredient_uuid)).one_or_none()

    if(stmt is None):
        return JSONResponse(status_code=400, content="Ingredient not found")
    
    return JSONResponse(content=jsonable_encoder(IngredientDto.from_model(stmt)))

    
# Create a new ingredient
@app.post("/ingredient/")
def add_ingredient(ingredient:IngredientDto):
    session = Session(engine)
    # First thing is to check if this item is listed in the DB
    stmt = session.scalars(select(IngredientModel).where(IngredientModel.name == ingredient.name)).one_or_none()

    if(stmt is not None):
        return JSONResponse(status_code=400, content="Ingredient already exist")
    
    ingredient_model = IngredientModel(uuid=str(uuid4()), name=ingredient.name, quantity=ingredient.quantity)

    session.add(ingredient_model)
    session.commit()
    
    return JSONResponse(status_code=200, content="Ingredient created")

# Delete one ingredient
@app.delete("/ingredient/{ingredient_uuid}")
def delete_ingredient(ingredient_uuid):
    session = Session(engine)
    # Find if the ingredient is in the db
    stmt = session.scalars(select(IngredientModel).where(IngredientModel.uuid == ingredient_uuid)).one_or_none()
    # if not found it cannot be deleted
    if(stmt is None):
        return JSONResponse(status_code=400, content="Ingredient not found")
    session.delete(stmt)
    session.commit()

    return JSONResponse(status_code=200, content="Ingredient deleted")


# Update one ingredient
@app.put("/ingredient/{ingredient_uuid}")
def update_ingredient(ingredient_uuid, ingredient:IngredientDto):
    session = Session(engine)
    # Find if the ingredient exist in the data base
    stmt = session.scalars(select(IngredientModel).where(IngredientModel.uuid == ingredient_uuid)).one_or_none()
    # if not found the ingrediet cannot be updatad
    if(stmt is None):
        return JSONResponse(status_code=400, content="Ingredient not found")
    
    stmt.name = ingredient.name
    stmt.quantity = ingredient.quantity
    
    session.commit()
    return JSONResponse(status_code=200, content="Ingredient updated")


## CRUD methods related with Recipe


# Get a list of the recipes 
@app.get("/recipe")
def get_recipes():
    session = Session(engine)

    stmt = select(RecipeModel)

    recipe_list = []

    for recipe_model in session.scalars(stmt):
        print(recipe_model)
        recipe_list.append(RecipeDto.from_model(recipe_model))

    return JSONResponse(content=jsonable_encoder(recipe_list))


# Get an specific recipe.
@app.get("/recipe/{recipe_uuid}")
def get_recipe(recipe_uuid):
    session = Session(engine)

    stmt = session.scalars(select(RecipeModel).where(RecipeModel.uuid == recipe_uuid)).one_or_none()

    #Check if it exist on the DB
    if(stmt is None):
        return JSONResponse(status_code=400, content="Recipe not found")
    
    return JSONResponse(content=jsonable_encoder(RecipeDto.from_model(stmt)))

# Create a new recipe
@app.post("/recipe")
def create_recipe(recipe:RecipeDto):

    session = Session(engine)
    
    # Check if the recipe already exist on the DB
    stmt = session.scalars(select(RecipeModel).where(RecipeModel.name == recipe.name)).one_or_none()

    if(stmt is not None):
        return JSONResponse(status_code=400, content="The recipe already exist")
    
    ingredients_model:List[IngredientModel] = []
  
    for ingredient in recipe.ingredients:
        stmt2 = session.scalars(select(IngredientModel).where(IngredientModel.uuid == ingredient.uuid)).one_or_none()

        if(stmt2 is None):
            ingredients_model.append(IngredientModel(uuid=str(uuid4()), name=ingredient.name, quantity=ingredient.quantity))
        else:
            ingredients_model.append(stmt2)
        

    recipe_model = RecipeModel(uuid = str(uuid4()), name = recipe.name, description = recipe.description, steps = recipe.steps, ingredients = ingredients_model)

    session.add(recipe_model)
    session.commit()

    return JSONResponse(content="Recipe created")



