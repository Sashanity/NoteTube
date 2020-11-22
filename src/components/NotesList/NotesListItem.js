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
import Img1 from '../../img/notes.png';
import Img2 from '../../img/book-img.png';
import './NotesListItem.css';
import ListofItems from "./listofItems";
import ClassNotes from "./ClassNotes";
import { notePreview } from '../../actions/documents'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
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
  const { noteID, Notes_title, timestamp, courseName, semester, instructor, subject } = props
  console.log('noteID:', noteID)

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handlePreview = (noteID) => {
    console.log("HANDLING PREVIEW, NOTEID", noteID)
    notePreview(noteID)
  }
  return (
    <div className="PublicNotes">
      <div className="NotesListItem">
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label="notes" className={classes.avatar}
                src={Img1}>
              </Avatar>
            }
            action={<ClassNotes noteID={noteID} />}
            title={Notes_title}
            subheader={timestamp}
          />
          <CardMedia
            className={classes.media}
            image={Img2}
            title={courseName}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              <p>{courseName}</p>
            </Typography>
          </CardContent>

          <CardActions disableSpacing>

            <IconButton aria-label="Download">
              <ArrowDownwardOutlinedIcon />

            </IconButton>
            <IconButton aria-label="OpenInNewTab"
              onClick={handlePreview(noteID)}>
              <OpenInNewIcon />
            </IconButton>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph><b>Description:</b></Typography>
              <Typography paragraph>
                <p> {instructor} . {semester}</p>
                <p>{subject}</p>
              </Typography>
            </CardContent>

          </Collapse>

        </Card>
      </div>
    </div>
  );
}
