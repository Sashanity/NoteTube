import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';

import IconButton from '@material-ui/core/IconButton';

import SearchIcon from '@material-ui/icons/Search';

import algoliasearch from 'algoliasearch/lite';
import {
	InstantSearch,
	Hits,
	SearchBox,
	Pagination,
	Highlight,
	ClearRefinements,
	RefinementList,
	Configure,
} from 'react-instantsearch-dom';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: '100%',
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
	divider: {
		height: 28,
		margin: 4,
	},
}));

// const useStyles = makeStyles((theme) => ({
// 	root: {
// 		'& > *': {
// 			margin: theme.spacing(1),
// 			width: '25ch',
// 		},
// 	},
// }));

const CustomizedInputBase = () => {
	const classes = useStyles();
	const [input, setInput] = useState('');

	const onSubmit = async (e) => {
		e.preventDefault();
	};
	const searchClient = algoliasearch(
		process.env.ALGOLIA_APP_ID,
		process.env.ALGOLIA_API_KEY
	);

	return (
		// <form className={classes.root} noValidate autoComplete='off'>
		// 	<TextField id='outlined-basic' label='Outlined' variant='outlined' />
		// </form>

		// <div className='ais-InstantSearch'>
		// 	<InstantSearch indexName='notes' searchClient={searchClient}>
		// 		<SearchBox />
		// 	</InstantSearch>
		// </div>

		<div>
			<Paper
				component='form'
				className={classes.root}
				onSubmit={(e) => onSubmit(e)}
			>
				<InputBase
					className={classes.input}
					placeholder='Enter a name, course, semester, or instructor...'
					fullWidth
					required
					id='input'
					inputProps={{ 'aria-label': 'search google maps' }}
					value={input}
					name='input'
					onChange={(e) => setInput(e.target.value)}
				/>
				<IconButton
					type='submit'
					className={classes.iconButton}
					aria-label='search'
				>
					<SearchIcon />
				</IconButton>
			</Paper>
		</div>
	);
};
export default CustomizedInputBase;
