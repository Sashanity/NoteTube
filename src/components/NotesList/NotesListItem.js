import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Badge from '@material-ui/core/Badge';
import PublicIcon from '@material-ui/icons/Public';

import Img1 from '../../img/notes.png';
import Img2 from '../../img/book-img.png';
import './NotesListItem.css';
import ListofItems from './listofItems';
import ClassNotes from './ClassNotes';
import { notePreview } from '../../actions/documents';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 345,
    width: 170,
    // height: 300
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function NotesListItem(props) {
  const {
    noteID,
    public_status,
    Notes_title,
    timestamp,
    courseName,
    semester,
    instructor,
    subject,
    setNotes,
  } = props;
  console.log('noteID:', noteID);

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const history = useHistory();
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handlePreview = (noteID, public_status) => {
    console.log('HANDLING PREVIEW, NOTEID', noteID);
    console.log('HANDLING PREVIEW, NOTEID', public_status);
    notePreview(history, noteID, public_status);
  };
  return (
    <div className='PublicNotes'>
      <div className='NotesListItem'>
        <Badge
          color='primary'
          badgeContent={
            public_status.toLowerCase() === 'true' ? <PublicIcon /> : null
          }
        >
          <Card className={classes.root}>
            <CardHeader
              avatar={
                <Avatar
                  aria-label='notes'
                  className={classes.avatar}
                  src={Img1}
                ></Avatar>
              }
              action={
                <ClassNotes
                  noteID={noteID}
                  public_status={public_status}
                  setNotes={setNotes}
                />
              }
              title={Notes_title}
              subheader={timestamp}
            />
            <CardMedia
              className={classes.media}
              image={Img2}
              title={courseName}
              onClick={(e) => {
                e.preventDefault();
                handlePreview(noteID, public_status);
              }}
            />
            <CardContent>
              <Typography variant='body2' color='textSecondary' component='p'>
                <p>{courseName}</p>
              </Typography>
            </CardContent>

            <CardActions disableSpacing>
              {/* <IconButton aria-label='Download'>
              <ArrowDownwardOutlinedIcon />
            </IconButton> */}

              <IconButton
                aria-label='OpenInNewTab'
                onClick={(e) => {
                  e.preventDefault();
                  handlePreview(noteID, public_status);
                }}
              >
                <OpenInNewIcon />
              </IconButton>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label='show more'
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout='auto' unmountOnExit>
              <CardContent>
                <Typography paragraph>
                  <b>Description:</b>
                </Typography>
                <Typography paragraph>
                  <p>
                    {' '}
                    {instructor} . {semester}
                  </p>
                  <p>{subject}</p>
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        </Badge>
      </div>
    </div>
  );
}
