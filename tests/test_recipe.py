"""Tests for the recipe CRUD services in main.py."""

from conftest import make_ingredient, make_recipe, make_recipe_item, make_tag


def _create(client, **kwargs):
    return client.post("/recipe", json=make_recipe(**kwargs))


def test_list_recipes_empty(client):
    resp = client.get("/recipe")
    assert resp.status_code == 200
    assert resp.json() == []


def test_create_simple_recipe(client):
    resp = _create(client, name="Omelette")
    assert resp.status_code == 200
    assert resp.json() == "Recipe created"

    recipes = client.get("/recipe").json()
    assert len(recipes) == 1
    assert recipes[0]["name"] == "Omelette"


def test_create_recipe_with_new_ingredients_and_tags(client):
    resp = _create(
        client,
        name="Tomato soup",
        ingredients=[make_recipe_item(ingredient=make_ingredient(name="Tomato", quantity=4, unit="pcs"), unit="pcs", quantity=4)],
        tags=[make_tag(name="Soup")],
    )
    assert resp.status_code == 200

    recipe = client.get("/recipe").json()[0]
    assert len(recipe["ingredients"]) == 1
    assert recipe["ingredients"][0]["ingredient"]["name"] == "Tomato"
    assert recipe["ingredients"][0]["unit"] == "pcs"
    assert recipe["tags"][0]["name"] == "Soup"

    # The nested ingredient should also be persisted as a standalone ingredient.
    assert client.get("/ingredient/names").json() == ["Tomato"]


def test_create_recipe_reuses_existing_ingredient(client):
    client.post("/ingredient", json=make_ingredient(name="Egg", quantity=12, unit="pcs"))

    _create(
        client,
        name="Scramble",
        ingredients=[make_recipe_item(ingredient=make_ingredient(name="Egg", quantity=2, unit="pcs"), unit="pcs", quantity=2)],
    )

    # Still only a single Egg ingredient in the catalogue (reused, not duplicated).
    assert client.get("/ingredient/names").json() == ["Egg"]


def test_create_duplicate_recipe_rejected(client):
    _create(client, name="Stew")
    resp = _create(client, name="Stew")
    assert resp.status_code == 400
    assert resp.json() == "The recipe already exist"


def test_get_recipe_names_sorted(client):
    _create(client, name="banana bread")
    _create(client, name="Apple pie")

    names = client.get("/recipe/names").json()
    assert names == ["Apple pie", "banana bread"]


def test_get_single_recipe(client):
    _create(client, name="Curry", time=45, description="Spicy", steps="Cook slowly")
    uuid = client.get("/recipe").json()[0]["uuid"]

    resp = client.get(f"/recipe/{uuid}")
    assert resp.status_code == 200
    body = resp.json()
    assert body["name"] == "Curry"
    assert body["time"] == 45
    assert body["steps"] == "Cook slowly"


def test_get_missing_recipe(client):
    resp = client.get("/recipe/nope")
    assert resp.status_code == 400
    assert resp.json() == "Recipe not found"


def test_update_recipe(client):
    _create(client, name="Salad", time=10, description="Fresh", steps="Toss")
    uuid = client.get("/recipe").json()[0]["uuid"]

    resp = client.put(
        f"/recipe/{uuid}",
        json=make_recipe(
            name="Greek Salad",
            time=15,
            description="Mediterranean",
            steps="Chop and toss",
            ingredients=[make_recipe_item(ingredient=make_ingredient(name="Feta", quantity=100, unit="g"), unit="g", quantity=100)],
            tags=[make_tag(name="Healthy")],
        ),
    )
    assert resp.status_code == 200
    assert resp.json() == "Recipe updated"

    updated = client.get(f"/recipe/{uuid}").json()
    assert updated["name"] == "Greek Salad"
    assert updated["time"] == 15
    assert updated["ingredients"][0]["ingredient"]["name"] == "Feta"
    assert updated["ingredients"][0]["quantity"] == 100
    assert updated["tags"][0]["name"] == "Healthy"


def test_update_missing_recipe(client):
    resp = client.put("/recipe/nope", json=make_recipe())
    assert resp.status_code == 400
    assert resp.json() == "Recipe not found"


def test_delete_recipe(client):
    _create(client, name="Pie")
    uuid = client.get("/recipe").json()[0]["uuid"]

    resp = client.delete(f"/recipe/{uuid}")
    assert resp.status_code == 200
    assert resp.json() == "Recipe deleted succesfully"
    assert client.get("/recipe").json() == []


def test_delete_missing_recipe(client):
    resp = client.delete("/recipe/nope")
    assert resp.status_code == 400
    assert resp.json() == "Recipe not found"
