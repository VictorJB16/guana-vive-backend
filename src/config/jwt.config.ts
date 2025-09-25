import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret:
    process.env.JWT_SECRET ||
    'tu_clave_secreta_muy_segura_aqui_cambiala_en_produccion',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshSecret:
    process.env.JWT_REFRESH_SECRET ||
    'tu_clave_secreta_refresh_muy_segura_aqui',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));
