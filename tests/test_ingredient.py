"""Tests for the ingredient CRUD services in main.py."""

from conftest import make_ingredient


def _create(client, **kwargs):
    return client.post("/ingredient", json=make_ingredient(**kwargs))


def test_list_ingredients_empty(client):
    resp = client.get("/ingredient")
    assert resp.status_code == 200
    assert resp.json() == []


def test_create_ingredient(client):
    resp = _create(client, name="Sugar")
    assert resp.status_code == 200
    assert resp.json() == "Ingredient created"

    listed = client.get("/ingredient").json()
    assert len(listed) == 1
    assert listed[0]["name"] == "Sugar"


def test_create_duplicate_ingredient_rejected(client):
    _create(client, name="Salt")
    resp = _create(client, name="Salt")
    assert resp.status_code == 400
    assert resp.json() == "Ingredient already exist"


def test_list_is_sorted_case_insensitively(client):
    _create(client, name="banana")
    _create(client, name="Apple")
    _create(client, name="cherry")

    names = [i["name"] for i in client.get("/ingredient").json()]
    assert names == ["Apple", "banana", "cherry"]


def test_get_ingredient_names(client):
    _create(client, name="Pepper")
    _create(client, name="Olive oil")

    names = client.get("/ingredient/names").json()
    assert names == ["Olive oil", "Pepper"]


def test_get_single_ingredient(client):
    _create(client, name="Butter", quantity=250, unit="g", notes="cold")
    uuid = client.get("/ingredient").json()[0]["uuid"]

    resp = client.get(f"/ingredient/{uuid}")
    assert resp.status_code == 200
    body = resp.json()
    assert body["name"] == "Butter"
    assert body["quantity"] == 250
    assert body["notes"] == "cold"


def test_get_missing_ingredient(client):
    resp = client.get("/ingredient/does-not-exist")
    assert resp.status_code == 400
    assert resp.json() == "Ingredient not found"


def test_update_ingredient(client):
    _create(client, name="Milk", quantity=1, unit="l", notes="")
    uuid = client.get("/ingredient").json()[0]["uuid"]

    resp = client.put(
        f"/ingredient/{uuid}",
        json=make_ingredient(name="Milk", quantity=2, unit="l", notes="skimmed"),
    )
    assert resp.status_code == 200
    assert resp.json() == "Ingredient updated"

    updated = client.get(f"/ingredient/{uuid}").json()
    assert updated["quantity"] == 2
    assert updated["notes"] == "skimmed"


def test_update_missing_ingredient(client):
    resp = client.put("/ingredient/nope", json=make_ingredient())
    assert resp.status_code == 400
    assert resp.json() == "Ingredient not found"


def test_delete_ingredient(client):
    _create(client, name="Yeast")
    uuid = client.get("/ingredient").json()[0]["uuid"]

    resp = client.delete(f"/ingredient/{uuid}")
    assert resp.status_code == 200
    assert resp.json() == "Ingredient deleted"
    assert client.get("/ingredient").json() == []


def test_delete_missing_ingredient(client):
    resp = client.delete("/ingredient/nope")
    assert resp.status_code == 400
    assert resp.json() == "Ingredient not found"
