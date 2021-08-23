import axios from 'axios';
import MediaCard from 'components/MediaCard/MediaCard';
import React, { FC, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Cars } from 'types/cars';

import useTypeSelector from 'components/hooks/useTypeSelector';
import fetchCars from 'store/actionCreator/cars';
import Loader from 'UI/Loader';
import useStyles from './styles';

const Favorites: FC = () => {
  const classes = useStyles();
  const { cars, error, loading } = useTypeSelector((state) => state.cars);
  const [userFavorites, setUserFavorites] = useState<[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCars());
    showFavorites();
  }, []);

  const showFavorites = async () => {
    const userID = JSON.parse(localStorage.getItem('userID') as string);
    try {
      const getUser = await axios({
        method: 'get',
        url: `http://localhost:3000/users/${userID}`,
      });
      const userFav = getUser.data.favorites;
      setUserFavorites(userFav);
    } catch (e) {
      throw Error(e);
    }
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }
  if (error) {
    return <p>Error</p>;
  }

  return (
    <>
      {userFavorites ? (
        <div className={classes.wrapperCars}>
          {cars.map((car: Cars) => {
            const a = userFavorites.filter((el) => car.id === el);
            if (car.id === +a) {
              return (
                <MediaCard
                  id={car.id}
                  key={car.id}
                  image={car.image}
                  brand={car.brand}
                  color={car.color}
                  year={car.year}
                  engineType={car.engineType}
                  fuelType={car.fuelType}
                  transmission={car.transmission}
                />
              );
            }
            return null;
          })}
        </div>
      ) : null}
    </>
  );
};

export default Favorites;
