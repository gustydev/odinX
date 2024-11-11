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
        console.log('huh')
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
        err.details.forEach((d) => {
            toast.error(d.msg)
        })
    }
}