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

######################### Porque tengo puestas las comillas dobles en las listas??????
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

    def __repr__(self) -> str:
        return f"id(id={self.id!r}, name={self.name!r}, description={self.description!r}, steps={self.steps!r}, ingredients={self.ingredients!r})"


engine = create_engine("sqlite:///test.db", echo=True)
Base.metadata.create_all(engine)


