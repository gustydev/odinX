import { API_URL, apiRequest } from "./api";

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