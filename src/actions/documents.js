import axios from 'axios';
const config = {
	headers: {
		'Content-Type': 'application/json',
	},
};
export const search = async (history, searchInput) => {
	try {
		const res = await axios.get(
			'/search',
			{
				params: {
					searchInput: searchInput,
				},
			},
			config
		);
		history.push('/searchOverview', res.data);
	} catch (err) {
		console.log(err);
		return err.response.data;
	}
};
