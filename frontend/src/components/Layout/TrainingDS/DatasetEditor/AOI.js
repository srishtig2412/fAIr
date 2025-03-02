import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Pagination,
  SvgIcon,
  Typography,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import MapIcon from "@mui/icons-material/Map";
import FolderIcon from "@mui/icons-material/Folder";
import { MapTwoTone, ZoomInMap } from "@mui/icons-material";
import usePagination from "./Pagination";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";

import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { useMutation } from "react-query";
import axios from "../../../../axios";
import AOIDetails from "./AOIDetails";
import AuthContext from "../../../../Context/AuthContext";
const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const ListItemWithWiderSecondaryAction = withStyles({
  secondaryAction: {
    paddingRight: 96,
  },
})(ListItem);

const PER_PAGE = 5;
const AOI = (props) => {
  const [dense, setDense] = useState(true);
  const count = Math.ceil(props.mapLayers.length / PER_PAGE);
  let [page, setPage] = useState(1);
  let _DATA = usePagination(
    props.mapLayers.filter((e) => e.type === "aoi"),
    PER_PAGE
  );
  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };
  // console.log("_DATA", _DATA);
  useEffect(() => {
    return () => {};
  }, [props]);

  const { accessToken } = useContext(AuthContext);
  const fetchOSMLebels = async (aoiId) => {
    try {
      const headers = {
        "access-token": accessToken,
      };

      const res = await axios.post(`/label/osm/fetch/${aoiId}/`, null, {
        headers,
      });

      if (res.error) {
        // setMapError(res.error.response.statusText);
        console.log(res.error.response.statusText);
      } else {
        // success full fetch

        return res.data;
      }
    } catch (e) {
      console.log("isError", e);
    } finally {
    }
  };
  const { mutate: mutateFetch, data: fetchResult } =
    useMutation(fetchOSMLebels);

  return (
    <>
      <Grid item md={12} className="card">
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          List of Area of Interests
        </Typography>
        <Demo>
          {props.mapLayers && props.mapLayers.length > PER_PAGE && (
            <Pagination
              count={count}
              size="large"
              page={page}
              variant="outlined"
              shape="rounded"
              onChange={handleChange}
            />
          )}
          <List dense={dense}>
            {props.mapLayers &&
              props.mapLayers.length > 0 &&
              _DATA.currentData().map((layer) => (
                <ListItemWithWiderSecondaryAction
                  className="classname"
                  key={layer.id}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={"AOI id " + layer.aoiId}
                    secondary={
                      <span>
                        Area: {parseInt(layer.area).toLocaleString()} sqm <br />
                        <span style={{ color: "red" }}>
                          {parseInt(layer.area) < 5000 ? (
                            <>
                              Area seems to be very small for an AOI
                              <br />
                              Make sure it is not a Label
                            </>
                          ) : (
                            ""
                          )}
                        </span>
                        {/* add here a container to get the AOI status from DB */}
                        {layer.aoiId && (
                          <AOIDetails aoiId={layer.aoiId}></AOIDetails>
                        )}
                      </span>
                    }
                  />
                  <ListItemSecondaryAction>
                    {/* <IconButton aria-label="comments">
                   <DeleteIcon />
                </IconButton> */}
                    <IconButton
                      aria-label="comments"
                      sx={{ width: 24, height: 24 }}
                      className="margin1 transparent"
                      onClick={(e) => {
                        // mutateFetch(layer.aoiId);
                        // console.log("Open in Editor")
                        window.open(
                          `https://mapwith.ai/rapid#background=${
                            props.oamImagery
                              ? "custom:" + props.oamImagery.url
                              : "Bing"
                          }&datasets=fbRoads,msBuildings&disable_features=boundaries&map=16.00/17.9253/120.4841&gpx=&gpx=https://fair-dev.hotosm.org/api/v1/aoi/gpx/${
                            layer.aoiId
                          }`,
                          "_blank",
                          "noreferrer"
                        );
                      }}
                    >
                      {/* <MapTwoTone   /> */}
                      <img
                        alt="RapiD logo"
                        className="rapid-logo-small"
                        src="https://mapwith.ai/splash/prod/e70aaae-dist/svg/RapidLogo.svg"
                      />
                    </IconButton>
                    <IconButton
                      aria-label="comments"
                      sx={{ width: 24, height: 24 }}
                      className="margin1 transparent"
                      onClick={(e) => {
                        // mutateFetch(layer.aoiId);
                        // console.log("Open in Editor")
                        window.open(
                          `https://www.openstreetmap.org/edit/#background=${
                            props.oamImagery
                              ? "custom:" + props.oamImagery.url
                              : "Bing"
                          }&disable_features=boundaries&gpx=https://fair-dev.hotosm.org/api/v1/aoi/gpx/${
                            layer.aoiId
                          }&map=10.70/18.9226/81.6991`,
                          "_blank",
                          "noreferrer"
                        );
                      }}
                    >
                      {/* <MapTwoTone   /> */}
                      <img
                        alt="OSM logo"
                        className="osm-logo-small"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/256px-Openstreetmap_logo.svg.png"
                      />
                    </IconButton>
                    <IconButton
                      aria-label="comments"
                      sx={{ width: 24, height: 24 }}
                      className="margin1"
                      onClick={(e) => {
                        mutateFetch(layer.aoiId);
                        console.log("call galaxy API to fetch OSM labels");
                      }}
                    >
                      <MapTwoTone fontSize="small" />
                    </IconButton>
                    {/* <IconButton aria-label="comments"
                className="margin1"
                disabled
                onClick={(e)=> {

                  console.log("Remove labels ")
                }}>
                   <PlaylistRemoveIcon />
                </IconButton> */}
                    <IconButton
                      sx={{ width: 24, height: 24 }}
                      className="margin1"
                      edge={"end"}
                      aria-label="delete"
                      onClick={(e) => {
                        const lat =
                          layer.latlngs.reduce(function (
                            accumulator,
                            curValue
                          ) {
                            return accumulator + curValue.lat;
                          },
                          0) / layer.latlngs.length;
                        const lng =
                          layer.latlngs.reduce(function (
                            accumulator,
                            curValue
                          ) {
                            return accumulator + curValue.lng;
                          },
                          0) / layer.latlngs.length;
                        // [lat, lng] are the centroid of the polygon
                        props.selectAOIHandler([lat, lng], 17);
                      }}
                    >
                      <ZoomInMap fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItemWithWiderSecondaryAction>
              ))}
          </List>
        </Demo>
        {props.mapLayers && props.mapLayers.length === 0 && (
          <Typography variant="body1" component="h2">
            No AOIs yet, start creating one by selecting AOIs on the top and
            create a polygon
          </Typography>
        )}
      </Grid>
    </>
  );
};
export default AOI;
