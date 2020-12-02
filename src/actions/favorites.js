import axios from 'axios';
const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const getFavorites = async () => {
  console.log('IN get Favs action');
  let token = localStorage.getItem('token');
  console.log(token);
  try {
    let public_status = 'true';
    let res = await axios.get('/favoriteList', {
      params: { token, public_status },
    });
    public_status = 'false';
    let res2 = await axios.get('/favoriteList', {
      params: { token, public_status },
    });
    console.log('IN ACTION retList', res.data.List);
    // console.log('IN ACTION retList2', res2.data.List)
    return res.data.List.concat(res2.data.List);
  } catch (err) {
    console.log('Error: ', err);
  }
};

export const addFavorite = async (noteid, token, public_status) => {
  const body = JSON.stringify({
    noteid,
    token,
    public: public_status,
  });
  try {
    const res = await axios.post('/favoriteNote', body, config);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const removeFavorite = async (noteid, token, public_status) => {
  const body = JSON.stringify({
    noteid,
    token,
    public: public_status,
  });
  try {
    const res = await axios.delete(
      '/unfavoriteNote',
      { params: { noteid, token, public: public_status } },
      config
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const checkFavorite = async (noteid, token, public_status) => {
  try {
    const res = await axios.get(
      '/hasFavoritedNote',
      { params: { noteid, token, public: public_status } },
      config
    );
    console.log(res.data);
    return res;
  } catch (err) {
    console.log(err);
  }
};
