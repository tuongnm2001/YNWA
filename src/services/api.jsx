import axios from "../utils/axios-customize"

const register = (fullName, email, password, phone) => {
    return axios.post(`/api/v1/user/register`, { fullName, email, password, phone })
}

const login = (email, password) => {
    return axios.post(`/api/v1/auth/login`, {
        username: email,
        password: password,
        delay: 3000
    })
}

const fetchAccount = () => {
    return axios.get(`api/v1/auth/account`)
}

const logout = () => {
    return axios.post(`/api/v1/auth/logout`)
}

// const getUserWithPaginate = (current, pageSize) => {
//     return axios.get(`api/v1/user?current=${current}&pageSize=${pageSize}`)
// }

const getUserWithPaginate = (query) => {
    return axios.get(`api/v1/user?${query}`)
}

const postAddNewUser = (fullName, password, email, phone) => {
    return axios.post(`/api/v1/user`, { fullName, password, email, phone })
}

const postCreateListUserBulk = (data) => {
    return axios.post(`api/v1/user/bulk-create`, data)
}

const putUpdateUser = (_id, fullName, phone) => {
    return axios.put(`/api/v1/user`, { _id, fullName, phone })
}

const deleteAUser = (_id) => {
    return axios.delete(`api/v1/user/${_id}`);
}

const getListBookWithPaginate = (query) => {
    return axios.get(`/api/v1/book?${query}`)
}

const getAllCategory = () => {
    return axios.get(`/api/v1/database/category`)
}

const callUploadBookImg = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book"
        },
    });
}

const createABook = (mainText, author, price, category, quantity, sold, thumbnail, slider) => {
    return axios.post(`/api/v1/book`, { mainText, author, price, category, quantity, sold, thumbnail, slider })
}

const putUpdateBook = (_id, mainText, author, price, category, quantity, sold, thumbnail, slider) => {
    return axios.put(`/api/v1/book/${_id}`, { mainText, author, price, category, quantity, sold, thumbnail, slider })
}

const deleteABook = (id) => {
    return axios.delete(`/api/v1/book/${id}`)
}

const fetchBookById = (id) => {
    return axios.get(`api/v1/book/${id}`)
}

const postCreateAnOrder = (data) => {
    return axios.post(`/api/v1/order`, { ...data })
}

const getOrderHistory = () => {
    return axios.get(`api/v1/history`)
}

const postUploadAvatar = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "avatar"
        },
    });
}

const putUpdateInfo = (_id, avatar, phone, fullName) => {
    return axios.put(`api/v1/user`, { _id, avatar, phone, fullName })
}

const postUserChangePassword = (email, oldpass, newpass) => {
    return axios.post(`/api/v1/user/change-password`, { email, oldpass, newpass })
}

const getDashBoard = () => {
    return axios.get(`/api/v1/database/dashboard`)
}

const totalBook = () => {
    return axios.get(`/api/v1/book`)
}

const getListOrder = (query) => {
    return axios.get(`/api/v1/order?${query}`)
}

export {
    register, login, fetchAccount, logout, getUserWithPaginate,
    postAddNewUser, postCreateListUserBulk, putUpdateUser, deleteAUser,
    getListBookWithPaginate, getAllCategory, callUploadBookImg, createABook,
    putUpdateBook, deleteABook, fetchBookById, postCreateAnOrder, getOrderHistory,
    postUploadAvatar, putUpdateInfo, postUserChangePassword, getDashBoard, totalBook,
    getListOrder
}