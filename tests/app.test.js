const req = require("supertest");
const { app } = require("../src/index");

describe(`authentication`, () => {
  it(`should be an ok signup request with status 200`, async () => {
    const response = await req(app)
      .post("/api/user/signup")
      .set("Content-Type", "multipart/form-data")
      .send(
        JSON.stringify({
          name: "Kamran",
          email: "user5@yahoo.com",
          password: "123456",
          address: "location",
          phone_no: "012568974",
          image: "img.png",
          user_role: "admin",
        })
      );

    expect(response.status).toBe(200);
  });

  it(`should be an ok login request with status 200`, async () => {
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjoiNjYyZDMwNzZmZDE3MjNmMjQwOWExM2Q1IiwiaWF0IjoxNzE0MjM3NTU5LCJleHAiOjE3MTk0MjE1NTl9.ZzcJSY9bP23rqHIhyII_D1m9w9Qc9w5mpqX1w2AqmEw";

    const response = await req(app)
      .post("/api/user/login")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", authToken)
      .send(
        JSON.stringify({
          email: "user5@yahoo.com",
          password: "123456",
        })
      );

    expect(response.status).toBe(200);
  });
});

describe(`admin privilege over api requests and secure paths`, () => {
  it(`should be an ok admin request with status 200`, async () => {
    const adminLoginToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpZCI6IjY2MmQzZmYyMjM2N2I0MTA4MzA2ZTNmNyIsImxvZ2luIjp0cnVlLCJpYXQiOjE3MTQyNDE2MDQsImV4cCI6MTcxOTQyNTYwNH0.rmWmjydsPR8L-booCvD1qcezJkChUAA7sXiwP08BmLY";

    const response = await req(app)
      .get("/api/user/all-users")
      .set("Authorization", adminLoginToken);

    expect(response.status).toBe(200);
  });
});
