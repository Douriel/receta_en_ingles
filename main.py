from typing import List

from dto.shopping_list import ShoppingListDto
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from pydantic import BaseModel
from dto.recipe import RecipeDto
from dto.ingredient import IngredientDto

from sqlalchemy.orm import Session
from sqlalchemy import delete, select, create_engine, update


from bbdd_v2 import IngredientModel, RecipeModel, ShoppingListModel, IngredientShoppingListModel

from uuid import uuid4, UUID
from fastapi.middleware.cors import CORSMiddleware

engine = create_engine("sqlite:///test2.db", echo=True)




app = FastAPI()

origins = [
    "http://localhost:4200"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/ingredient/names")
def get_ingredients_names():
    session = Session(engine)

    ingredients_names = []

    stmt = session.scalars(select(IngredientModel.name))
    
    for name in stmt:
        ingredients_names.append(name)

    return JSONResponse(content=jsonable_encoder(ingredients_names))
    

@app.get("/ingredient/{ingredient_uuid}")
def get_ingredient(ingredient_uuid):
    session = Session(engine)

    stmt = session.scalars(select(IngredientModel).where(IngredientModel.uuid == ingredient_uuid)).one_or_none()

    if(stmt is None):
        return JSONResponse(status_code=400, content="Ingredient not found")
    
    return JSONResponse(content=jsonable_encoder(IngredientDto.from_model(stmt)))

    
# Create a new ingredient
@app.post("/ingredient")
def add_ingredient(ingredient:IngredientDto):
    session = Session(engine)
    # First thing is to check if this item is listed in the DB
    stmt = session.scalars(select(IngredientModel).where(IngredientModel.name == ingredient.name)).one_or_none()
    print("this is fine")
    if(stmt is not None):
        return JSONResponse(status_code=400, content="Ingredient already exist")
    
    ingredient_model = IngredientModel(uuid=str(uuid4()), name=ingredient.name, quantity=ingredient.quantity, unit=ingredient.unit, notes= ingredient.notes)

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
    stmt.unit = ingredient.unit
    stmt.notes = ingredient.notes
    
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
  
    for ingredient_dto in recipe.ingredients:
        stmt2 = session.scalars(select(IngredientModel).where(IngredientModel.name == ingredient_dto.name)).one_or_none()

        if(stmt2 is None):
            ingredients_model.append(IngredientModel(uuid=str(uuid4()), name=ingredient_dto.name, quantity=ingredient_dto.quantity, unit=ingredient_dto.unit, notes= ingredient_dto.notes))
        else:
            ingredients_model.append(stmt2)
        

    recipe_model = RecipeModel(uuid = str(uuid4()), name = recipe.name, description = recipe.description, steps = recipe.steps, ingredients = ingredients_model)

    session.add(recipe_model)
    session.commit()

    return JSONResponse(content="Recipe created")


# Delete a recipe
@app.delete("/recipe/{recipe_uuid}")
def delete_recipe(recipe_uuid):
    session = Session(engine)

    stmt = session.scalar(select(RecipeModel).where(RecipeModel.uuid == recipe_uuid))

    if(stmt is None):
        return JSONResponse(status_code=400, content="Recipe not found")
    
    session.delete(stmt)
    session.commit()
    
    return JSONResponse(content="Recipe deleted succesfully")


# Update a recipe
@app.put("/recipe/{recipe_uuid}")
def update_recipe(recipe_uuid, recipe_dto:RecipeDto):
    session = Session(engine)

    stmt = session.scalar(select(RecipeModel).where(RecipeModel.uuid == recipe_uuid))

    if(stmt is None):
        return JSONResponse(status_code=400, content="Recipe not found")
    
    
    stmt.name = recipe_dto.name
    stmt.description = recipe_dto.description
    stmt.steps = recipe_dto.steps
    
    ingredients_model:List[IngredientModel] = []
    
    for ingredient_dto in recipe_dto.ingredients:
        stmt2 = session.scalar(select(IngredientModel).where(IngredientModel.name == ingredient_dto.name))

        if(stmt2 is None):
            ingredients_model.append(IngredientModel(uuid=str(uuid4()), name=ingredient_dto.name, quantity=ingredient_dto.quantity, unit=ingredient_dto.unit, notes= ingredient_dto.notes))
        else:
            ingredients_model.append(stmt2)

    
    stmt.ingredients = ingredients_model

    session.commit()
    return JSONResponse(status_code=200, content="Recipe updated")


## CRUD methods related with shoppingList

# Create a new shopping list
@app.get("/shoppingList")
def get_shopping_lists():
    session = Session(engine)

    stmt = select(ShoppingListModel)

    shopping_list_list = []

    for shopping_list in session.scalars(stmt):
        shopping_list_list.append(ShoppingListDto.from_model(shopping_list))

    return JSONResponse(content=jsonable_encoder(shopping_list_list))

# Get an specific shopping list
@app.get("/shoppingList/{shopping_list_uuid}")
def get_shopping_list(shopping_list_uuid):
    session = Session(engine)

    stmt = session.scalars(select(ShoppingListModel).where(ShoppingListModel.uuid == shopping_list_uuid)).one_or_none()

    if(stmt is None):
        return JSONResponse(status_code=400, content="Shopping List not found")

    return JSONResponse(content=jsonable_encoder(ShoppingListDto.from_model(stmt)))

# Create a new shopping list
@app.post("/shoppingList")
def create_shopping_list(shopping_list:ShoppingListDto):
    with Session(engine) as session:

        # First I need to check what is if the list has been created
        stmt = session.scalars(select(ShoppingListModel).where(ShoppingListModel.name == shopping_list.name)).one_or_none()
        if(stmt is not None):
            return JSONResponse(status_code=400, content="There is shopping list with the case name already created")

        # Middleman object
        shopping_list_associations = []

        for ingredient_shopping_list_dto in shopping_list.ingredients:
            ingredient = session.scalars(select(IngredientModel).where(IngredientModel.name == ingredient_shopping_list_dto.ingredient.name)).one_or_none()

            if(ingredient is None):
                ingredient = IngredientModel(
                    uuid=str(uuid4()),
                    name=ingredient_shopping_list_dto.ingredient.name, 
                    quantity=0, 
                    unit=ingredient_shopping_list_dto.ingredient.unit, 
                    notes=ingredient_shopping_list_dto.ingredient.notes                    
            )
            else: 
                ingredient_shopping_list_dto.unit= ingredient.unit

            assoc = IngredientShoppingListModel(
                ingredient=ingredient,
                unit=ingredient_shopping_list_dto.unit,
                quantity=ingredient_shopping_list_dto.quantity
            )

            shopping_list_associations.append(assoc)

        shopping_list_model = ShoppingListModel(
            uuid=str(uuid4()), 
            name=shopping_list.name, 
            notes=shopping_list.notes, 
            ingredients=shopping_list_associations # Pass the middleman objects here!
        )

        session.add(shopping_list_model)
        session.commit()

        return JSONResponse(status_code=200, content="Shopping List created")

# Delete a shopping List
@app.delete("/shoppingList/{shopping_list_uuid}")
def delete_shopping_list(shopping_list_uuid):
    session = Session(engine)

    stmt = session.scalar(select(ShoppingListModel).where(ShoppingListModel.uuid == shopping_list_uuid))

    if(stmt is None):
        return JSONResponse(status_code=400, content="Recipe not found")
    
    session.delete(stmt)
    session.commit()
    
    return JSONResponse(status_code=200, content="Shopping list deleted succesfully")

# Update a shopping list
@app.put("/shoppingList/{shopping_list_uuid}")
def update_shopping_list(shopping_list_uuid, shopping_list_dto:ShoppingListDto):
    session = Session(engine)

    stmt = session.scalar(select(ShoppingListModel).where(ShoppingListModel.uuid == shopping_list_uuid))

    if(stmt is None):
        return JSONResponse(status_code=400, content="Recipe not found")
    
    stmt.name = shopping_list_dto.name
    stmt.notes = shopping_list_dto.notes
    stmt.quantity = shopping_list_dto.quantity
    stmt.unit = shopping_list_dto.unit

    ingredients_model:List[IngredientModel] = []


    for ingredient_dto in shopping_list_dto.ingredients:
            stmt2 = session.scalar(select(IngredientModel).where(IngredientModel.name == ingredient_dto.name))
    
            if(stmt2 is None):
                ingredients_model.append(IngredientModel(uuid=str(uuid4()), name=ingredient_dto.name, quantity=ingredient_dto.quantity, unit=ingredient_dto.unit, notes= ingredient_dto.notes))
            else:
                ingredients_model.append(stmt2)

    stmt.ingredients = ingredients_model
    
    session.commit()
    return JSONResponse(status_code=200, content="Recipe updated")