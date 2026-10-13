SAMPLE = {
    "student_name": "Асқар Нұрланов",
    "subject": "Математика",
    "grade": 5,
    "assessment_type": "ТЖБ",
    "date": "2026-10-13",
    "class_name": "9А",
    "teacher": "Айгүл Серікқызы",
    "comment": "Үздік жұмыс",
}


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_create_and_read(client):
    created = client.post("/assessments", json=SAMPLE)
    assert created.status_code == 201
    assessment_id = created.json()["id"]

    response = client.get(f"/assessments/{assessment_id}")
    assert response.status_code == 200
    assert response.json()["student_name"] == SAMPLE["student_name"]


def test_search(client):
    client.post("/assessments", json=SAMPLE)
    client.post(
        "/assessments",
        json={**SAMPLE, "student_name": "Айгүл Серікқызы"},
    )

    # Іздеу student_name ЖӘНЕ teacher бойынша жүреді.
    response = client.get("/assessments", params={"q": "Айгүл"})
    results = response.json()
    assert len(results) == 2
    names = {a["student_name"] for a in results}
    assert names == {"Асқар Нұрланов", "Айгүл Серікқызы"}


def test_update(client):
    assessment_id = client.post("/assessments", json=SAMPLE).json()["id"]
    response = client.patch(f"/assessments/{assessment_id}", json={"grade": 4})
    assert response.status_code == 200
    assert response.json()["grade"] == 4


def test_delete(client):
    assessment_id = client.post("/assessments", json=SAMPLE).json()["id"]
    assert client.delete(f"/assessments/{assessment_id}").status_code == 204
    assert client.get(f"/assessments/{assessment_id}").status_code == 404


def test_validation_error(client):
    response = client.post("/assessments", json={**SAMPLE, "grade": 10})
    assert response.status_code == 422


def test_validation_short_name(client):
    response = client.post("/assessments", json={**SAMPLE, "student_name": "A"})
    assert response.status_code == 422


def test_not_found(client):
    assert client.get("/assessments/9999").status_code == 404


def test_list_pagination(client):
    for i in range(3):
        client.post(
            "/assessments",
            json={**SAMPLE, "student_name": f"Оқушы {i}"},
        )

    response = client.get("/assessments", params={"limit": 2})
    assert len(response.json()) == 2


def test_filter_by_subject(client):
    client.post("/assessments", json=SAMPLE)
    client.post("/assessments", json={**SAMPLE, "subject": "Физика"})

    response = client.get("/assessments", params={"subject": "Физика"})
    assert len(response.json()) == 1
    assert response.json()[0]["subject"] == "Физика"
