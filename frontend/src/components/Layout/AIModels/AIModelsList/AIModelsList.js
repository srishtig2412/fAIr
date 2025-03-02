import React, { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import axios from '../../../../axios'
import Alert from '@material-ui/lab/Alert';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import { useNavigate } from 'react-router-dom';
import ArchiveIcon from '@material-ui/icons/Archive';
import { modelStatus } from '../../../../utils';
import OSMUser from '../../../Shared/OSMUser';

const DEFAULT_FILTER = {"items":[{"columnField":"created_date","id":8537,"operatorValue":"contains"}],"linkOperator":"and","quickFilterValues":[],"quickFilterLogicOperator":"and"}
const AIModelsList = props => {

    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const getModels = async () => {

        try {


            const res = await axios.get("/model");

            if (res.error)
                setError(res.error.response.statusText);
            else {
                console.log("getmodel", res.data)

                return res.data;
            }
        } catch (e) {
            setError(e)

        } finally {

        }
    };
    const { data, isLoading ,refetch } = useQuery("getModels", getModels, { refetchInterval: 60000 });

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: 'Name',
        },
        {
            field: 'created_at',
            headerName: 'Created at',
            minWidth:170,
            valueGetter: (params) => {

                return params.value && new Date(params.value).toLocaleString();
            }
        },
        {
            field: 'last_modified',
            headerName: 'Last modified at',
            minWidth:170,
            valueGetter: (params) => {
                return params.value && new Date(params.value).toLocaleString();
            }
            ,
        },
        {
            field: 'created_by',
            headerName: 'User',
            minWidth: 120,
             renderCell: (params) => {
                return  <OSMUser uid={params.value}></OSMUser> 
                ;
            }
        },
        {
            field: 'dataset',
            headerName: 'Dataset ID',
         
            renderCell: (params) => {
                return <span> {params.value}</span>
                ;
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => {
                return <>{`${modelStatus(params.value)}`}</>;
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 110,
            renderCell: (params) => {
                return <><Tooltip title="Edit dataset" aria-label="Edit">
                <IconButton aria-label="comments"
                
                    onClick={(e) => {
                        navigate(`/ai-models/${params.row.id}`)
                    }}>
                    <EditIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Archive dataset" aria-label="Archive">
                <IconButton aria-label="comments"
                className='margin1'
                    onClick={(e) => {
                       console.log('call Archive')
                    }}>
                    <ArchiveIcon />
                </IconButton>
            </Tooltip>
            </>
                //  <p>{`${params.row.status} and id ${params.row.id}`}</p>;
            }
        }

    ];

    return <>

        <Grid container padding={2} spacing={2}>
            <Grid item xs={9}>
                <Typography variant="h6" component="div">
                    fAIr AI Models
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Grid container justifyContent="flex-end">

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={()=> {navigate("/ai-models/new")}}
                    >
                        Create New
                    </Button>
                </Grid>

            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1" component="div">
                    Description about the list of models
                </Typography>
            </Grid>
            {error &&
                <Grid item xs={12}>
                    <Alert severity="error">{error}</Alert>

                </Grid>}
            <Grid item xs={12}>
                {isLoading && <p>Loading ... </p>}
                {!isLoading && <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        onFilterModelChange={(filter)=> { console.log('grid filter',filter); localStorage.setItem('modelFilter',JSON.stringify(filter)); refetch();}}
                        onSortModelChange={(sorter)=> { console.log('grid sorter',sorter); localStorage.setItem('modelSorter', JSON.stringify(sorter)); refetch();}}
                        filterModel={localStorage.getItem('modelFilter') ? JSON.parse(localStorage.getItem('modelFilter')) : DEFAULT_FILTER}
                        sortModel={localStorage.getItem('modelSorter')? JSON.parse(localStorage.getItem('modelSorter')) : []}
                        // TODO: BUG when no filter sorter check
                    />
                </div>}

            </Grid>

        </Grid>
    </>;
}

export default AIModelsList;