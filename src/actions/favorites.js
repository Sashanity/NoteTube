import axios from 'axios';


export const getFavorites = async () => {
    console.log('IN get Favs action')
    let token = localStorage.getItem('token');
    console.log(token);
    try {
        let public_status = 'true'
        let res = await axios.get('/favoriteList', { params: { token, public_status } });
        public_status = 'false'
        let res2 = await axios.get('/favoriteList', { params: { token, public_status } });
        console.log('IN ACTION retList', res.data.List)
        // console.log('IN ACTION retList2', res2.data.List)
        return res.data.List.concat(res2.data.List)
    } catch (err) {
        console.log('Error: ', err);
    }
};