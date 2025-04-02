import { makeStyles } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    boxSizing: "border-box",
  },
  tooltip: {
    "& ul": {
      listStylePosition: "outside",
      paddingLeft: "15px",
    },
  },
  gridDiv: {
    flexGrow: 1,
    overflowY: "auto",
  },
  dataGrid: {
    // minWidth: "550px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "10px",
  },
});
