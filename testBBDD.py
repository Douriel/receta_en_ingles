
from sqlalchemy.orm import Session
from sqlalchemy import select, create_engine


from BBDD import IngredientModel, RecipeModel 

import uuid


engine = create_engine("sqlite:///test.db", echo=True)


## testing create objects

with Session(engine) as session:
    # First check if the ingredient has been already created in the Data Base
    stmt = select(IngredientModel).where(IngredientModel.name.in_(["patata"]))
    ingredient = session.scalars(stmt).one_or_none()

    # if it is not created we create the ingredient in the db.
    if not ingredient:
        ingredient = IngredientModel(
            id = str(uuid.uuid4()),
            name = "patata",
            quantity = 0,
        )
    
    # Create the recipe
    recipe = RecipeModel(
        id = str(uuid.uuid4()),
        name = "pataten ",
        description = "mejor que a bocados",
        steps = "claro",
        ingredients = [ingredient],
    )

    session.add(recipe)
    session.commit()





'''
with Session(engine) as session:
    salchicha = IngredientModel(
        id="spongebob",
        name="salchicha",
        quantity=1,
    )
    tortilla = RecipeModel(
        id="asdfasfdasdfasdf",
        name="tortilla",
        description="amarillo",
        steps="rompe unos huevos",
        ingredients=[salchicha]
    )
    
    session.add_all([salchicha, tortilla])
    session.commit()

'''



session = Session(engine)

stmt = select(IngredientModel).where(IngredientModel.name.in_(["salchicha"]))

for ingredient in session.scalars(stmt):
    print(ingredient)

stmt = (
    select(RecipeModel)
    .join(RecipeModel.ingredients)
    .where(IngredientModel.name == "salchicha")
)
for ingredient in session.scalars(stmt):
    print(ingredient)