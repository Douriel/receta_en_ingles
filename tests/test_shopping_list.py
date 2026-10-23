"""Tests for the shopping list CRUD services in main.py."""

from conftest import make_ingredient, make_shopping_list, make_shopping_list_item


def _create(client, **kwargs):
    return client.post("/shoppingList", json=make_shopping_list(**kwargs))


def test_list_shopping_lists_empty(client):
    resp = client.get("/shoppingList")
    assert resp.status_code == 200
    assert resp.json() == []


def test_create_empty_shopping_list(client):
    resp = _create(client, name="Groceries")
    assert resp.status_code == 200
    assert resp.json() == "Shopping List created"

    lists = client.get("/shoppingList").json()
    assert len(lists) == 1
    assert lists[0]["name"] == "Groceries"


def test_create_shopping_list_with_items(client):
    item = make_shopping_list_item(
        ingredient=make_ingredient(name="Rice", quantity=0, unit="g"),
        unit="kg",
        quantity=2,
    )
    resp = _create(client, name="Pantry", notes="monthly", ingredients=[item])
    assert resp.status_code == 200

    shopping_list = client.get("/shoppingList").json()[0]
    assert shopping_list["notes"] == "monthly"
    assert len(shopping_list["ingredients"]) == 1
    entry = shopping_list["ingredients"][0]
    assert entry["ingredient"]["name"] == "Rice"
    assert entry["unit"] == "kg"
    assert entry["quantity"] == 2


def test_create_duplicate_shopping_list_rejected(client):
    _create(client, name="Weekend")
    resp = _create(client, name="Weekend")
    assert resp.status_code == 400
    assert resp.json() == "There is shopping list with the same name already created"


def test_get_shopping_list_names_sorted(client):
    _create(client, name="zoo trip")
    _create(client, name="Beach trip")

    names = client.get("/shoppingList/names").json()
    assert names == ["Beach trip", "zoo trip"]


def test_get_single_shopping_list(client):
    _create(client, name="Dinner party", notes="for 8")
    uuid = client.get("/shoppingList").json()[0]["uuid"]

    resp = client.get(f"/shoppingList/{uuid}")
    assert resp.status_code == 200
    body = resp.json()
    assert body["name"] == "Dinner party"
    assert body["notes"] == "for 8"


def test_get_missing_shopping_list(client):
    resp = client.get("/shoppingList/nope")
    assert resp.status_code == 400
    assert resp.json() == "Shopping List not found"


def test_update_shopping_list(client):
    _create(client, name="Old list", notes="old")
    uuid = client.get("/shoppingList").json()[0]["uuid"]

    item = make_shopping_list_item(
        ingredient=make_ingredient(name="Pasta", quantity=0, unit="g"),
        unit="g",
        quantity=500,
    )
    resp = client.put(
        f"/shoppingList/{uuid}",
        json=make_shopping_list(name="New list", notes="new", ingredients=[item]),
    )
    assert resp.status_code == 200
    assert resp.json() == "Recipe updated"

    updated = client.get(f"/shoppingList/{uuid}").json()
    assert updated["name"] == "New list"
    assert updated["notes"] == "new"
    assert updated["ingredients"][0]["ingredient"]["name"] == "Pasta"
    assert updated["ingredients"][0]["quantity"] == 500


def test_update_shopping_list_with_existing_ingredient(client):
    _create(client, name="Old list", notes="old")
    uuid = client.get("/shoppingList").json()[0]["uuid"]

    # Ingredient already in the catalogue -> update reuses it instead of creating.
    client.post("/ingredient", json=make_ingredient(name="Rice", quantity=0, unit="g"))

    item = make_shopping_list_item(
        ingredient=make_ingredient(name="Rice", quantity=0, unit="g"),
        unit="kg",
        quantity=3,
    )
    resp = client.put(
        f"/shoppingList/{uuid}",
        json=make_shopping_list(name="New list", notes="new", ingredients=[item]),
    )
    assert resp.status_code == 200

    updated = client.get(f"/shoppingList/{uuid}").json()
    assert updated["ingredients"][0]["ingredient"]["name"] == "Rice"
    assert updated["ingredients"][0]["quantity"] == 3
    # Still a single Rice ingredient in the catalogue (reused, not duplicated).
    assert client.get("/ingredient/names").json() == ["Rice"]


def test_update_missing_shopping_list(client):
    resp = client.put("/shoppingList/nope", json=make_shopping_list())
    assert resp.status_code == 400
    assert resp.json() == "Recipe not found"


def test_delete_shopping_list(client):
    _create(client, name="Temporary")
    uuid = client.get("/shoppingList").json()[0]["uuid"]

    resp = client.delete(f"/shoppingList/{uuid}")
    assert resp.status_code == 200
    assert resp.json() == "Shopping list deleted succesfully"
    assert client.get("/shoppingList").json() == []


def test_delete_missing_shopping_list(client):
    resp = client.delete("/shoppingList/nope")
    assert resp.status_code == 400
    assert resp.json() == "Shopping List not found"
