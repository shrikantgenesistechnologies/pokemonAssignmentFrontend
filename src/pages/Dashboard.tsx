import React, { Fragment, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Box, Tooltip, Typography } from '@mui/material';
import { ThumbUpOffAlt, ThumbDownOffAlt } from '@mui/icons-material';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPokemonLists, updatePokemonStatus } from '../features/slices/pokemon-slice';
import { getCookie } from '../utils/cookieHelper';
import { fetchUserDetails } from '../features/slices/auth-slice';
import Loader from '../components/Loader';

const PokemonTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isFavoriteClick, setIsFavoriteClick] = React.useState(false);
  const { id, token } = useAppSelector((state) => state.user.user);
  const { listofPokemon, metadata, skip, take } = useAppSelector((state) => state.pokemon.pokemon);
  const [paginationModel, setPaginationModel] = React.useState({
    page: metadata.page,
    pageSize: take,
  });
  const authToken = getCookie('accessToken');
  const userId = getCookie('id');

  useEffect(() => {
    if (!authToken) {
      navigate('/login', { replace: true });
      return;
    }

    dispatch(fetchUserDetails({ id: userId ?? id }));
  }, [dispatch, token, skip, id, navigate, authToken, userId]);

  useEffect(() => {
    if (authToken) {
      setPaginationModel({ page: 0, pageSize: take });
    }
  }, [authToken, take]);

  const fetchPokemon = (page = 0, pageSize = take) => {
    const skipValue = page * pageSize;
    dispatch(fetchPokemonLists({ skip: skipValue, take: pageSize }));
  };

  useEffect(() => {
    if (authToken) {
      fetchPokemon(paginationModel.page, paginationModel.pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page, paginationModel.pageSize, authToken]);

  const handlePagination = (event: { page: number; pageSize: number }) => {
    setPaginationModel({
      page: event.page,
      pageSize: event.pageSize,
    });
  };

  const handleAction = (id: string, status: string) => {
    setIsFavoriteClick(!isFavoriteClick);
    dispatch(updatePokemonStatus({ id, status }));
  };

  const columns: GridColDef[] = [
    {
      field: 'imageUrl',
      headerName: 'Image',
      flex: 1,
      minWidth: 300,
      sortable: false,
      disableReorder: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.name}
          style={{ width: 50, height: 50, borderRadius: '5px' }}
        />
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 300,
      sortable: true,
      disableReorder: true,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 300,
      sortable: false,
      disableReorder: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box>
          <Tooltip
            title={params.row.userFavoriteStatus === 'like' ? 'unlike' : 'like'}
            placement="left"
          >
            <Button
              variant="contained"
              size="small"
              onClick={() => handleAction(params.row.id, 'like')}
              sx={{
                backgroundColor: 'white',
                color: 'black',
                border: '1px solid gray',
                marginRight: 1,
              }}
            >
              <ThumbUpOffAlt
                sx={{ color: params.row.userFavoriteStatus === 'like' ? 'green' : 'black' }}
              />{' '}
              {params.row.totalLike}
            </Button>
          </Tooltip>
          <Tooltip
            title={params.row.userFavoriteStatus === 'dislike' ? 'remove dislike' : 'dislike'}
            placement="right"
          >
            <Button
              variant="contained"
              size="small"
              onClick={() => handleAction(params.row.id, 'dislike')}
              sx={{ backgroundColor: 'white', color: 'black', border: '1px solid gray' }}
            >
              <ThumbDownOffAlt
                sx={{ color: params.row.userFavoriteStatus === 'dislike' ? 'red' : 'black' }}
              />{' '}
              {params.row.totalDislike}
            </Button>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Fragment>
      {!userId && <Loader />}
      {userId && (
        <>
          <Header />
          <Box
            id="pokemon-grid"
            sx={{ width: '100%', marginTop: '100px', height: '700px', top: '0px' }}
          >
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
              Pokémon Grid
            </Typography>
            <DataGrid
              rows={listofPokemon}
              columns={columns}
              disableRowSelectionOnClick
              disableColumnMenu
              disableColumnResize={true}
              paginationMode="server"
              paginationModel={paginationModel}
              sortingOrder={['asc', 'desc']}
              rowCount={metadata.totalRecords}
              pageSizeOptions={[20, 50, 100]}
              onPaginationModelChange={handlePagination}
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  position: 'sticky',
                  top: 0,
                  backgroundColor: 'white',
                  zIndex: 1,
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold',
                  fontSize: '15px',
                },
              }}
            />
          </Box>
        </>
      )}
    </Fragment>
  );
};

export default PokemonTable;
