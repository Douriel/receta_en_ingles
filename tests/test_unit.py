"""Tests for the unit CRUD services in main.py."""

from conftest import make_unit


def _create(client, **kwargs):
    return client.post("/unit", json=make_unit(**kwargs))


def test_list_units_empty(client):
    resp = client.get("/unit")
    assert resp.status_code == 200
    assert resp.json() == []


def test_create_unit(client):
    resp = _create(client, name="kilograms")
    assert resp.status_code == 200
    assert resp.json() == "Unit created"

    units = client.get("/unit").json()
    assert len(units) == 1
    assert units[0]["name"] == "kilograms"


def test_create_duplicate_unit_rejected(client):
    _create(client, name="liters")
    resp = _create(client, name="liters")
    assert resp.status_code == 400
    assert resp.json() == "There is a Unit with the same name"


def test_get_unit_names_sorted(client):
    _create(client, name="teaspoon")
    _create(client, name="Cup")
    _create(client, name="ounce")

    names = client.get("/unit/names").json()
    assert names == ["Cup", "ounce", "teaspoon"]


def test_get_single_unit(client):
    _create(client, name="pinch")
    uuid = client.get("/unit").json()[0]["uuid"]

    resp = client.get(f"/unit/{uuid}")
    assert resp.status_code == 200
    assert resp.json()["name"] == "pinch"


def test_get_missing_unit(client):
    resp = client.get("/unit/nope")
    assert resp.status_code == 400
    assert resp.json() == "Unit not found"


def test_update_unit(client):
    _create(client, name="gramm")
    uuid = client.get("/unit").json()[0]["uuid"]

    resp = client.put(f"/unit/{uuid}", json=make_unit(name="gram"))
    assert resp.status_code == 200
    assert resp.json() == "Unit updated"
    assert client.get(f"/unit/{uuid}").json()["name"] == "gram"


def test_update_missing_unit(client):
    resp = client.put("/unit/nope", json=make_unit())
    assert resp.status_code == 400
    assert resp.json() == "Unit not found"


def test_delete_unit(client):
    _create(client, name="dash")
    uuid = client.get("/unit").json()[0]["uuid"]

    resp = client.delete(f"/unit/{uuid}")
    assert resp.status_code == 200
    assert resp.json() == "Unit deleted succesfully"
    assert client.get("/unit").json() == []


def test_delete_missing_unit(client):
    resp = client.delete("/unit/nope")
    assert resp.status_code == 400
    assert resp.json() == "Unit not found"
