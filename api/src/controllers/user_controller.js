import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  saveRefreshToken,
  findUserById,
  changeUserPassword,
  getUserByRefreshToken,
  clearRefreshToken,
  getUserById,
} from "../models/user_model.js";
import { verifyRefreshToken } from "../utils/jwt.js";
import { compare as bcryptCompare } from "bcrypt";
import jwt from "jsonwebtoken";

function isValidPassword(password) {
  if (typeof password !== "string" || password.length < 8) return false;

  const chars = [...password];

  const hasLower = chars.some((c) => c >= "a" && c <= "z");
  const hasUpper = chars.some((c) => c >= "A" && c <= "Z");
  const hasNumber = chars.some((c) => c >= "0" && c <= "9");

  return hasLower && hasUpper && hasNumber;
}

export async function login(req, res, next) {
  try {
    //Haetaan bodyssa oleva user
    const { user } = req.body;
    if (!user || !user.identifier || !user.password) {
      return res
        .status(400)
        .json({ error: "Identifier and password are required" });
    }

    const { identifier, password } = user;

    // Tunnistetaan email tai käyttäjänimi sen perusteella onko @ merkki
    const isEmail = identifier.includes("@");

    const userResult = isEmail
      ? await findUserByEmail(identifier)
      : await findUserByUsername(identifier);

    //jos ei löydy käyttäjää annetaan error
    if (!userResult.rows.length) {
      return res.status(401).json({ error: "Invalid email or username" });
    }
    //jos käyttäjä tallennetaan muuttujaan
    const dbUser = userResult.rows[0];

    //verrataan annettua salasanaa tietokannan salasanaan
    const match = await bcryptCompare(password, dbUser.password);

    //jos eri annetaan ilkeä error jossa ei kerrota mikä on väärä
    if (!match) {
      return res
        .status(401)
        .json({ error: "Invalid email, username or password" });
    }

    //Luodaan jwt joka voimassa 15 min
    const accessToken = jwt.sign(
      { user_id: dbUser.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "15min" }
    );

    //Luodaan refresh token joka voimassa 7 päivää
    const refreshToken = jwt.sign(
      { user_id: dbUser.user_id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    //tallenna refresh token kantaan
    await saveRefreshToken(dbUser.username, refreshToken);

    //käytetään cookies niin ei pääse javascriptillä käsiksi
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //palautetaan perustiedot käyttäjästä ja kirjautumis token
    return res.json({
      user: {
        id: dbUser.user_id,
        email: dbUser.email,
        username: dbUser.username,
      },
      accessToken: accessToken,
    });
  } catch (err) {
    //virheet ohjataan error handelerille
    next(err);
  }
}

export async function signUp(req, res, next) {
  try {
    const { user } = req.body;
    if ((!user || !user.email || !user.password, !user.username)) {
      const err = new Error("Email, username and password are required");
      err.status = 400;
      return next(err);
    }

    if (!isValidPassword(user.password)) {
      return res
        .status(400)
        .json({
          error:
            "Password must be at least 8 characters long and include at least one uppercase letter and a number",
        });
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

export async function refreshAccessToken(req, res, next) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res
        .status(403)
        .json({ error: "Invalid or expired refresh token" });
    }

    const user = await getUserByRefreshToken(refreshToken);
    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "15min" }
    );

    res.json({
      accessToken,
      user: {
        id: user.user_id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      const user = await getUserByRefreshToken(refreshToken);

      if (user) {
        await clearRefreshToken(user.username);
      }
    }

    res.clearCookie("refreshToken");

    res.json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  }
}

export async function getUserInfoById(req, res, next) {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "Missing user_id parameter" });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const userId = req.user?.user_id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Old password and new password are required" });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!isValidPassword(newPassword)) {
      return res
        .status(400)
        .json({
          error:
            "Password must be at least 8 characters long and include at least one uppercase letter and a number.",
        });
    }
    const dbUser = user.rows[0];
    const match = await bcryptCompare(oldPassword, dbUser.password);
    if (!match) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }
    await changeUserPassword(userId, newPassword);
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
}
