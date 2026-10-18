import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  const token = await (global as unknown as NodeJS.Global).signin();
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Authorization", `Bearer test`)
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
