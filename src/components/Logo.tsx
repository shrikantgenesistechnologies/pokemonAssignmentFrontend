import { Box } from '@mui/material';
import PokemonLogo from '../assets/pokemon-logo.svg';

export const Logo = () => {
  return (
    <Box>
      <img src={PokemonLogo} alt="Pokémon Logo" width={200} />
    </Box>
  );
};
