import { findUserByEmail } from "../models/user_model.js"; 
import { findUserByUsername } from "../models/user_model.js"; 
import { compare as bcryptCompare } from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(req, res, next) {
  try {
    //Haetaan bodyssa oleva user
        const { user } = req.body;
    if (!user || !user.identifier || !user.password) {
      return res.status(400).json({ error: "Identifier and password are required" });
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
        return res.status(401).json({ error: "Invalid email, username or password" });
        }

    //Luodaan jwt joka voimassa tunnin
    const accessToken = jwt.sign(
      { user_id: dbUser.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    //Luodaan refresh token joka voimassa 7 päivää
    const refreshToken = jwt.sign(
      { user_id: dbUser.user_id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    //käytetään cookies niin ei pääse javascriptillä käsiksi
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    //palautetaan perustiedot käyttäjästä ja kirjautumis token
    return res.json({
      user_id: dbUser.user_id,
      email: dbUser.email,
      username: dbUser.username,
      token: accessToken
    });

  } catch (err) {
    //virheet ohjataan error handelerille
    next(err);
  }
}