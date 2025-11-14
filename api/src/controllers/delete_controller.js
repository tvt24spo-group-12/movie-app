import pool from "../database.js";

/**
 * Poistaa käyttäjätilin ja kaikki liittyvät tiedot.
 * @param {Object} req - Express request object
 * @param {string} req.params.user_id - Käyttäjän ID (voi olla myös req.body.user_id)
 * @param {string} req.body.user_id - Vaihtoehtoinen tapa välittää user_id
 * @note Frontend voi tallentaa user_id:n kirjautumisen jälkeen ja käyttää sitä tässä endpointissa
 * @todo Lisää JWT-autentikointi, että käyttäjä voi poistaa vain oman tilinsä
 */

export async function deleteUserAccount(req, res, next) {
  const client = await pool.connect();
  
  try {
    // user_id saadaan login-vastauksesta (login_controller.js palauttaa user_id:n)
    const userId = req.params.user_id || req.body.user_id;
    
    if (!userId) {
      return res.status(400).json({ error: "user id pakollinen" });
    }

    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: "user id ei ole numero" });
    }

    await client.query("BEGIN");

    const userCheck = await client.query(
      "SELECT user_id FROM users WHERE user_id = $1",
      [userIdNum]
    );

    if (userCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "käyttäjä ei löydy" });
    }

    // 1. Poista elokuvien äänet
    await client.query(
      "DELETE FROM movie_votes WHERE user_id = $1",
      [userIdNum]
    );

    // 2. Poista ryhmän elokuvien ehdotukset (jotka käyttäjä on ehdottanut)
    await client.query(
      "DELETE FROM group_movie_suggestions WHERE suggested_by = $1",
      [userIdNum]
    );

    // 3. Siirrä ryhmien omistajuus toiselle jäsenelle (ENNEN kuin poistetaan jäsenyys)
    const ownedGroups = await client.query(
      "SELECT group_id FROM groups WHERE owner_id = $1",
      [userIdNum]
    );

    for (const group of ownedGroups.rows) {
      // Etsi ensimmäinen muu jäsen ryhmästä (käyttäjä on vielä jäsenenä tässä vaiheessa)
      const otherMembers = await client.query(
        "SELECT user_id FROM group_members WHERE group_id = $1 AND user_id != $2 LIMIT 1",
        [group.group_id, userIdNum]
      );

      if (otherMembers.rows.length > 0) {
        // Siirrä omistajuus ensimmäiselle muulle jäsenelle
        const newOwnerId = otherMembers.rows[0].user_id;
        await client.query(
          "UPDATE groups SET owner_id = $1 WHERE group_id = $2",
          [newOwnerId, group.group_id]
        );
      } else {
        // Jos ryhmässä ei ole muita jäseniä, poista ryhmä ja sen liittyvät tiedot
        await client.query(
          "DELETE FROM group_movie_suggestions WHERE group_id = $1",
          [group.group_id]
        );
        await client.query(
          "DELETE FROM group_members WHERE group_id = $1",
          [group.group_id]
        );
        await client.query(
          "DELETE FROM groups WHERE group_id = $1",
          [group.group_id]
        );
      }
    }

    // 4. Poista ryhmäjäsenuudet (nyt kun omistajuus on siirretty)
    await client.query(
      "DELETE FROM group_members WHERE user_id = $1",
      [userIdNum]
    );

    // 5. Poista suosikit elokuvat
    await client.query(
      "DELETE FROM favourite_movies WHERE user_id = $1",
      [userIdNum]
    );

    // 6. Poista käyttäjätili
    const deleteResult = await client.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING user_id",
      [userIdNum]
    );

    await client.query("COMMIT");

    res.json({
      message: "käyttäjätili ja kaikki liittyvät tiedot poistettu onnistuneesti",
      deleted_user_id: deleteResult.rows[0].user_id,
    });
  } catch (err) {
    // Rollbacktaa transaktion virheen tapauksessa
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}