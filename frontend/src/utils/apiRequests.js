import { API_URL, apiRequest } from "./api";
import { toast } from "react-toastify";

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
        await apiRequest(`${API_URL}/api/user/${userId}`, {
            method: 'put',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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