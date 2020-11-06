import React, { useState, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import 'instantsearch.css/themes/algolia.css';
import { motion } from 'framer-motion';

import {
	InstantSearch,
	Hits,
	SearchBox,
	Pagination,
	Highlight,
	ClearRefinements,
	RefinementList,
	Configure,
	SortBy,
	connectRefinementList,
} from 'react-instantsearch-dom';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	// searchBox: {
	// 	justifyContent: 'center',
	// 	width: 600,
	// 	height: 300,
	// },
	iconButton: {
		padding: 10,
	},
	divider: {
		height: 28,
		margin: 4,
	},
}));

const Home = () => {
	const searchClient = algoliasearch(
		process.env.REACT_APP_ALGOLIA_APP_ID,
		process.env.REACT_APP_ALGOLIA_SEARCH_ID
	);
	const history = useHistory();
	const [searchBoxAnimation, setSearchBoxAnimation] = useState({
		begin: {
			opacity: 1,
		},
		end: { y: 0, scale: 1 },
	});
	const [submit, setSubmit] = useState(false);
	const classes = useStyles();
	const Hit = ({ hit }) => (
		<div>
			<p>{hit.name}</p>
			<p>{hit.instructor}</p>
			<p>{hit.course}</p>
			<p>{hit.subject}</p>
		</div>
	);
	const RefinementList = ({ items, currentRefinement, refine }) => (
		<div>
			<div>Current refinement: {currentRefinement.join(', ')}</div>
			<ul>
				{items.map((item) => (
					<li key={item.label}>
						<a
							href='#'
							style={{
								fontWeight: item.isRefined ? 'bold' : '',
								color: 'white',
							}}
							onClick={(event) => {
								event.preventDefault();
								refine(item.value);
							}}
						>
							{item.label} ({item.count})
						</a>
					</li>
				))}
			</ul>
		</div>
	);
	const CustomRefinementList = connectRefinementList(RefinementList);

	return (
		<div className={classes.root}>
			<InstantSearch searchClient={searchClient} indexName='notes'>
				<Grid container spacing={2} direction='column'>
					<Grid item xs={12} container>
						<Grid item xs={3} />
						<Grid item xs={5}>
							<motion.div
								variants={searchBoxAnimation}
								initial={{ opacity: 0, y: 300, scale: 1.3 }}
								animate={submit ? 'end' : 'begin'}
								transition={
									submit
										? { type: 'spring', stiffness: 50 }
										: { delay: 1.0, duration: 1.0 }
								}
							>
								<SearchBox
									onChange={(e) => {
										setSubmit(true);
									}}
									translations={{
										placeholder: 'Search by name, course, instructor...',
									}}
								/>
							</motion.div>
						</Grid>
					</Grid>
					<Grid item xs={12} container>
						<Grid item xs={7} />
						{submit ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5, duration: 1.0 }}
							>
								<SortBy
									defaultRefinement='notes'
									items={[
										{ value: 'notes', label: 'Sort' },
										{
											value: 'Instructor Ascending',
											label: 'Instructor (asc)',
										},
										{
											value: 'Instructor Descending',
											label: 'Instructor (desc)',
										},
										{
											value: 'Newest to Oldest',
											label: 'Newest to Oldest',
										},
										{
											value: 'Oldest to Newest',
											label: 'Oldest to Newest',
										},
									]}
								/>
							</motion.div>
						) : (
							<></>
						)}
					</Grid>
					<Grid item xs={12} container>
						<Grid item xs={2} />
						<Grid item xs={1}>
							{submit ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.5, duration: 1.0 }}
								>
									<CustomRefinementList attribute='subject' />
								</motion.div>
							) : (
								<></>
							)}
						</Grid>
						<Grid item xs={5}>
							{submit ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.5, duration: 1.0 }}
								>
									<Hits hitComponent={Hit} />
								</motion.div>
							) : (
								<></>
							)}
						</Grid>
					</Grid>
				</Grid>
			</InstantSearch>
		</div>
	);
};

export default Home;
