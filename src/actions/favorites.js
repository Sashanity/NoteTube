import axios from 'axios';


export const getFavorites = async () => {
    console.log('IN get Favs action')
    let token = localStorage.getItem('token');
    console.log(token);
    try {
        let res = await axios.get('/favoriteList', { params: { token } });
        return res.data.retList;
    } catch (err) {
        console.log('Error: ', err);
    }
};