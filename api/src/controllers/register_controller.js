import { createUser, findUserByEmail } from "../models/user_model.js";

export async function signUp(req, res, next) {
  try {
    const { user } = req.body;
    if ((!user || !user.email || !user.password, !user.username)) {
      const err = new Error("Email, username and password are required");
      err.status = 400;
      return next(err);
    }

    const existing = await findUserByEmail(user.email);
    if (existing.rows && existing.rows.length > 0) {
      const err = new Error("Email is already in use");
      err.status = 409;
      return next(err);
    }

    const result = await createUser(user.email, user.username, user.password);
    return res
      .status(201)
      .json({ user_id: result.rows[0].user_id, email: result.rows[0].email });
  } catch (err) {
    return next(err);
  }
}
