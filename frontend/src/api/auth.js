const AUTH_API = "http://localhost:3000/feed/auth"; 
//url of express, feed/auth as the router of express is staring from this only.

async function request(path, payload){
    const res = await fetch(`${AUTH_API}${path}`, {
        method: "post",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })

    // console.log("payload is :", payload);

    const body = await res.json();

    return {ok: res.ok, body};
}

export function signup(payload){
    return request('/signup', payload);
}

export function login(payload){
    return request('/login', payload);
}

//for google login
export function googleLogin(payload){
    // console.log("payload of google is: ", payload);
    //here payload: {credentials, role} credentials is the id token passed by the googlebtn.
    return request('/google', payload);
}

export function logout(){ //only this much required as we only wanna remove the local storage saved item only as without
    // info the brower will consider them as the logged out user.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}