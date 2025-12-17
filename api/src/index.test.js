import { expect } from "chai";
// jossain vaiheessa voi lisätä vaikka reviewejä ja leffoja kantaan niin saa testattua
//import { initializeTestDb } from "./helper/test.js";

describe("Testing user management", () => {
  const user = {
    identifier: "foo@test.com",
    password: "Password123",
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
      password: "Password123",
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

  it("should reject signup when password has no uppercase letter", async () => {
    const res = await fetch("http://localhost:3002/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          email: "noupcase@test.com",
          username: "noUppercase",
          password: "password123",
        },
      }),
    });

    const body = await res.json();

    expect(res.status).to.equal(400);
    expect(body).to.have.property("error");
  });

  it("should reject signup when password has no number", async () => {
    const res = await fetch("http://localhost:3002/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          email: "nonumber@test.com",
          username: "noNumber",
          password: "PasswordOnly",
        },
      }),
    });

    const body = await res.json();

    expect(res.status).to.equal(400);
    expect(body).to.have.property("error");
  });

  it("should not sign up with existing email", async () => {
    const existingUser = {
      email: "foo@test.com",
      username: "fooTest2",
      password: "Password1234",
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

describe("Testing rating system", () => {
  const unique = Date.now();
  const testUser = {
    email: `ratertest+${unique}@example.com`,
    username: `rater${unique}`,
    password: "Password123",
  };

  let accessToken = null;
  const movieId = 550;

  it("should sign up and log in", async () => {
    const signupRes = await fetch("http://localhost:3002/user/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: testUser }),
    });
    expect([201, 409]).to.include(signupRes.status);

    const loginRes = await fetch("http://localhost:3002/user/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: { identifier: testUser.email, password: testUser.password },
      }),
    });
    const loginData = await loginRes.json();
    expect(loginRes.status).to.equal(200);
    expect(loginData).to.have.property("accessToken");
    accessToken = loginData.accessToken;
  });

  it("should create a public rating for a movie", async () => {
    const body = { score: 4, review: "great", public: true };
    const res = await fetch(`http://localhost:3002/movie/${movieId}/rating`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    expect(res.status).to.equal(201);
    expect(data).to.have.property("rating");
    expect(data.rating).to.include.all.keys(["movie_id", "score", "public"]);
    expect(Number(data.rating.movie_id)).to.equal(movieId);
  });

  it("should browse public ratings for the movie", async () => {
    const res = await fetch(`http://localhost:3002/movie/${movieId}/ratings`);
    const data = await res.json();
    expect(res.status).to.equal(200);
    expect(data).to.include.all.keys([
      "movie_id",
      "average_rating",
      "rating_count",
      "ratings",
    ]);
    expect(data.movie_id).to.equal(movieId);
    expect(Array.isArray(data.ratings)).to.be.true;
    expect(data.rating_count).to.be.at.least(1);
  });

  it("should return the current user's rating for the movie", async () => {
    const res = await fetch(`http://localhost:3002/movie/${movieId}/rating`, {
      method: "get",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    expect(res.status).to.equal(200);
    expect(data).to.have.property("rating");
    expect(data.rating.movie_id).to.equal(movieId);
    expect(data.rating.score).to.equal(4);
  });

  it("should list the user's ratings", async () => {
    const res = await fetch("http://localhost:3002/user/ratings", {
      method: "get",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    expect(res.status).to.equal(200);
    expect(data).to.include.all.keys(["user_id", "rating_count", "ratings"]);
    expect(Array.isArray(data.ratings)).to.be.true;
  });

  // Negatiiviset testit
  it("should return 400 for ratings when movie id is invalid", async () => {
    const res = await fetch(`http://localhost:3002/movie/abc/ratings`);
    expect(res.status).to.equal(400);
  });

  it("should reject creating a rating with invalid score", async () => {
    const body = { score: 0, review: "bad score", public: true };
    const res = await fetch(`http://localhost:3002/movie/${movieId}/rating`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    expect(res.status).to.equal(400);
  });

  it("should return 401 when requesting user's movie rating without auth", async () => {
    const res = await fetch(`http://localhost:3002/movie/${movieId}/rating`);
    expect([401, 403]).to.include(res.status);
  });

  it("should return 401 when listing current user's ratings without auth", async () => {
    const res = await fetch("http://localhost:3002/user/ratings");
    expect([401, 403]).to.include(res.status);
  });

  it("should return 401 when deleting a rating without auth", async () => {
    const res = await fetch(`http://localhost:3002/movie/${movieId}/rating`, {
      method: "delete",
    });
    expect([401, 403]).to.include(res.status);
  });
});
