import { expect } from "chai";
// jossain vaiheessa voi lisätä vaikka reviewejä ja leffoja kantaan niin saa testattua
//import { initializeTestDb } from "./helper/test.js";

describe("Testing user management", () => {
  const user = {
    identifier: "foo@test.com",
    password: "password123",
  };
  let id = -1;
  let accessToken = null;

  //before(async () => {
  //  await initializeTestDb();
  //});
  it("should sign up", async () => {
    const newUser = {
      email: "foo@test.com",
      username: "fooTest",
      password: "password123",
    };
    const response = await fetch("http://localhost:3002/user/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: newUser }),
    });
    const data = await response.json();
    expect(response.status).to.equal(201);
    expect(data).to.include.all.keys(["user_id", "email"]);
    expect(data.email).to.equal(newUser.email);
  });

  it("should log in", async () => {
    const response = await fetch("http://localhost:3002/user/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: user }),
    });
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.include.all.keys(["user", "accessToken"]);
    expect(data.user).to.include.all.keys(["id", "email", "username"]);
    expect(data.user.email).to.equal(user.identifier);
    id = data.user.id;
    accessToken = data.accessToken;
  });
  // sign out

  //delete user
  it("should delete user", async () => {
    const response = await fetch(`http://localhost:3002/user/delete/${id}`, {
      method: "delete",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
    });
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.include.all.keys(["deleted_user_id", "message"]);
  });
});

// describe("Other features", () => {
//   const user = { email: "foo2@test.com", password: "password123" };
//   // browse ratings
// });
