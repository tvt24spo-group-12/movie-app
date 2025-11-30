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

  
  it("should not sign up with existing email", async () => {
    const existingUser = {
      email: "foo@test.com",
      username: "fooTest2",
      password: "password1234",
    };
    const response = await fetch("http://localhost:3002/user/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: existingUser }),
    });
    expect(response.status).to.equal(409);
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

  it("should not log in with wrong credentials", async () => {
    const response = await fetch("http://localhost:3002/user/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: { identifier: user.identifier, password: "wrongpass" },
      }),
    });
    expect(response.status).to.equal(401);
  });

  
  it("should log out", async () => {
    const response = await fetch("http://localhost:3002/user/logout", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(response.status).to.equal(200);
  });


  it("should not delete user without authentication token", async () => {
    const response = await fetch(`http://localhost:3002/user/delete/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(response.status).to.equal(401);
  });
  
  //delete user
  it("should delete user", async () => {
    const response = await fetch(`http://localhost:3002/user/delete/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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
