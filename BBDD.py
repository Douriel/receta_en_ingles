from typing import List, Optional
from sqlalchemy import Column, ForeignKey, String, Table, Text, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship



class Base(DeclarativeBase):
    pass

recipe_ingredient = Table(
    "recipe_ingredient",
    Base.metadata,
    Column("ingredient", ForeignKey("ingredient.id"), primary_key=True),
    Column("recipe", ForeignKey("recipe.id"), primary_key=True),
)

recipe_tag = Table(
    "recipe_tag",
    Base.metadata,
    Column("tag", ForeignKey("tag.id"), primary_key=True),
    Column("recipe", ForeignKey("recipe.id"), primary_key=True),
)

shoppingList_ingredient = Table(
    "shoppingList_ingredient",
    Base.metadata,
    Column("shoppingList", ForeignKey("shoppingList.id"), primary_key=True),
    Column("ingredient", ForeignKey("ingredient.id"), primary_key=True),
)

######################### Por que tengo puestas las comillas dobles en las listas??????
class IngredientModel(Base):
    __tablename__ = "ingredient"
    id : Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid : Mapped[str] = mapped_column(String(36), index=True)
    name : Mapped[str] = mapped_column(String(64), unique=True)
    quantity : Mapped[int] = mapped_column(default=0)
    unit : Mapped[str] = mapped_column(String(16))
    notes : Mapped[str] = mapped_column(String(200))

    recipes: Mapped[List["RecipeModel"]] = relationship(
        back_populates="ingredients", secondary=recipe_ingredient
    )
    shoppingLists: Mapped[List["ShoppingListModel"]] = relationship(
        secondary=shoppingList_ingredient, back_populates="ingredients"
    )

    def __repr__(self) -> str:
        return f"id(id={self.id!r}, name={self.name!r}, quantity={self.quantity!r})"
    
class RecipeModel(Base):
    __tablename__ = "recipe"
    id : Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid : Mapped[str] = mapped_column(String(36), index=True)
    name : Mapped[str] = mapped_column(String(64), unique=True)
    description : Mapped[str] = mapped_column(Text(), default="")
    steps : Mapped[str] = mapped_column(Text(), default="")
    ingredients: Mapped[List["IngredientModel"]] = relationship(
        back_populates="recipes", secondary=recipe_ingredient
    )
    tags: Mapped[List["TagModel"]] = relationship(
        back_populates="recipes", secondary=recipe_tag
    )

    def __repr__(self) -> str:
        return f"id(id={self.id!r}, name={self.name!r}, description={self.description!r}, steps={self.steps!r}, ingredients={self.ingredients!r})"

class ShoppingListModel(Base):
    __tablename__ = "shoppingList"
    id : Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid : Mapped[str] = mapped_column(String(36), index=True)
    name : Mapped[str] = mapped_column(String(64), unique=True)
    quantity : Mapped[int] = mapped_column(default=0)
    unit : Mapped[str] = mapped_column(String(16))
    notes : Mapped[str] = mapped_column(String(200))
    ingredients: Mapped[List["IngredientModel"]] = relationship(
        back_populates="shoppingLists", secondary=shoppingList_ingredient
    )

    def __repr__(self) -> str:
        return f"id(id={self.id!r}, name={self.name!r}, quantity={self.quantity!r}, unit={self.unit!r}, notes={self.notes!r}, ingredients={self.ingredients!r})"


class TagModel(Base):
    __tablename__ = "tag"
    id : Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid : Mapped[str] = mapped_column(String(36), index=True)
    name : Mapped[str] = mapped_column(String(64), unique=True)
    recipes: Mapped[List["RecipeModel"]] = relationship(
        back_populates="tags", secondary=recipe_tag
    )

    def __repr__(self) -> str:
        return f"id(id={self.id!r}, name={self.name!r})"

engine = create_engine("sqlite:///test.db", echo=True)
Base.metadata.create_all(engine)


