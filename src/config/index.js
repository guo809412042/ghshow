import development from './dev';
import test from './stage';
import production from './prod';

export default {
  development,
  test,
  production,
}[process.env.BUILD_ENV || 'development'];
