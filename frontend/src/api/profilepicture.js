const URL = "http://localhost:3001/user"

export async function uploadProfilePicture(picture, user){
    console.log(user.id, " ", picture);
    const userId = user.id
    try {
        const response = await fetch(`${URL}/profile-picture/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ picture, user })
        });
        return response;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

