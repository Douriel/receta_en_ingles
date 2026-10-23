"""Tests for the tag CRUD services in main.py."""

from conftest import make_tag


def _create(client, **kwargs):
    return client.post("/tag", json=make_tag(**kwargs))


def test_list_tags_empty(client):
    resp = client.get("/tag")
    assert resp.status_code == 200
    assert resp.json() == []


def test_create_tag(client):
    resp = _create(client, name="Dessert")
    assert resp.status_code == 200
    assert resp.json() == "Tag created"

    tags = client.get("/tag").json()
    assert len(tags) == 1
    assert tags[0]["name"] == "Dessert"


def test_create_duplicate_tag_rejected(client):
    _create(client, name="Breakfast")
    resp = _create(client, name="Breakfast")
    assert resp.status_code == 400
    assert resp.json() == "This tag already exist."


def test_get_tag_names(client):
    _create(client, name="Spicy")
    _create(client, name="Quick")

    names = client.get("/tag/names").json()
    assert set(names) == {"Spicy", "Quick"}


def test_get_single_tag(client):
    _create(client, name="Gluten-free")
    uuid = client.get("/tag").json()[0]["uuid"]

    resp = client.get(f"/tag/{uuid}")
    assert resp.status_code == 200
    assert resp.json()["name"] == "Gluten-free"


def test_get_missing_tag(client):
    resp = client.get("/tag/nope")
    assert resp.status_code == 400
    assert resp.json() == "Tag not found"


def test_update_tag(client):
    _create(client, name="Veggie")
    uuid = client.get("/tag").json()[0]["uuid"]

    resp = client.put(f"/tag/{uuid}", json=make_tag(name="Vegetarian"))
    assert resp.status_code == 200
    assert resp.json() == "Tag updated"
    assert client.get(f"/tag/{uuid}").json()["name"] == "Vegetarian"


def test_update_missing_tag(client):
    resp = client.put("/tag/nope", json=make_tag())
    assert resp.status_code == 400
    assert resp.json() == "Tag not found"


def test_delete_tag(client):
    _create(client, name="Snack")
    uuid = client.get("/tag").json()[0]["uuid"]

    resp = client.delete(f"/tag/{uuid}")
    assert resp.status_code == 200
    assert resp.json() == "Tag deleted"
    assert client.get("/tag").json() == []


def test_delete_missing_tag(client):
    resp = client.delete("/tag/nope")
    assert resp.status_code == 400
    assert resp.json() == "Tag not found"
