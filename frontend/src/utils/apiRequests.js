import { API_URL, apiRequest } from "./api";
import { toast } from "react-toastify";

export async function registerUser(data, nav) {
    try {
        await apiRequest(`${API_URL}/api/auth/register`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        toast.success(`User ${data.username} registered successfully! Proceed to log in`)
        nav('/auth/login')
    } catch (err) {
        // Only toast error messages if trying to register a non demo account
        if (!data.demo) {
            err.details.forEach((e) => {
                toast.error(e.msg);
            })
        }
    }
}

export async function likePost(postId, token, socket) {
    try {
        const data = await apiRequest(`${API_URL}/api/post/${postId}/like`, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        socket.emit('likePost', data.post);
    } catch (err) {
        console.error(err);
    }
}

export async function postReply(postId, data, token, socket) {
    try {
        const res = await apiRequest(`${API_URL}/api/post/${postId}/reply`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })

        socket.emit('postReply', res.reply)
    } catch (err) {
        console.error(err);
        err.details?.forEach((d) => {
            toast.error(d.msg)
        })
    }
}

export async function newPost(data, token) {
    try {
        const res = await apiRequest(`${API_URL}/api/post`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        window.location = `/post/${res.post.id}`
    } catch (err) {
        console.error(err);
    }
}

export async function followUser(userId, token, socket) {
    try {
        const data = await apiRequest(`${API_URL}/api/user/${userId}/follow`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        socket.emit('followUser', data)
    } catch (err) {
        console.error(err);
        toast.error(err.message);
    }
}

export async function editProfile(userId, data, token) {
    try {
        const formData = new FormData();

        formData.append('displayName', data.displayName);
        formData.append('bio', data.bio);

        if (data.pic && data.pic instanceof File) {
            formData.append('pic', data.pic);
        }

        await apiRequest(`${API_URL}/api/user/${userId}`, {
            method: 'put',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })

        location.reload()
    } catch (err) {
        err.details?.forEach((d) => {
            toast.error(d.msg)
        })
    }
}

export async function editPost(postId, data, token) {
    try {
        await apiRequest(`${API_URL}/api/post/${postId}`, {
            method: 'put',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        location.reload()
    } catch (err) {
        console.log(err)
        err.details?.forEach((d) => {
            toast.error(d.msg)
        })
    }
}

export async function deletePost(postId, token) {
    try {
        await apiRequest(`${API_URL}/api/post/${postId}`, {
            method: 'delete',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        window.location = '/'
    } catch (err) {
        console.log(err)
    }
}

export async function deleteUser(userId, token, logout) {
    try {
        await apiRequest(`${API_URL}/api/user/${userId}`, {
            method: 'delete',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        logout(); // Log out the user
        window.location = '/' // Redirect to front page (login, since user is logged out)
    } catch (err) {
        console.log(err)
    }
}