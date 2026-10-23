# Service tests

Tests for the FastAPI CRUD services defined in `main.py`, driven through
`fastapi.testclient.TestClient`.

## Running

From the project root:

```bash
./venv/bin/python -m pytest tests/ -q
```

(Requires `pytest` and `httpx`, both installed in the project venv.)

## How isolation works

`tests/conftest.py` provides a `client` fixture that:

- creates a fresh **in-memory** SQLite database per test (via `StaticPool`),
- swaps `main.engine` for it so the endpoints never touch the real `test2.db`,
- yields a `TestClient`, then restores the original engine and drops the schema.

Each test therefore runs against a clean, isolated database.

## Bugs fixed while writing these tests

Writing the suite surfaced three bugs in `main.py`, all now fixed (the tests
below are the regression guards):

1. **`get_recipe`** closed the session *before* `RecipeDto.from_model`, so
   serializing a single recipe raised `DetachedInstanceError`. Now serializes
   before closing. (`test_recipe.py::test_get_single_recipe`)
2. **`update_recipe`** called `session.close()` inside the new-tag branch,
   detaching the recipe and crashing on the later `stmt.ingredients = ...`.
   The stray `close()` was removed.
   (`test_recipe.py::test_update_recipe`)
3. **`update_shopping_list`** referenced an undefined `ingredient_dto` when the
   list item named a not-yet-existing ingredient, raising `NameError`. Fixed to
   use `ingredient_shopping_list_dto.ingredient.notes`.
   (`test_shopping_list.py::test_update_shopping_list`)
