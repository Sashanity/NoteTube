import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import { useHistory } from 'react-router-dom';
import { search } from '../../actions/documents';
import IconButton from '@material-ui/core/IconButton';

import SearchIcon from '@material-ui/icons/Search';

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

const CustomizedInputBase = () => {
	const classes = useStyles();
	const [input, setInput] = useState('');
	const history = useHistory();

	const onSubmit = async (e) => {
		e.preventDefault();
		const res = await search(history, input);
	};
	return (
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
