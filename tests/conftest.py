"""Shared pytest fixtures for the main.py service tests.

Every test runs against a fresh in-memory SQLite database so the real
``test2.db`` is never touched. We swap the module-level ``engine`` that the
endpoints in ``main.py`` use for a throwaway one, create the schema, and hand
back a ``TestClient`` to drive the FastAPI routes.
"""

import os
import sys

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool

# Make sure the project root is importable regardless of where pytest is run.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import main  # noqa: E402
from bbdd_v2 import Base  # noqa: E402


@pytest.fixture
def client():
    """A TestClient backed by a fresh, isolated in-memory database.

    ``StaticPool`` + ``check_same_thread=False`` keeps the single in-memory
    connection alive across the threadpool that FastAPI uses for sync routes,
    so the schema and data survive between requests within one test.
    """
    test_engine = create_engine(
        "sqlite://",
        echo=False,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(test_engine)

    original_engine = main.engine
    main.engine = test_engine

    with TestClient(main.app) as test_client:
        yield test_client

    main.engine = original_engine
    Base.metadata.drop_all(test_engine)
    test_engine.dispose()


def make_ingredient(name="Flour", quantity=100, unit="g", notes="", uuid=""):
    """Build an IngredientDto-shaped payload."""
    return {
        "uuid": uuid,
        "name": name,
        "quantity": quantity,
        "unit": unit,
        "notes": notes,
    }


def make_recipe(name="Pancakes", time=20, description="Tasty", steps="Mix and cook",
                ingredients=None, tags=None, uuid=""):
    """Build a RecipeDto-shaped payload."""
    return {
        "uuid": uuid,
        "name": name,
        "time": time,
        "description": description,
        "steps": steps,
        "ingredients": ingredients if ingredients is not None else [],
        "tags": tags if tags is not None else [],
    }


def make_tag(name="Vegan", uuid=""):
    """Build a Tag_dto-shaped payload."""
    return {"uuid": uuid, "name": name}


def make_unit(name="grams", uuid=""):
    """Build a UnitDto-shaped payload."""
    return {"uuid": uuid, "name": name}


def make_shopping_list(name="Weekly", notes="", ingredients=None, uuid=""):
    """Build a ShoppingListDto-shaped payload."""
    return {
        "uuid": uuid,
        "name": name,
        "notes": notes,
        "ingredients": ingredients if ingredients is not None else [],
    }


def make_shopping_list_item(ingredient=None, unit="g", quantity=1):
    """Build an IngredientShoppingListDto-shaped payload."""
    return {
        "unit": unit,
        "quantity": quantity,
        "ingredient": ingredient if ingredient is not None else make_ingredient(),
    }
