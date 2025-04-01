import { makeStyles } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  tooltip:{
    '& ul': {
      listStylePosition: 'outside',
      paddingLeft: '15px',
    }
  }
});